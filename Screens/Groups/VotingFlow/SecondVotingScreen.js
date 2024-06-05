import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Button from '../../../Components/Button';
import PolaroidPhoto from '../../../Components/PolaroidPhoto';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { getTodaysGroupContest } from '../../../Functions/utils';
import theme from '../../../theme';
import { useAppContext } from "../../../AppContext";

const SecondVotingScreen = ({ route, navigation }) => {
  const { state, isLoading, addVoteToGroup } = useAppContext();
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  if (isLoading) {
    return <View style={styles.screen}><ActivityIndicator size="large"/></View>;
  }
  
  const group = route.params.group;
  const topChoice = route.params.topChoice;

  const contest = getTodaysGroupContest(group, state.groupsContestData);
  const submissions = contest.submissions.filter(submission => submission.userId !== topChoice && submission.userId !== state.userData.uid);

  async function submitVote() {
    // topChoice, secondChoice: selectedSubmission
    if (topChoice) {
      await addVoteToGroup(contest.id, topChoice, 2, state.userData.uid);
    }
    await addVoteToGroup(contest.id, selectedSubmission, 1, state.userData.uid);
    navigation.navigate('Waiting Screen', { group });
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topSection}>
        <Text style={styles.promptTitle}>Today's Prompt</Text>
        <Text style={styles.prompt}>{contest.prompt}</Text>
        <Text style={styles.purpleText}>Select your {topChoice ? "second" : "first"} choice!</Text>
        <ScrollView>
          <View style={{paddingHorizontal: 10, paddingTop: 5}}>
            {submissions.map(submission => (
              <TouchableOpacity key={submission.userId} onPress={() => setSelectedSubmission(submission.userId)}>
                <PolaroidPhoto image={submission.photo} caption={submission.caption} selectedValue={selectedSubmission === submission.userId ? 1 : 0}/>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      <Button
        title="Submit Vote"
        onPress={submitVote} />
    </View>
  );
};

export default SecondVotingScreen;

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
  },
  promptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  prompt: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  purpleText: {
    fontSize: 23,
    color: theme.colors.purple,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});