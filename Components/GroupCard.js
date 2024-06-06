import React from 'react';
import { Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import CardContainer from './CardContainer';
import theme from '../theme';
import MemberListBubbles from './MemberListBubbles';
import GroupPhotoName from './GroupPhotoName';
import { getTodaysGroupContest, getCurrentTimePDT } from '../Functions/utils';
import { useAppContext } from '../AppContext';


const GroupCard = ({ groupContests, group }) => {
  const { isLoading } = useAppContext();

  if (isLoading) {
    return <View><ActivityIndicator /></View>;
  }

  const contestInfo = getTodaysGroupContest(group, groupContests);
  /* 
  const currentTime = getCurrentTimePDT();
  // Highlight box if its voting time
  const highlightBox = contestInfo ? !contestInfo.hasVotingOccurred && currentTime >= (19 * 60) : false; */

  return (
    <CardContainer>
      <View style={styles.row}>
        <GroupPhotoName group={group} />
        <View style={styles.promptAndMembers}>
          <Text style={styles.prompt}>{contestInfo ? contestInfo.prompt : ""}</Text>
          <MemberListBubbles group={group} groupContests={groupContests} />
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
    marginBottom: 'auto',
    fontSize: 16,
    paddingBottom: 10,
  }
});


export default GroupCard;



