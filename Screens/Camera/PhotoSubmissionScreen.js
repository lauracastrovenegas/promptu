import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const PhotoSubmissionScreen = ({ route }) => {
  return (
    <View>
      <Text>This is the photo I took!</Text>
      <Image source={{ uri: route.params.photo.uri }} style={styles.image}/>
    </View>
  );
};

export default PhotoSubmissionScreen;

const styles = StyleSheet.create({
  image: {
    height: 200,
    width: 200,
  }
});