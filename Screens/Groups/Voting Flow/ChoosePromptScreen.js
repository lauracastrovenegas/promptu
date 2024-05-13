import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Button from '../../../Components/Button';

const ChoosePromptScreen = ({ navigation }) => {

  return (
    <View style={styles.screen}>
      <View style={styles.topSection}>
        <ScrollView>
          <Text>This is the ChoosePromptScreen component.</Text>
        </ScrollView>
      </View>
      <Button 
        title="Continue" 
        onPress={() => {
          navigation.pop(3);
        }} />
    </View>
  );
};

export default ChoosePromptScreen;

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