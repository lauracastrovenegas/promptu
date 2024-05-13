import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import theme from "../../theme";
import MemberListBubbles from "../../Components/MemberListBubbles";
import CardContainer from "../../Components/CardContainer";
import Button from "../../Components/Button";
import { hasUserSubmittedToGroup, getTodaysGroupContest } from "../../Functions/utils";
import { useAppContext } from "../../AppContext";
import Countdown from "../../Components/Countdown";
import CommentSection from "../../Components/CommentSection";

/* This component is the Individual Group Screen  */
const GroupScreen = ({ route, navigation }) => {
  const { state } = useAppContext();
  const [votingStage, setVotingStage] = React.useState(0);

  const group = route.params.group;

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
        return <DailyPromptInfoBox group={group} userData={state.userData} onSubmit={() => navigation.navigate('Main Camera Screen', { group })} />;
      case 1:
        return <VotingBox group={group} onSubmit={() => navigation.navigate('Voting Screen', { group })} />;
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

const DailyPromptInfoBox = ({ group, userData, onSubmit }) => {
  const constestInfo = getTodaysGroupContest(group);

  return (
    <CardContainer>
      <View style={styles.cardContents}>
        <Text style={styles.promptTitle}>Today's Prompt</Text>
        <Text style={styles.prompt}>{constestInfo.prompt}</Text>
        <Countdown style={styles.countdown} deadline={group.votingTime} />
        <MemberListBubbles group={group} />
        <Button
          title={`${hasUserSubmittedToGroup(group, userData) ? "Resubmit" : "Submit"} Your Photo`}
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
        <Text style={styles.promptTitle}>It's time to vote!</Text>
        <Text style={styles.prompt}>Vote for your favorite photos</Text>
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
      <View style={styles.cardContents}>
        <Text style={styles.promptTitle}>Results</Text>
        <Text style={styles.prompt}>So and so is the winner!</Text>
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
  promptTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: -10,
    fontSize: 16,
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
});