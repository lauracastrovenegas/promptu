import React, { useEffect } from 'react';
import { Text, StyleSheet, Image, TextInput, Alert, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Button from '../../Components/Button';
import DropdownMenu from '../../Components/DropdownMenu';
import theme from '../../theme';
import { useAppContext } from '../../AppContext';
import { hasUserSubmittedToGroup, getTodaysGroupContest } from '../../Functions/utils';

const PhotoSubmissionScreen = ({ route, navigation }) => {
  const { state, dispatch } = useAppContext();

  const [caption, onChangeCaption] = React.useState('');
  const [selectedGroup, setSelectedGroup] = React.useState(route.params.group ?? null);
  const [contestInfo, setContestInfo] = React.useState(null);

  useEffect(() => {
    if (selectedGroup) {
      setContestInfo(getTodaysGroupContest(selectedGroup, state.groupsContestData));
    }
  }, [selectedGroup]);

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
    const currentContestInfo = contestInfo;

    // check if there is an existing submission for the user
    const userHasSubmittedAlready = hasUserSubmittedToGroup(selectedGroup, state.userData, state.groupsContestData);

    if (userHasSubmittedAlready) {
      const replaceSubmission = await createReplaceSubmissionConfirmationAlert();

      if (!replaceSubmission) {
        return;
      }

      // remove the existing submission
      currentContestInfo.submissions = currentContestInfo.submissions.filter(submission => submission.userId !== state.userData.id);
    }

    // Add the photo to the group's submission array
    currentContestInfo.submissions.push({
      id: currentContestInfo.submissions.length + 1,
      photo: route.params.photo,
      caption: caption,
      userId: state.userData.id,
    });

    dispatch({ type: 'UPDATE_GROUPS_DATA', payload: currentContestInfo });
    alert(`Photo submitted to ${selectedGroup.name}!`);

    // go to the camera screen
    navigation.navigate('Main Camera Screen');
  }

  return (
    <KeyboardAwareScrollView style={{ backgroundColor: theme.colors.white }} keyboardDismissMode="on-drag">
      <View style={styles.screen}>
        <DropdownMenu items={state.groupsData} selectedItem={selectedGroup} setSelectedItem={setSelectedGroup} />
        {selectedGroup && contestInfo && <Text style={styles.promptTitle}>Today's Prompt</Text>}
        {selectedGroup && contestInfo && <Text style={styles.prompt}>{contestInfo.prompt}</Text>}
        <Image source={{ uri: route.params.photo.uri }} style={styles.image} />
        <TextInput
          multiline
          placeholder="Add a caption!"
          style={styles.captionBox}
          maxLength={200}
          onChangeText={onChangeCaption}
          value={caption} />
        <Button title="Submit Photo" onPress={submitPhoto} disabled={selectedGroup === null}/>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default PhotoSubmissionScreen;

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  promptTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: -10,
    fontSize: 16,
  },
  prompt: {
    fontSize: 20,
    textAlign: 'center',
  },
  image: {
    height: 500,
    borderRadius: 8,
  },
  captionBox: {
    backgroundColor: theme.colors.mediumGray,
    borderColor: theme.colors.white,
    borderRadius: 8,
    padding: 20,
    fontSize: 16,
    minHeight: 100,
  },
});