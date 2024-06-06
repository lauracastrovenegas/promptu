import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Button from '../../../Components/Button';
import PolaroidPhoto from '../../../Components/PolaroidPhoto';
import theme from '../../../theme';
import { useAppContext } from "../../../AppContext";
import { db } from "../../../config/firebase";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { getTodaysGroupContest } from '../../../Functions/utils';
import MemberVoteStatusBubbles from '../../../Components/MemberVoteStatusBubbles';
import useGroupContest from '../../../hooks/useGroupContest';

const WaitingScreen = ({ route, navigation }) => {
  const { dispatch, state } = useAppContext();
  const group = route.params.group;
  const contestInfo = getTodaysGroupContest(group, state.groupsContestData);
  const { groupContest, loading } = useGroupContest(contestInfo.id);

  function getWinner(groupContest) {
    const votes = groupContest.votes;

    // Create a map to count the votes for each member
    const voteCount = {};
    votes.forEach(vote => {
      if (voteCount[vote]) {
        voteCount[vote]++;
      } else {
        voteCount[vote] = 1;
      }
    });

    // Find the maximum number of votes
    const maxVotes = Math.max(...Object.values(voteCount));

    // Collect all members who received the maximum number of votes
    const winners = group.members.filter(member => voteCount[member.uid] === maxVotes);

    return winners;
  }

  useEffect(() => {
    async function checkForWinner() {
      if (!groupContest) {
        return;
      }

      console.log("Checking for winner...");

      const needNumVotes = groupContest.submissions.length === 3 ? (groupContest.submissions.length) : (groupContest.submissions.length * 3);
      if (groupContest.votes.length === needNumVotes) {
        const winner = getWinner(groupContest);
        console.log("WINNER(S): ", winner)
        // set voting to have occured & update winner
        try {
          await updateDoc(doc(db, 'group_contests', groupContest.id), {
            hasVotingOccurred: true,
            winner: winner
          });
        } catch (error) {
          Alert.alert("Error updating group contest doc to indicate voting has occured.", error.message);
        }
  
        dispatch({ type: 'UPDATE_GROUP_CONTEST_DATA', payload: { ...groupContest, hasVotingOccurred: true, winner: winner, hasVotingOccurred: true } });
  
        navigation.navigate('Winner Announcement Screen', { group });
      }
    }

    if (groupContest) {
      checkForWinner();
    }
  }, [groupContest]);

  return (
    <View style={styles.screen}>
      <View style={styles.topSection}>
        <Text style={styles.title}>Waiting for others to vote...</Text>
        <MemberVoteStatusBubbles group={group} groupContest={groupContest} loading={loading} />
      </View>
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
    lineHeight: 40,
    marginBottom: 20,
    textAlign: 'center',
  },
});