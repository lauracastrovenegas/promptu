import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import theme from "../../theme";
import MemberListBubbles from "../../Components/MemberListBubbles";
import CardContainer from "../../Components/CardContainer";
import Button from "../../Components/Button";
import { hasUserSubmittedToGroup, getTodaysGroupContest } from "../../Functions/utils";
import { useAppContext } from "../../AppContext";
import Countdown from "../../Components/Countdown";
import CommentSection from "../../Components/CommentSection";
import PolaroidPhoto from "../../Components/PolaroidPhoto";
import user2 from "../../assets/fakeProfilePhotos/user2.png";

/* This component is the Individual Group Screen  */
const GroupScreen = ({ route, navigation }) => {
  const { state } = useAppContext();
  const [votingStage, setVotingStage] = useState(0);

  const group = route.params.group;
  const contestInfo = route.params.contestInfo;

  useEffect(() => {
    // after five seconds, move to the next stage
    setTimeout(() => {
      setVotingStage(1);
    }, 5000);

    // after ten seconds, move to the next stage
    setTimeout(() => {
      setVotingStage(2);
    }, 10000);
  }, []);

  function getBox() {
    switch (votingStage) {
      case 0:
        return <DailyPromptInfoBox group={group} userData={state.userData} contestInfo={contestInfo} onSubmit={() => navigation.navigate('Main Camera Screen', { group })} />;
      case 1:
        return <VotingBox group={group} contestInfo={contestInfo} onSubmit={() => navigation.navigate('First Voting Screen', { group })} />;
      case 2:
        return <ResultsBox group={group} />;
    }
  }

  return (
    <View style={styles.screen}>
      <View style={{ padding: 20 }}>
        {getBox()}
      </View>
      <CommentSection group={group} />
    </View>
  )
};

export default GroupScreen;

const DailyPromptInfoBox = ({ group, userData, contestInfo, onSubmit }) => {
  const { state } = useAppContext();
  return (
    <CardContainer>
      <View style={styles.cardContents}>
        <Text style={styles.promptTitle}>Today's Prompt</Text>
        <Text style={styles.prompt}>{contestInfo ? contestInfo.prompt : ""}</Text>
        <Countdown style={styles.countdown} deadline={group.votingTime} />
        <MemberListBubbles group={group} groupContests={state.groupsContestData} />
        <Button
          title={`${hasUserSubmittedToGroup(group, userData, state.groupsContestData) ? "Resubmit" : "Submit"} Your Photo`}
          onPress={onSubmit}
        />
      </View>
    </CardContainer>
  );
}

const VotingBox = ({ group, onSubmit }) => {
  return (
    <CardContainer>
      <View style={styles.cardContents}>
        <Text style={styles.largePromptTitle}>It's time to vote!</Text>
        <MemberListBubbles group={group} />
        <Button
          title="Vote"
          onPress={onSubmit}
        />
      </View>
    </CardContainer>
  );
}

const ResultsBox = ({ group }) => {
  return (
    <CardContainer>
      <View style={styles.cardContentsRow}>
        <View style={styles.winner}>
          <Text style={styles.promptTitle}>Today's Winner</Text>
          <View style={styles.centerImage}>
            <Image source={user2} style={styles.image} />
          </View>
          <Text style={styles.prompt}>Stacy</Text>
        </View>
        <View style={{ flex: 1 }}>
          <PolaroidPhoto small />
        </View>
      </View>
    </CardContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.white,
    height: '100%',
  },
  cardContents: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  cardContentsRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
  },
  promptTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  largePromptTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
  prompt: {
    fontSize: 16,
    textAlign: 'center',
  },
  countdown: {
    fontSize: 60,
    textAlign: 'center',
    fontFamily: theme.fonts.patrickHand,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 100
  },
  centerImage: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  winner: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'center',
  }
});