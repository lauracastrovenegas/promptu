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
  row: {
    flexDirection: 'row',
    gap: 20,
  },
  promptAndMembers: {
    flex: 3,
    justifyContent: 'center',
  },
  prompt: {
    textAlign: 'center',
    marginBottom: 'auto',
    fontSize: 16,
  }
});

export default GroupCard;
