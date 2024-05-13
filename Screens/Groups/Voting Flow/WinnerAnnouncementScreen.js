import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Button from '../../../Components/Button';
import PolaroidPhoto from '../../../Components/PolaroidPhoto';
import theme from '../../../theme';

const WinnerAnnouncementScreen = ({ route, navigation }) => {
  const group = route.params.group;

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Stacy Wins!</Text>
      <View style={styles.topSection}>
        <PolaroidPhoto />
      </View>
      <Button
        title="Continue"
        onPress={() => {
          navigation.navigate('Choose Prompt Screen', { group })
        }} />
    </View>
  );
};

export default WinnerAnnouncementScreen;

const styles = StyleSheet.create({
  screen: {
    flexDirection: 'column',
    padding: 20,
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  topSection: {
    flex: 1,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontFamily: 'PatrickHandSC-Regular',
    marginBottom: 20,
    textAlign: 'center',
  },
});