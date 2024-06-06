import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, ActivityIndicator } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import theme from '../theme';
import { getTodaysGroupContest } from '../Functions/utils';
import { useAppContext } from '../AppContext';
import useGroupContest from '../hooks/useGroupContest';

const MemberVoteStatusBubbles = ({ group, groupContest, loading }) => {
  const { state, isLoading } = useAppContext();

  if (isLoading || loading) {
    return <View><ActivityIndicator/></View>;
  }

  const memberVotes = getMemberVotes();

  // Goes through all members and the submissions and returns whether each member has submitted or not
  function getMemberVotes() {
    const members = group.members;
    const hasVoted = groupContest ? groupContest.hasVoted : [];
    const submissions = groupContest ? groupContest.submissions : [];

    // remove any user that is not in the submissions array from the members array
    const membersFiltered = members.filter(user => submissions.find(submission => submission.userId === user.uid));

    const memberVotes = membersFiltered.map(member => {
      const memberVoted = hasVoted.find(userId => userId === member.uid);

      return {
        userPhoto: member.photoURL,
        hasVoted: memberVoted ? true : false
      };
    });

    return memberVotes;
  }

  return (
    <View style={styles.centerImages}>
      {memberVotes.map((member, index) => (
        <UserBubble
          key={index}
          userPhoto={member.userPhoto}
          hasSubmitted={member.hasVoted}
        />
      ))}
    </View>
  );
};

export default MemberVoteStatusBubbles;

const UserBubble = ({ userPhoto, hasSubmitted }) => {
  return (
    <View>
      <Image style={styles.userPhoto} source={userPhoto ? { uri: userPhoto } : require('../assets/default_profile_picture.png')} />
      {hasSubmitted && <FontAwesome6 style={styles.check} name="check" size={12} color={theme.colors.green} />}
    </View>
  );
}

const styles = StyleSheet.create({
  centerImages: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  userPhoto: {
    width: 30,
    height: 30,
    borderRadius: 25,
  },
  check: {
    position: 'absolute',
    top: 2,
    left: 3,
    zIndex: 1,
    fontSize: 25,
  },
});