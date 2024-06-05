import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, StyleSheet, TouchableOpacity, View, ActivityIndicator, RefreshControl } from "react-native";
import theme from "../../theme";
import GroupCard from "../../Components/GroupCard";
import { useAppContext } from "../../AppContext";
import { getTodaysGroupContest } from "../../Functions/utils";
import { getGroupContestData, getGroupData } from "../../config/firebase";

/* This component is the Main Groups Screen of the app opened by default */
const MainGroupsScreen = ({ navigation }) => {
  const { state, isLoading, dispatch } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      console.log("Refreshing group screen...");
      const groupData = await getGroupData(state.userData.uid);
      const groupIds = groupData.map((group) => { return group.id; });
      const groupContestData = await getGroupContestData(groupIds);
      dispatch({ type: 'SET_GROUPS_DATA', payload: groupData });
      dispatch({ type: 'SET_GROUPS_CONTEST_DATA', payload: groupContestData });

      setRefreshing(false);
    } catch (error) {
      console.error("Error refreshing group screen: ", error);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // this forces a rerender of the screen when there is an update to the groups data
  }, [state.groupsData]);

  if (isLoading) {
    return <View style={styles.screen}><ActivityIndicator size="large" /></View>;
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.white }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {!isLoading && <View style={styles.screen}>
        {state.groupsData.length === 0 && <Text style={styles.noGroups}>Create or join a group to get started!</Text>}
        {state.groupsData.map(group => (
          <TouchableOpacity
            key={group.id}
            onPress={() => {
              const contestInfo = getTodaysGroupContest(group, state.groupsContestData);
              if (!contestInfo.hasVotingOccurred && contestInfo.hasVoted.includes(state.userData.uid)) {
                navigation.navigate('Waiting Screen', { group });
              } else {
                navigation.navigate('Group Screen', {
                  group,
                  contestInfo
                });
              }
            }}>
            <GroupCard groupContests={state.groupsContestData} group={group} />
          </TouchableOpacity>
        ))}
      </View>}
    </ScrollView>
  )
};

export default MainGroupsScreen;

const styles = StyleSheet.create({
  screen: {
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
    gap: 20,
  },
  noGroups: {
    fontSize: 20,
    color: theme.colors.gray,
    textAlign: 'center',
    marginTop: 20,
  },
});