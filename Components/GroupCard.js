import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import CardContainer from './CardContainer';
import { FontAwesome6 } from '@expo/vector-icons';
import theme from '../theme';

const GroupCard = ({ group }) => {
  const memberSubmissions = getMemberSubmissions();

  // Goes through all members and the submissions and returns whether each member has submitted or not
  function getMemberSubmissions() {
    const members = group.members;
    const submissions = group.submissions;

    const memberSubmissions = members.map(member => {
      const memberSubmission = submissions.find(submission => submission.userId === member.id);

      return { 
        userPhoto: member.photo, 
        hasSubmitted: memberSubmission ? true : false 
      };
    });

    return memberSubmissions;
  }

  return (
    <CardContainer>
      <View style={styles.row}>
        <View style={styles.gropuPicAndName}>
          <GroupPhoto groupPhoto={group.groupPhoto} />
          <Text style={styles.groupName} numberOfLines={1}>{group.name}</Text>
        </View>
        <View style={styles.promptAndMembers}>
          <Text style={styles.prompt}>{group.prompt}</Text>
          <View style={styles.centerImages}>
            {memberSubmissions.map((memberSubmission, index) => (
              <UserBubble
                key={index}
                userPhoto={memberSubmission.userPhoto}
                hasSubmitted={memberSubmission.hasSubmitted}
              />
            ))}
          </View>
        </View>
      </View>
    </CardContainer>
  );
};

const UserBubble = ({ userPhoto, hasSubmitted }) => {
  return (
    <View>
      <Image style={styles.userPhoto} source={userPhoto} />
      {hasSubmitted && <FontAwesome6 style={styles.check} name="check" size={12} color={theme.colors.green} />}
    </View>
  );
}

const GroupPhoto = ({ groupPhoto }) => {
  return (
    <View style={styles.centerImages}>
      {groupPhoto ?
        <Image style={styles.groupPhoto} source={groupPhoto} />
        :
        <View style={styles.groupPhotoIcon}>
          <FontAwesome6 name="users" size={30} color={theme.colors.white} />
        </View>}
    </View>
  );
};

const styles = StyleSheet.create({
  groupName: {
    fontSize: 15,
    fontFamily: 'PatrickHand_400Regular',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 20,
  },
  gropuPicAndName: {
    flex: 1,
    gap: 5,
  },
  groupPhoto: {
    width: 75,
    height: 75,
    borderRadius: 50,
  },
  groupPhotoIcon: {
    backgroundColor: theme.colors.lightPurple,
    width: 75,
    height: 75,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promptAndMembers: {
    flex: 3,
    justifyContent: 'center',
  },
  prompt: {
    textAlign: 'center',
    marginBottom: 'auto',
    fontSize: 16,
  },
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

export default GroupCard;
