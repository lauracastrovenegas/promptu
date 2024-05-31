import React from 'react';
import { Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import CardContainer from './CardContainer';
import theme from '../theme';
import MemberListBubbles from './MemberListBubbles';
import GroupPhotoName from './GroupPhotoName';
import { getTodaysGroupContest } from '../Functions/utils';
import { useAppContext } from '../AppContext';


const GroupCard = ({ groupContests, group }) => {
  const { isLoading } = useAppContext();

  if (isLoading) {
    return <View><ActivityIndicator/></View>;
  }

 const constestInfo = getTodaysGroupContest(group, groupContests);
 return (
   <CardContainer>
     <View style={styles.row}>
       <GroupPhotoName group={group} />
       <View style={styles.promptAndMembers}>
         <Text style={styles.prompt}>{constestInfo.prompt}</Text>
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
   textAlign: 'center',
   marginBottom: 'auto',
   fontSize: 16,
 }
});


export default GroupCard;



