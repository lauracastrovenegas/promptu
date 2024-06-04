import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import CardContainer from './CardContainer';
import UserPhotoName from './UserPhotoName';
import Button from "./Button";
import { doc, updateDoc, arrayRemove, arrayUnion, getDoc } from "firebase/firestore";
import { db } from '../config/firebase';

const handleApproval = async (user, groupDocRef, setIsInMemberRequests) => {
  try {
    // Update the group document
    await updateDoc(groupDocRef, {
      memberRequests: arrayRemove(user),
      members: arrayUnion(user)
    });

    console.log("User approved and added to members!");
    setIsInMemberRequests(false); // Update the state to remove the card
  } catch (error) {
    console.error("Error approving user: ", error);
  }
};

const handleRejection = async (user, groupDocRef, setIsInMemberRequests) => {
  try {
    // Update the group document
    await updateDoc(groupDocRef, {
      memberRequests: arrayRemove(user),
    });

    console.log("User was rejected and not added to members!");
    setIsInMemberRequests(false); // Update the state to remove the card
  } catch (error) {
    console.error("Error approving user: ", error);
  }
}

const MemberRequestCard = ({ user, group }) => {
  const [isInMemberRequests, setIsInMemberRequests] = useState(null);

  useEffect(() => {
    const fetchGroupDocument = async () => {
      try {
        // Get the group document from Firestore
        const groupDocRef = doc(db, "groups", group.id);
        const groupDocSnap = await getDoc(groupDocRef);

        if (groupDocSnap.exists()) {
          const groupData = groupDocSnap.data();
          console.log(groupData.memberRequests)
          // Check if the user is still in member requests
          if (!groupData.memberRequests.includes(user)) {
            setIsInMemberRequests(false);
          } else {
            setIsInMemberRequests(true);
          }
        }
      } catch (error) {
        console.error("Error fetching group document: ", error);
      }
    };

    fetchGroupDocument();
  }, [group.id, user]);

  if (!isInMemberRequests) {
    return null; // Return null to hide the component
  }

  return (
    <CardContainer>
      <View style={styles.row}>
        {!user.user ? (
          <UserPhotoName user={user} />
        ) : (
          <UserPhotoName user={user.user} />
        )}
        <View style={styles.options}>
          <Button
            small
            title="Approve"
            onPress={() => {
              const groupDocRef = doc(db, "groups", group.id);
              handleApproval(user, groupDocRef, setIsInMemberRequests);
            }}
          />
        </View>
        <View style={styles.options}>
          <Button
            small
            title="Reject"
            onPress={() => {
              const groupDocRef = doc(db, "groups", group.id);
              handleRejection(user, groupDocRef, setIsInMemberRequests);
            }}
          />
        </View>
      </View>
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  options: {
    flex: 3,
    justifyContent: 'center',
  },
});

export default MemberRequestCard;
