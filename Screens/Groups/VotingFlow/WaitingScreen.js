import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Button from '../../../Components/Button';
import PolaroidPhoto from '../../../Components/PolaroidPhoto';
import theme from '../../../theme';
import { useAppContext } from "../../../AppContext";
import { db } from "../../../config/firebase";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { getTodaysGroupContest } from '../../../Functions/utils';

const WaitingScreen = ({ route, navigation }) => {
  const { fetchGroupContestData, dispatch } = useAppContext();
  const group = route.params.group;

  function getWinner(groupContestData) {
    const groupContest = getTodaysGroupContest(group, groupContestData);
    const votes = groupContest.votes;

    // easy mode calculation
    const winnerId = votes.sort((a, b) => votes.filter(v => v===a).length - votes.filter(v => v===b).length).pop();

    const winner = group.members.filter(member => member.uid === winnerId)[0];
    return winner;
  }

  function reloadData() {
    const fetchData = async () => {
      const groupContestData = await fetchGroupContestData([group.id]);
      dispatch({ type: 'UPDATE_GROUP_CONTEST_DATA', payload: {id: group.id, data: groupContestData[0] }});

      const needNumVotes = groupContestData[0].submissions.length === 3 ? (groupContestData[0].submissions.length) : (groupContestData[0].submissions.length * 3);
      if (groupContestData[0].votes.length === needNumVotes) {
        const winner = getWinner(groupContestData);
        // set voting to have occured & update winner
        try {
          await updateDoc(doc(db, 'group_contests', group.id), {
            hasVotingOccurred: true,
            winner: winner
          });
        } catch (error) {
          Alert.alert("Error updating group contest doc to indicate voting has occured.", error.message);
        }

        dispatch({ type: 'UPDATE_GROUP_CONTEST_DATA', payload: {id: group.id, data: {...groupContestData[0], hasVotingOccurred: true, winner: winner, hasVotingOccurred: true }}});

        navigation.navigate('Winner Announcement Screen', { group });
      }
    };

    fetchData();
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topSection}>
        <Text style={styles.title}>Waiting for others to vote...</Text>
      </View>
      <Button
        title="Reload"
        onPress={reloadData} />
    </View>
  );
};

export default WaitingScreen;

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