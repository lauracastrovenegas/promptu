import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import CardContainer from './CardContainer';
import { FontAwesome6 } from '@expo/vector-icons';
import theme from '../theme';
import MemberListBubbles from './MemberListBubbles';

const GroupCard = ({ group }) => {
  return (
    <CardContainer>
      <View style={styles.row}>
        <View style={styles.gropuPicAndName}>
          <GroupPhoto groupPhoto={group.groupPhoto} />
          <Text style={styles.groupName} numberOfLines={1}>{group.name}</Text>
        </View>
        <View style={styles.promptAndMembers}>
          <Text style={styles.prompt}>{group.prompt}</Text>
          <MemberListBubbles group={group} />
        </View>
      </View>
    </CardContainer>
  );
};

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
    fontFamily: theme.fonts.patrickHand,
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
  }
});

export default GroupCard;
