import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, Image, TextInput, Alert, View, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Button from '../../Components/Button';
import DropdownMenu from '../../Components/DropdownMenu';
import theme from '../../theme';
import { useAppContext } from '../../AppContext';
import { getTodaysGroupContest, hasUserSubmittedToGroup, createConfirmationAlert } from '../../Functions/utils';

const PhotoSubmissionScreen = ({ route, navigation }) => {
  const { state, isLoading, dispatch, addSubmissionToGroup } = useAppContext();

  const [caption, onChangeCaption] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(route.params.group ?? (state.groupsData[0] ?? null));
  const [contestInfo, setContestInfo] = useState(null);
  const [submissionLoading, setSubmissionLoading] = useState(false);

  useEffect(() => {
    if (selectedGroup) {
      setContestInfo(getTodaysGroupContest(selectedGroup, state.groupsContestData));
    }
  }, [selectedGroup]);

  async function submitPhoto() {
    try {
      const currentContestInfo = contestInfo;

      // check if there is an existing submission for the user
      const userHasSubmittedAlready = hasUserSubmittedToGroup(selectedGroup, state.userData, state.groupsContestData);

      if (userHasSubmittedAlready) {
        const replaceSubmission = await createConfirmationAlert('Confirm Submission', 'You have already submitted a photo for this group. Would you like to replace it?', 'Yes, replace it');

        if (!replaceSubmission) {
          return;
        }

        // remove the existing submission
        currentContestInfo.submissions = currentContestInfo.submissions.filter(submission => submission.userId !== state.userData.uid);
      }
      setSubmissionLoading(true);
      const success = await addSubmissionToGroup(currentContestInfo.id, route.params.photo.uri, caption, state.userData.uid, userHasSubmittedAlready);
      setSubmissionLoading(false);

      if (success) {
        alert(`Photo submitted to ${selectedGroup.groupName}!`);
      } else {
        Alert.alert("Error Submitting Photo", "An error occurred while submitting your photo. Please try again later.");
      }
      
    } catch (error) {
      console.error("Error submitting photo: ", error);
      setSubmissionLoading(false);
      Alert.alert("Error Submitting Photo", "An error occurred while submitting your photo. Please try again later.");
    }

    // go to the camera screen
    navigation.navigate('Main Camera Screen');
  }

  if (isLoading) {
    return <View style={styles.screen}><ActivityIndicator size="large"/></View>;
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
        <Button title="Submit Photo" onPress={submitPhoto} disabled={selectedGroup === null} isLoading={submissionLoading}/>
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