import React from "react";
import { Text, Image, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useAppContext } from "../../AppContext";
import MemberRequestCard from '../../Components/MemberRequestCard';
import theme from '../../theme';
import GroupLink from '../../Components/GroupLink';

/* This component is the Share Group Screen  */
const ShareGroupScreen = ({ route }) => {
  const { state, isLoading } = useAppContext();
  let group = null;
  if (route.params.groupData) {
    group = route.params.groupData
  } else {
    group = route.params.group;
  }
  console.log("group: ", group)

  let inviteCode = null;

  if (!group.inviteCode) {
    inviteCode = route.params.inviteCode; // Get invite link from params
  } else {
    inviteCode = group.inviteCode;
  }
  console.log(inviteCode)
  return (
    <ScrollView style={{ backgroundColor: theme.colors.white }}>
      {isLoading || !group ? <Text>Loading...</Text>
        : <View style={styles.screen}>
          <Text style={styles.groupName}>{group.groupName}</Text>
          <GroupPhoto groupPhoto={group.photoURL} />
          <Text style={styles.linkDescription}>Get friends to join by sharing the code below:</Text>
          <GroupLink link={inviteCode} />
          <Text style={styles.memberReqsTitle}>Member Requests</Text>
          <View style={styles.requests}>
            {group.memberRequests.map((user, index) => (
              <MemberRequestCard
                key={index}
                user={user}
                group={group}
              />
            ))}
          </View>
        </View>}
    </ScrollView>
  )
};

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