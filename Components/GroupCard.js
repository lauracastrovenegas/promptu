import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import CardContainer from './CardContainer';
import theme from '../theme';
import MemberListBubbles from './MemberListBubbles';
import GroupPhotoName from './GroupPhotoName';

const GroupCard = ({ group }) => {
  return (
    <CardContainer>
      <View style={styles.row}>
        <GroupPhotoName group={group} />
        <View style={styles.promptAndMembers}>
          <Text style={styles.prompt}>{group.prompt}</Text>
          <MemberListBubbles group={group} />
        </View>
      </View>
    </CardContainer>
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
  groupPicAndName: {
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
