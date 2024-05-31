import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, ActivityIndicator } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import theme from '../theme';
import { getTodaysGroupContest } from '../Functions/utils';
import { useAppContext } from '../AppContext';

const MemberListBubbles = ({ group }) => {
  const { state, isLoading } = useAppContext();

  if (isLoading) {
    return <View><ActivityIndicator/></View>;
  }

  const memberSubmissions = getMemberSubmissions();

  // Goes through all members and the submissions and returns whether each member has submitted or not
  function getMemberSubmissions() {
    const members = group.members;
    const constestInfo  = getTodaysGroupContest(group, state.groupsContestData);
    const submissions = constestInfo.submissions;

    const memberSubmissions = members.map(member => {
      const memberSubmission = submissions.find(submission => submission.userId === member.uid);

      return {
        userPhoto: member.photoURL,
        hasSubmitted: memberSubmission ? true : false
      };
    });

    return memberSubmissions;
  }

  return (
    <View style={styles.centerImages}>
      {memberSubmissions.map((memberSubmission, index) => (
        <UserBubble
          key={index}
          userPhoto={memberSubmission.userPhoto}
          hasSubmitted={memberSubmission.hasSubmitted}
        />
      ))}
    </View>
  );
};

export default MemberListBubbles;

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