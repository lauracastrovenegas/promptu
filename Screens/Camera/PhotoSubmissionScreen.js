import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, Image, TextInput, Alert } from 'react-native';
import Button from '../../Components/Button';
import theme from '../../theme';
import { useAppContext } from '../../AppContext';

const PhotoSubmissionScreen = ({ route, navigation }) => {
  const { state, dispatch } = useAppContext();

  const [caption, onChangeCaption] = React.useState('');
  const [selectedGroup, setSelectedGroup] = React.useState(state.groupsData[0]);

  function createReplaceSubmissionConfirmationAlert() {
    return new Promise((resolve) => {
      Alert.alert('Confirm Submission', 'You have already submitted a photo for this group. Would you like to replace it?', [
        {
          text: 'Yes, replace it',
          onPress: () => { resolve(true) },
        },
        {
          text: 'Cancel',
          onPress: () => { resolve(false) },
          style: 'cancel',
        },
      ], { cancelable: false });
    });
  };

  async function submitPhoto() {
    const currentGroupData = selectedGroup;

    // check if there is an existing submission for the user
    const memberSubmission = currentGroupData.submissions.find(submission => submission.userId === state.userData.id);

    console.log(currentGroupData.submissions);

    if (memberSubmission) {
      const replaceSubmission = await createReplaceSubmissionConfirmationAlert();

      if (!replaceSubmission) {
        return;
      }

      // remove the existing submission
      currentGroupData.submissions = currentGroupData.submissions.filter(submission => submission.userId !== state.userData.id);
    }

    // Add the photo to the group's submission array
    currentGroupData.submissions.push({
      id: currentGroupData.submissions.length + 1,
      photo: route.params.photo,
      caption: caption,
      userId: state.userData.id,
    });

    dispatch({ type: 'UPDATE_GROUPS_DATA', payload: currentGroupData });
    alert(`Photo submitted to ${selectedGroup.name}!`);

    // go to the camera screen
    navigation.navigate('Main Camera Screen');
  }

  return (
    <ScrollView style={styles.screen} keyboardDismissMode="on-drag">
      {state.groupsData.map((group) => (
        <Text key={group.id}>{group.name}</Text>
      ))}
      <Text>Today's Prompt</Text>
      <Text>{selectedGroup.prompt}</Text>
      <Image source={{ uri: route.params.photo.uri }} style={styles.image} />
      <TextInput
        multiline
        placeholder="Add a caption!"
        style={styles.captionBox}
        maxLength={200}
        onChangeText={onChangeCaption}
        value={caption} />
      <Button title="Submit Photo" onPress={submitPhoto} />
    </ScrollView>
  );
};

export default PhotoSubmissionScreen;

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    backgroundColor: theme.colors.white,
  },
  image: {
    height: 300,
    borderRadius: 30,
  },
  captionBox: {
    backgroundColor: theme.colors.mediumGray,
    borderColor: theme.colors.white,
    borderRadius: 8,
    padding: 20,
    fontSize: 16,
    marginVertical: 20,
    minHeight: 100,
  },
});