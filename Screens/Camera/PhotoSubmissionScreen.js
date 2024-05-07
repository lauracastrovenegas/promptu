import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Button from '../../Components/Button';
import theme from '../../theme';

const PhotoSubmissionScreen = ({ route }) => {
  return (
    <View style={styles.screen}>
      <Image source={{ uri: route.params.photo.uri }} style={styles.image}/>
      <Button title="Submit Photo"/>
    </View>
  );
};

export default PhotoSubmissionScreen;

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    backgroundColor: theme.colors.white,
    height: '100%',
    flexDirection: 'column',
    gap: 20,
  },
  image: {
    height: '80%',
    width: '100%',
    borderRadius: 30,
  }
});