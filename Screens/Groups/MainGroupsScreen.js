import React from "react";
import { ScrollView, Text, StyleSheet, TouchableOpacity, View } from "react-native";
import theme from "../../theme";
import GroupCard from "../../Components/GroupCard";
import { useAppContext } from "../../AppContext";

/* This component is the Main Groups Screen of the app opened by default */
const MainGroupsScreen = ({ navigation }) => {
  const { state, isLoading } = useAppContext();
  return (
    <ScrollView style={{ backgroundColor: theme.colors.white }}>
      <View style={styles.screen}>
        {isLoading && <Text>Loading...</Text>}
        {state.groupsData.map(group => (
          <TouchableOpacity
            key={group.id}
            onPress={() => {
              navigation.navigate('Group Page', {
                group,
              });
            }}>
            <GroupCard group={group} />
          </TouchableOpacity>
        ))}
      </View>
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
});