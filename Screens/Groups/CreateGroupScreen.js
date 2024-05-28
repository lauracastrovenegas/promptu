import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import InputImage from "../../Components/InputImage";
import SingleInput from "../../Components/SingleInput";
import { useAppContext } from "../../AppContext";
import Button from "../../Components/Button";
import theme from '../../theme';
import { storage, db } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc, addDoc, updateDoc, collection } from "firebase/firestore";

/* This component is the Create Group Screen  */
const CreateGroupScreen = ({ navigation }) => {
  const [group, onChangeGroup] = React.useState('');
  const { state, dispatch, fetchGroupData, fetchGroupContestData } = useAppContext();
  const [image, setImage] = React.useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);

  async function handleCreateGroup() {
    if (group) {
      try {
        // create group
        const docRef = await addDoc(collection(db, "groups"), {  // generates ID for you
          groupId: null,
          groupName: group,
          ownderId: state.userData.uid,
          votingTime: 18,  // default to 6 PM
          members: [ state.userData.uid ],
          memberRequests: [],
          photoURL: null,
        });

        let groupId = docRef.id;

        await updateDoc(docRef, {
          groupId: groupId
        });

        if (image) {
          const response = await fetch(image);
          const blob = await response.blob();
          const storageRef = ref(storage, `group_pictures/${groupId}`);
          await uploadBytes(storageRef, blob);
          let photoURL = await getDownloadURL(storageRef);
          await updateDoc(docRef, {
            photoURL: photoURL
          });
        }

        const today = new Date();

        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        // To do: use this when we have real data
        const dateStamp = year + "-" + month + "-" + day;

        // create group contest
        await setDoc(doc(db, "group_contests", groupId), {  // ID for group contest is the same as for the group
          groupId: groupId,
          date: dateStamp,  // current date
          winner: null,
          hasVotingOccurred: false,
          prompt: "This is the prompt of the day",  // TODO fetch from prompt bank
          submissions: [],
          votes: []
        });

        const groupDataDoc = await getDoc(docRef);

        if (groupDataDoc.exists()) {
          const groupData = groupDataDoc.data();
          const allGroupData = await fetchGroupData(state.userData.uid);
          const groupIds = allGroupData.map((groupDoc) => { return groupDoc.groupId; });
          const groupContestData = await fetchGroupContestData(groupIds);
          dispatch({ type: 'SET_GROUPS_CONTEST_DATA', payload: groupContestData });
          dispatch({ type: 'SET_GROUPS_DATA', payload: allGroupData });

          // go to the group screen
          navigation.navigate('Share Group Page', { groupData });
        } else {
          console.log("No group document exists.");
        }
      } catch (error) {
        Alert.alert("Error Creating Group", error.message);
      }
    }

  }

  // Function to check if group and image fields are filled
  React.useEffect(() => {
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