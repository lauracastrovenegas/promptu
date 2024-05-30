import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import theme from '../theme';
import submission1 from "../assets/fakeSubmissionPhotos/submission1.jpeg";

const PolaroidPhoto = ({ image, caption, small, selectedValue }) => {

  return (
    <View style={[styles.container].concat(small ? styles.containerSmall : {}).concat(selectedValue === 1 || selectedValue === 2 ? styles.selected : {})}>
      <Image 
        source={image ? image : submission1} 
        style={[styles.image].concat(small ? styles.imageSmall : {})} />
      <Text style={[styles.caption].concat(small ? styles.captionSmall : {})}>{caption ?? "This is a caption for this submission"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
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
    width: '100%',
  },
  containerSmall: {
    padding: 10,
    marginBottom: 0,
  },
  image: {
    width: '100%',
    height: 350,
    marginBottom: 20,
  },
  imageSmall: {
    height: 150,
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