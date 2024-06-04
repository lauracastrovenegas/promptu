import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import InputImage from "../../Components/InputImage";
import SingleInput from "../../Components/SingleInput";
import { useAppContext } from "../../AppContext";
import Button from "../../Components/Button";
import theme from '../../theme';
import { storage, db, getGroupData, getGroupContestData } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc, addDoc, updateDoc, collection } from "firebase/firestore";
import * as Linking from 'expo-linking';
import { getTodaysDateStamp } from "../../Functions/utils";


/* This component is the Create Group Screen  */
const CreateGroupScreen = ({ navigation }) => {
 const [group, onChangeGroup] = useState('');
 const { state, dispatch } = useAppContext();
 const [image, setImage] = useState(null);
 const [isButtonDisabled, setIsButtonDisabled] = useState(true);

 async function handleJoinGroup(joinCode) {

 }

 async function handleCreateGroup() {
   if (group) {
     let groupId = null;
     let groupDocRef = null;
     let contestDocRef = null;
     try {
       // create group
       groupDocRef = await addDoc(collection(db, "groups"), {  // generates ID for you
         groupName: group,
         ownderId: state.userData.uid,
         votingTime: 18,  // default to 6 PM
         members: [state.userData.uid],
         memberRequests: [],
         photoURL: null,
         inviteCode: null
       });

       groupId = groupDocRef.id;
       console.log("Group ID: ", groupId);

        // update group with invite code
        await updateDoc(groupDocRef, {
          inviteCode: `${groupId}`
        });

       // upload group image was not working properly
       try {
         if (image) {
           const storageRef = ref(storage, `group_pictures`);
           const imageRef = ref(storageRef, `${groupId}`);
           const response = await fetch(image);
           const blob = await response.blob();
           await uploadBytes(imageRef, blob);
           let photoURL = await getDownloadURL(imageRef);
           await updateDoc(groupDocRef, {
             photoURL: photoURL
           });
         }
       } catch (error) {
         Alert.alert("Error setting group image", error.message);
       }

     } catch (error) {
       Alert.alert("Error Creating Group", error.message);
     }

     const dateStamp = getTodaysDateStamp();

     try {
       // create group contest for the first day
       contestDocRef = await addDoc(collection(db, "group_contests"), {   // ID for group contest is the same as for the group
         groupId: groupId,
         date: dateStamp,  // current date
         winner: null,
         hasVotingOccurred: false,
         prompt: "This is the prompt of the day",  // TODO fetch from prompt bank
         submissions: [],
         votes: [],
         hasVoted: [],
       });
     } catch (error) {
       Alert.alert("Error Creating Group Contest", error.message);
     }

     const groupDataDoc = await getDoc(groupDocRef);
     const contestDataDoc = await getDoc(contestDocRef);

     if (groupDataDoc.exists() && contestDataDoc.exists()) {
       const groupData = groupDataDoc.data();
       groupData.id = groupDataDoc.id;
       groupData.inviteCode = `${groupId}`;
       const allGroupData = await getGroupData(state.userData.uid);
       const groupIds = allGroupData.map((groupDoc) => { return groupDoc.id; });
       const groupContestData = await getGroupContestData(groupIds);
       dispatch({ type: 'SET_GROUPS_CONTEST_DATA', payload: groupContestData });
       dispatch({ type: 'SET_GROUPS_DATA', payload: allGroupData });

       // go to the group screen
       navigation.navigate('Share Group Page', { group: groupData, inviteCode: `${groupId}`, backTo: 'Groups Screen'});
     } else {
       console.log("No group document exists.");
     }
   }
 }

 // Function to check if group and image fields are filled
 useEffect(() => {
   if (group !== '' && image != null) {
     setIsButtonDisabled(false);
   } else {
     setIsButtonDisabled(true);
   }
 }, [group, image]);

 return (
   <View style={styles.screen}>
     <View style={styles.topSection}>
       <InputImage image={image} setImage={setImage} profile={false} />
       <View style={styles.form}>
         <SingleInput
           placeholder="Group Name"
           onChangeText={onChangeGroup}
           text={group}
           passwordBool={false}
         />
       </View>
       <Text>Have an invite code? <Text style={{ color: theme.colors.purple }} onPress={() => navigation.navigate('Join Group Page')}>Join a group</Text></Text>
     </View>
     <View>
       <Button
         title={`Create Group`}
         disabled={isButtonDisabled}
         onPress={() => {
           handleCreateGroup()
         }
         } />
     </View>
   </View>
 )
};




export default CreateGroupScreen;




const styles = StyleSheet.create({
 screen: {
   backgroundColor: theme.colors.white,
   display: 'flex',
   flexDirection: 'column',
   padding: 20,
   flex: 1,
 },
 topSection: {
   alignItems: 'center',
   marginTop: 100,
   flex: 1,
 },
 form: {
   display: 'flex',
   flexDirection: 'column',
   alignItems: 'center',
   justifyContent: 'center',
 },
});