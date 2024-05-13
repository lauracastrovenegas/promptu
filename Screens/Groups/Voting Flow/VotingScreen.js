import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Button from '../../../Components/Button';
import PolaroidPhoto from '../../../Components/PolaroidPhoto';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { getTodaysGroupContest } from '../../../Functions/utils';
import theme from '../../../theme';

const VotingScreen = ({ route, navigation }) => {
  const group = route.params.group;

  const contest = getTodaysGroupContest(group);

  return (
    <View style={styles.screen}>
      <View style={styles.topSection}>
        <Text style={styles.promptTitle}>Today's Prompt</Text>
        <Text style={styles.prompt}>{contest.prompt}</Text>
        <ScrollView>
          <View style={{paddingHorizontal: 10, paddingTop: 5}}>
            <PolaroidPhoto />
            <PolaroidPhoto />
            <PolaroidPhoto />
            <PolaroidPhoto />
          </View>
        </ScrollView>
      </View>
      <Button
        title="Submit Vote"
        onPress={() => navigation.navigate('Winner Announcement Screen', { group })} />
    </View>
  );
};

export default VotingScreen;

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
  },
  promptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  prompt: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
});