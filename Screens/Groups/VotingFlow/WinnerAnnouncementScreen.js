import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Button from '../../../Components/Button';
import PolaroidPhoto from '../../../Components/PolaroidPhoto';
import theme from '../../../theme';
import { useAppContext } from "../../../AppContext";
import { getTodaysGroupContest } from '../../../Functions/utils';

const WinnerAnnouncementScreen = ({ route, navigation }) => {
  const group = route.params.group;
  const { state, fetchGroupContestData } = useAppContext();
  const [groupContest, setGroupContest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupContestData = await fetchGroupContestData([group.id]);
        const todaysContest = getTodaysGroupContest(group, groupContestData);
        setGroupContest(todaysContest);
      } catch (error) {
        console.error("Error fetching group contest data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [group.id, fetchGroupContestData]);

  if (loading) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  if (!groupContest) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>No contest data available.</Text>
      </View>
    );
  }

  const winners = groupContest.winner;

  function choosePromptOrWait() {
    if (winners.some(winner => winner.uid === state.userData.uid)) {
      navigation.navigate('Choose Prompt Screen', { group });
    } else {
      navigation.navigate('Group Screen', { group, contestInfo: groupContest });
    }
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>
        {winners.length > 1 ? 'Winners!' : 'Winner!'}
      </Text>
      {winners.length > 1 ? (
        <ScrollView contentContainerStyle={styles.topSection}>
          {winners.map(winner => {
            const submission = groupContest.submissions.find(s => s.userId === winner.uid);
            if (!submission) {
              console.error(`No submission found for userId: ${winner.uid}`);
              return null;
            }
            return (
              <View key={winner.uid} style={styles.winnerContainer}>
                <Text style={styles.winnerName}>{winner.displayName}</Text>
                <PolaroidPhoto
                  image={submission.photo}
                  caption={submission.caption}
                  multiple={true}
                />
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.topSection}>
          <Text style={styles.winnerTitle}>{winners[0].displayName}</Text>
          <PolaroidPhoto
            image={groupContest.submissions.find(s => s.userId === winners[0].uid).photo}
            caption={groupContest.submissions.find(s => s.userId === winners[0].uid).caption}
          />
        </View>
      )}

      <Button
        title="Continue"
        onPress={choosePromptOrWait}
      />
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
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  winnerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  winnerName: {
    fontSize: 24,
    fontFamily: 'PatrickHandSC-Regular',
    marginBottom: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 40,
    fontFamily: 'PatrickHandSC-Regular',
    marginBottom: 20,
    textAlign: 'center',
  },
  winnerTitle: {
    fontSize: 40,
    fontFamily: 'PatrickHandSC-Regular',
    marginBottom: 20,
    textAlign: 'center',
  },
});
