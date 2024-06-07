import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import theme from '../theme';

const PolaroidPhoto = ({ image, caption, small, selectedValue, multiple }) => {
  return (
    <View  style={[
      styles.container, 
      small && styles.containerSmall, 
      (selectedValue === 1 || selectedValue === 2) && styles.selected,
      multiple && styles.containerMultiple
    ]}>
      <Image
        source={image ? { uri: image } : require("../assets/fakeSubmissionPhotos/submission1.jpeg")}
        style={[styles.photo, small && styles.imageSmall]} />
      <Text style={[styles.caption, small && styles.captionSmall]}>{caption ?? ""}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingVertical: 20,
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingRight: 20,
    marginBottom: 20,
    width: '100%', // Ensuring full width
  },
  containerSmall: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingVertical: 10,
    marginBottom: 0,
  },
  containerMultiple: {
    paddingLeft: 30,
    paddingVertical: 20,
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingRight: 10,
    marginBottom: 20,
    width: '100%', // Ensuring full width
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
  photo: {
    aspectRatio: 1, // Maintain aspect ratio
    width: '100%',
    marginBottom: 20,
    marginRight: 20
  },
  caption: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PolaroidPhoto;
