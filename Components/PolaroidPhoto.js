import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import theme from '../theme';

const PolaroidPhoto = ({ image, caption, small, selectedValue }) => {
  return (
    <View style={[styles.container, small && styles.containerSmall, (selectedValue === 1 || selectedValue === 2) && styles.selected]}>
      <Image 
        source={image ? {uri: image} : require("../assets/fakeSubmissionPhotos/submission1.jpeg")} 
        style={[styles.image, small && styles.imageSmall]} />
      <Text style={[styles.caption, small && styles.captionSmall]}>{caption ?? "This is a caption for this submission"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
    width: '100%', // Ensuring full width
  },
  containerSmall: {
    padding: 10,
    marginBottom: 0,
  },
  image: {
    width: '80%', 
    aspectRatio: 1, // Maintain aspect ratio
    marginBottom: 20,
  },
  imageSmall: {
    aspectRatio: 1, // Maintain aspect ratio
    marginBottom: 10,
  },
  caption: {
    fontSize: 16,
  },
  captionSmall: {
    fontSize: 12,
  },
  selected: {
    borderColor: theme.colors.purple,
    borderWidth: 2,
  },
});

export default PolaroidPhoto;
