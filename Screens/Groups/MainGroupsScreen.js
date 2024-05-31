import React from "react";
import { ScrollView, Text, StyleSheet, TouchableOpacity, View, ActivityIndicator } from "react-native";
import theme from "../../theme";
import GroupCard from "../../Components/GroupCard";
import { useAppContext } from "../../AppContext";
import { getTodaysGroupContest } from "../../Functions/utils";

/* This component is the Main Groups Screen of the app opened by default */
const MainGroupsScreen = ({ navigation }) => {
  const { state, isLoading } = useAppContext();
  if (isLoading) {
    return <View style={styles.screen}><ActivityIndicator size="large"/></View>;
  }

  return (
    <ScrollView style={{ backgroundColor: theme.colors.white }}>
      {!isLoading && <View style={styles.screen}>
          {state.groupsData.length === 0 && <Text style={styles.noGroups}>Create or join a group to get started!</Text>}
          {state.groupsData.map(group => (
            <TouchableOpacity
              key={group.id}
              onPress={() => {
                const contestInfo = getTodaysGroupContest(group, state.groupsContestData);
                navigation.navigate('Group Screen', {
                  group,
                  contestInfo
                });
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