import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, Image, TextInput } from 'react-native';
import Button from '../../Components/Button';
import theme from '../../theme';

const PhotoSubmissionScreen = ({ route }) => {
  const [caption, onChangeCaption] = React.useState('');

  return (
    <ScrollView style={styles.screen} keyboardDismissMode="on-drag">
      <Text>Put the drop down here using the group data (import it for now)</Text>
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
      <Button title="Submit Photo" onPress={() => alert('This button submits the image!')} />
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