import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, Image, TextInput, Alert, View } from 'react-native';
import Button from '../../Components/Button';
import DropdownMenu from '../../Components/DropdownMenu';
import theme from '../../theme';
import { useAppContext } from '../../AppContext';
import { hasUserSubmittedToGroup } from '../../Functions/utils';

const PhotoSubmissionScreen = ({ route, navigation }) => {
  const { state, dispatch } = useAppContext();

  const [caption, onChangeCaption] = React.useState('');
  const [selectedGroup, setSelectedGroup] = React.useState(route.params.group ?? state.groupsData[0]);

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
    const userHasSubmittedAlready = hasUserSubmittedToGroup(currentGroupData, state.userData);

    if (userHasSubmittedAlready) {
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
    <ScrollView style={{ backgroundColor: theme.colors.white }} keyboardDismissMode="on-drag">
      <View style={styles.screen}>
        <DropdownMenu items={state.groupsData} selectedItem={selectedGroup} setSelectedItem={setSelectedGroup} />
        <Text style={styles.promptTitle}>Today's Prompt</Text>
        <Text style={styles.prompt}>{selectedGroup.prompt}</Text>
        <Image source={{ uri: route.params.photo.uri }} style={styles.image} />
        <TextInput
          multiline
          placeholder="Add a caption!"
          style={styles.captionBox}
          maxLength={200}
          onChangeText={onChangeCaption}
          value={caption} />
        <Button title="Submit Photo" onPress={submitPhoto} />
      </View>
    </ScrollView>
  );
};

export default PhotoSubmissionScreen;

const styles = StyleSheet.create({
  screen: {
    padding: 20,
  },
  promptTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.patrickHand,
    textAlign: 'center',
    marginTop: 20,
  },
  prompt: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    height: 500,
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