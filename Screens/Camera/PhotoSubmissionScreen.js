import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, Image, TextInput } from 'react-native';
import Button from '../../Components/Button';
import theme from '../../theme';
import { useAppContext } from '../../AppContext';

const PhotoSubmissionScreen = ({ route }) => {
  const { state } = useAppContext();

  const [caption, onChangeCaption] = React.useState('');
  const [selectedGroup, setSelectedGroup] = React.useState(null);
  console.log(state);

  function submitPhoto() {
    const currentGroupData = state.groupsData;
    const currentPhoto = route.params.photo;

    // Add the photo to the group's submission array
    currentGroupData.forEach((group) => {
      if (group.id === selectedGroup.groupId) {
        group.submissions.push({
          photo: currentPhoto,
          caption: caption,
        });
      }
    });
  }

  return (
    <ScrollView style={styles.screen} keyboardDismissMode="on-drag">
      {state.groupsData.map((group) => (
        <Text key={group.id}>{group.name}</Text>
      ))}
      <Text>Today's Prompt</Text>
      <Text>This is the prompt for the selected group</Text>
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