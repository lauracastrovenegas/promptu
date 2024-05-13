import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Button from '../../../Components/Button';

const VotingScreen = ({ navigation }) => {

  return (
    <View style={styles.screen}>
      <View style={styles.topSection}>
        <ScrollView>
          <Text>This is the VotingScreen component.</Text>
        </ScrollView>
      </View>
      <Button 
        title="Submit Vote" 
        onPress={() => navigation.navigate('Winner Announcement Screen')} />
    </View>
  );
};

export default VotingScreen;

const styles = StyleSheet.create({
  screen: {
    flexDirection: 'column',
    padding: 20,
    flex: 1,
  },
  topSection: {
    flex: 1,
  }
});