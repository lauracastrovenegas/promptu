import React from "react";
import { ScrollView, Text, StyleSheet, TouchableOpacity } from "react-native";
import theme from "../../theme";
import GroupCard from "../../Components/GroupCard";
import { useAppContext } from "../../AppContext";

/* This component is the Main Groups Screen of the app opened by default */
const MainGroupsScreen = ({ navigation }) => {
  const { state, isLoading } = useAppContext();
  return (
    <ScrollView style={styles.screen}>
      {isLoading && <Text>Loading...</Text>}
      {state.groupsData.map(group => (
        <TouchableOpacity 
          key={group.id}
          style={{ marginBottom: 20 }}
          onPress={() => {
            navigation.navigate('Group Page', {
              group,
            });
          }}>
          <GroupCard group={group}/>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
};

export default MainGroupsScreen;

const styles = StyleSheet.create({
  screen: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.colors.white,
    padding: 20,
    gap: 20,
  },
});