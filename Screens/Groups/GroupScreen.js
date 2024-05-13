import React from "react";
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

  const group = route.params.group;
  const constestInfo = getTodaysGroupContest(group, state.groupsContestData);

  return (
    <View style={styles.screen}>
      <View style={{ padding: 20 }}>
        <CardContainer>
          <View style={styles.cardContents}>
            <Text style={styles.promptTitle}>Today's Prompt</Text>
            <Text style={styles.prompt}>{constestInfo.prompt}</Text>
            <Countdown style={styles.countdown} deadline={group.votingTime} />
            <MemberListBubbles group={group} groupContests={state.groupsContestData} />
            <Button
              title={`${hasUserSubmittedToGroup(group, state.userData, state.groupsContestData) ? "Resubmit" : "Submit"} Your Photo`}
              onPress={() => {
                navigation.navigate('Main Camera Screen', { group })
              }
              } />
          </View>
        </CardContainer>
      </View>
      <CommentSection group={group} />
    </View>
  )
};

export default GroupScreen;

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