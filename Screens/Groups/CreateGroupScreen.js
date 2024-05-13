import React from "react";
import { View, StyleSheet } from "react-native";
import InputImage from "../../Components/InputImage";
import SingleInput from "../../Components/SingleInput";
import { useAppContext } from "../../AppContext";
import Button from "../../Components/Button";

/* This component is the Individual Group Screen  */
const CreateGroupScreen = ({ navigation }) => {
  const [group, onChangeGroup] = React.useState('');
  const { state, dispatch } = useAppContext();
  const [image, setImage] = React.useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);

  async function handleCreateGroup() {
    const groupData = {
      id: state.groupsData[state.groupsData.length - 1] + 1,
      name: group,
      groupPhoto: image,
      ownerId: state.userData.id,
      votingTime: 18, // 6 PM
      members: [
        state.userData,
      ]
    };

    const groupContestData = {
      groupId: groupData.id,
      date: "2024-06-01",
      winner: null,
      hasVotingOccurred: false,
      prompt: "This is the prompt of the day",
      submissions: [],
      votes: []
    };

    dispatch({ type: 'ADD_GROUPS_DATA', payload: groupData });
    dispatch({ type: 'ADD_GROUPS_CONTEST_DATA', payload: groupContestData });

    // go to the group screen
    navigation.navigate('Share Group Page', { group });
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
                  <InputImage image={image} setImage={setImage} />
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