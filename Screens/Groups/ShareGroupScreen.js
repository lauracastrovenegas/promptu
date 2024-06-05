import React, { useEffect, useCallback, useState } from "react";
import { Text, Image, View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useAppContext } from "../../AppContext";
import MemberRequestCard from '../../Components/MemberRequestCard';
import theme from '../../theme';
import GroupLink from '../../Components/GroupLink';
import { getGroupData } from "../../config/firebase";

/* This component is the Share Group Screen  */
const ShareGroupScreen = ({ route }) => {
  const { state, isLoading, dispatch } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);
  const [group, setGroup] = useState(null);
  const [inviteCode, setInviteCode] = useState(null);

  useEffect(() => {
    setGroup(route.params.group);

    if (route.params.inviteCode) {
      setInviteCode(route.params.inviteCode);
    } else {
      setInviteCode(route.params.group.inviteCode);
    }
  }, []);

  const onRefresh = async (groupId, userId) => {
    console.log("Refreshing share group screen...");
    try {
      setRefreshing(true);
      const groupData = await getGroupData(userId);
      const updatedGroup = groupData.find(groupObject => groupId === groupObject.id);
      setGroup(updatedGroup);
      setInviteCode(updatedGroup.id);
      dispatch({ type: 'SET_GROUPS_DATA', payload: groupData });

      setRefreshing(false);
    } catch (error) {
      console.error("Error refreshing group screen: ", error);
      console.log(state.userData);
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.white }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => onRefresh(group.id, state.userData.uid)} />
      }>
      {isLoading || !group ? <Text>Loading...</Text>
        : <View style={styles.screen}>
          <Text style={styles.groupName}>{group.groupName}</Text>
          <GroupPhoto groupPhoto={group.photoURL} />
          <Text style={styles.linkDescription}>Get friends to join by sharing the code below:</Text>
          <GroupLink link={inviteCode} />
          <Text style={styles.memberReqsTitle}>Member Requests</Text>
          <MemberRequests group={group} />
        </View>}
    </ScrollView>
  )
};

const MemberRequests = ({ group }) => {

  useEffect(() => {
    console.log("Member requests updated");
  }, [group.memberRequests]);

  return (
    <View style={styles.requests}>
      {group.memberRequests.length === 0 &&
        <Text>No member requests at this time.</Text>
      }
      {group.memberRequests.map((user, index) => (
        <MemberRequestCard
          key={index}
          user={user}
          group={group}
        />
      ))}
    </View>
  );
}

const GroupPhoto = ({ groupPhoto }) => {
  return (
    <View style={styles.centerImage}>
      <Image style={styles.groupPhoto} source={{ uri: groupPhoto }} />
    </View>
  );
};

export default ShareGroupScreen;

const styles = StyleSheet.create({
  screen: {
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
    gap: 20,
    color: theme.colors.black
  },
  groupPhoto: {
    width: 150,
    height: 150,
    borderRadius: 150,
  },
  centerImage: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  groupName: {
    padding: 10,
    fontSize: 60,
    fontFamily: "PatrickHandSC_400Regular",
    textAlign: 'center',
  },
  linkDescription: {
    fontSize: 16,
    paddingTop: 10,
  },
  groupLink: {
    flexDirection: 'row',
    gap: 20,
  },
  groupLinkText: {
    flex: 2,
    fontSize: 16,
  },
  memberReqsTitle: {
    fontSize: 36,
    fontFamily: "PatrickHandSC_400Regular",
    paddingLeft: 25
  },
  requests: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 20,
    gap: 20,
  }
});