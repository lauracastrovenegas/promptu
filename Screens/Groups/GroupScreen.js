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
import GroupLink from "../../Components/GroupLink";

/* This component is the Individual Group Screen  */
const GroupScreen = ({ route, navigation }) => {
  const { state } = useAppContext();
  const [votingStage, setVotingStage] = useState(0);

  const group = route.params.group;

  if (group.members.length < 3) {
    return (
      <View style={styles.screen}>
        <View style={styles.addMoreMembersMessage}>
          <Text style={styles.largePromptTitle}>You need at least 3 members to complete your group! Share the joining code with more friends to begin!</Text>
          <GroupLink link={group.inviteCode} />
        </View>
      </View>
    );
  }

  const contestInfo = route.params.contestInfo;
  const hasUserSubmitted = contestInfo.submissions.map(submission => submission.userId).includes(state.userData.uid);

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
    if (contestInfo.hasVotingOccurred) {
      return <ResultsBox group={group} contestInfo={contestInfo} />;
    }

    switch (votingStage) {
      case 0:
        return <DailyPromptInfoBox group={group} contestInfo={contestInfo} hasUserSubmitted={hasUserSubmitted} onSubmit={() => navigation.navigate('Main Camera Screen', { group })} />;
      case 1:
        const navTo = contestInfo.submissions.length >= 3 ? (contestInfo.submissions.length == 3 ? 'Second Voting Screen' : 'First Voting Screen') : 'Choose Prompt Screen';
        return <VotingBox group={group} contestInfo={contestInfo} hasUserSubmitted={hasUserSubmitted} onSubmit={() => navigation.navigate(navTo, { group })} />;
      case 2:
        if (contestInfo.submissions.length < 3) {
          return <VotingBox group={group} contestInfo={contestInfo} hasUserSubmitted={hasUserSubmitted} onSubmit={() => navigation.navigate('Choose Prompt Screen', { group })} />;
        }
        return <ResultsBox group={group} contestInfo={contestInfo} />;
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

const DailyPromptInfoBox = ({ group, contestInfo, hasUserSubmitted, onSubmit }) => {
  const { state } = useAppContext();
  return (
    <CardContainer>
      <View style={styles.cardContents}>
        <Text style={styles.promptTitle}>Today's Prompt</Text>
        <Text style={styles.prompt}>{contestInfo ? contestInfo.prompt : ""}</Text>
        <Countdown style={styles.countdown} deadline={group.votingTime} />
        <MemberListBubbles group={group} groupContests={state.groupsContestData} />
        <Button
          title={`${hasUserSubmitted ? "Resubmit" : "Submit"} Your Photo`}
          onPress={onSubmit}
        />
      </View>
    </CardContainer>
  );
}

const VotingBox = ({ group, contestInfo, hasUserSubmitted, onSubmit }) => {
  const voteButton = hasUserSubmitted ? <Button title="Vote" onPress={onSubmit} /> : null;

  return (
    <CardContainer>
      <View style={styles.cardContents}>
        {contestInfo.submissions.length < 3 ?
          <Text style={styles.largePromptTitle}>You need at least 3 photos to vote, today you only had {contestInfo.submissions.length}!</Text>
          : <Text style={styles.largePromptTitle}>{hasUserSubmitted ? "It's time to vote!" : "You didn't submit today :( Wait for your friends to vote."}</Text>
        }
        <MemberListBubbles group={group} />
        {contestInfo.submissions.length < 3 ? <Button title="Continue" onPress={onSubmit} /> : voteButton}
      </View>
    </CardContainer>
  );
}

const ResultsBox = ({ contestInfo }) => {
  return (
    <CardContainer>
      {contestInfo.winner &&
        <View style={styles.cardContentsRow}>
          <View style={styles.winner}>
            <Text style={styles.promptTitle}>Today's Winner</Text>
            <View style={styles.centerImage}>
              <Image source={contestInfo.winner && contestInfo.winner.photoURL ? { uri: contestInfo.winner.photoURL } : require('../../assets/default_profile_picture.png')} style={styles.image} />
            </View>
            <Text style={styles.prompt}>{contestInfo.winner.displayName}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <PolaroidPhoto small image={contestInfo.submissions.filter(s => s.userId === contestInfo.winner.uid)[0].photo} caption={contestInfo.submissions.filter(s => s.userId === contestInfo.winner.uid)[0].caption} />
          </View>
        </View>}
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
  },
  addMoreMembersMessage: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'center',
    height: '100%',
    padding: 20,
    gap: 40,
  }
});