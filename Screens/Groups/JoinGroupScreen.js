import React from "react";
import { useState } from "react";
import { Text, Image, View, StyleSheet, Alert } from "react-native";
import { useAppContext } from "../../AppContext";
import CardContainer from '../../Components/CardContainer';
import UserPhotoName from '../../Components/UserPhotoName';
import Button from "../../Components/Button";
import theme from '../../theme';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import SingleInput from "../../Components/SingleInput";
// import * as Linking from 'expo-linking';

/* This component is the Join Group Screen  */
const JoinGroupScreen = ({ navigation }) => {
  const { state } = useAppContext();
  const [group, setGroup] = useState(null);
  const [joinCode, setJoinCode] = useState('');

  async function handleJoinGroup() {
    const groupId = joinCode;

    try {
      const docRef = doc(db, "groups", groupId);
      const groupDoc = await getDoc(docRef);

      if (groupDoc.exists()) {
        const groupData = groupDoc.data();
        setGroup(groupData);

        const requests = groupData.memberRequests;
        await updateDoc(docRef, {
          memberRequests: [...requests, state.userData.uid]
        });
        Alert.alert(
          "You requested to join " + groupData.groupName + "! The group owner must now approve your request.",
          "",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Groups Screen")
            }
          ]
        );

      } else {
        console.log("No group document exists.");
      }
    } catch (error) {
      Alert.alert("Error Requesting to Join Group", error.message);
    }
  }

  return (
    <View style={styles.screen}>
      {group ? (
        <View style={styles.topSection}>
          <Text style={styles.groupName}>{group.groupName}</Text>
          <GroupPhoto groupPhoto={group.photoURL} />
          <Members members={group.members} />
        </View>
      ) : (
        <View style={styles.topSection}>
          <SingleInput placeholder="Enter invite code..." onChangeText={setJoinCode} text={joinCode} passwordBool={false} />
        </View>
      )}
      <View>
        <Button
          title={`Join Group`}
          onPress={() => {
            handleJoinGroup()
          }}
          disabled={joinCode === ''}
        />
      </View>
    </View>
  )
};

const GroupPhoto = ({ groupPhoto }) => {
  return (
    <View style={styles.centerImage}>
      <Image style={styles.groupPhoto} source={{ uri: groupPhoto }} />
    </View>
  );
};

const Members = ({ members }) => {
  return (
    <CardContainer>
      <View style={styles.membersContainer}>
        <Text style={styles.membersText}>Members</Text>
        <View style={styles.members}>
          {members.map((user, index) => (
            <UserPhotoName
              key={index}
              user={user}
            />
          ))}
        </View>
      </View>
    </CardContainer>
  );
};

export default JoinGroupScreen;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.white,
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
    gap: 20,
    color: theme.colors.black,
    flex: 1,
  },
  topSection: {
    alignItems: 'center',
    marginTop: 70,
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  groupPhoto: {
    width: 150,
    height: 150,
    borderRadius: 150,
    marginBottom: 30
  },
  centerImage: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  groupName: {
    fontSize: 60,
    fontFamily: "PatrickHandSC_400Regular",
    textAlign: 'center',
  },
  membersText: {
    fontSize: 24,
    paddingBottom: 15,
  },
  members: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 5,
    justifyContent: "space-around",
    gap: 5,
  },
  membersContainer: {
    width: 300
  },
});