import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Button from '../../../Components/Button';
import PolaroidPhoto from '../../../Components/PolaroidPhoto';
import theme from '../../../theme';
import { useAppContext } from "../../../AppContext";
import { getTodaysGroupContest } from '../../../Functions/utils';

const WinnerAnnouncementScreen = ({ route, navigation }) => {
  const group = route.params.group;
  const { state } = useAppContext();
  const groupContest = getTodaysGroupContest(group, state.groupsContestData);
  const winner = groupContest.winner;
  const winnerSubmission = groupContest.submissions.filter(submission => submission.userId === winner.uid)[0];

  function choosePromptOrWait() {
    if (winner.uid === state.userData.uid) {
      navigation.navigate('Choose Prompt Screen', { group });
    } else {
      navigation.navigate('Group Screen', { group, contestInfo: groupContest });
    }
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{winner.displayName} Wins!</Text>
      <View style={styles.topSection}>
      <PolaroidPhoto image={winnerSubmission.photo} caption={winnerSubmission.caption}/>
      </View>
      <Button
        title="Continue"
        onPress={choosePromptOrWait} />
    </View>
  );
};

export default WinnerAnnouncementScreen;

const styles = StyleSheet.create({
  screen: {
    flexDirection: 'column',
    padding: 20,
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  topSection: {
    flex: 1,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontFamily: 'PatrickHandSC-Regular',
    marginBottom: 20,
    textAlign: 'center',
  },
});