import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Button from '../../../Components/Button';
import PolaroidPhoto from '../../../Components/PolaroidPhoto';
import theme from '../../../theme';
import { useAppContext } from "../../../AppContext";

const WaitingScreen = ({ route, navigation }) => {
  const { fetchGroupContestData, dispatch } = useAppContext();
  const group = route.params.group;

  function reloadData() {
    const fetchData = async () => {
      const groupContestData = await fetchGroupContestData([group.id]);
      dispatch({ type: 'UPDATE_GROUP_CONTEST_DATA', payload: {id: group.id, data: groupContestData[0] }});

      if (groupContestData[0].votes.length === groupContestData[0].submissions.length * 3) {
        navigation.navigate('Winner Announcement Screen', { group });
      }
    };

    fetchData();
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topSection}>
        <Text style={styles.title}>Waiting for others to vote...</Text>
      </View>
      <Button
        title="Reload"
        onPress={reloadData} />
    </View>
  );
};

export default WaitingScreen;

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