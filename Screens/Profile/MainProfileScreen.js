import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import theme from "../../theme";
import { useAppContext } from "../../AppContext";

/* This component is the Profile Screen */
const MainProfileScreen = () => {
  const { state, isLoading } = useAppContext();
  console.log(state.userData);

  return (
    <ScrollView style={styles.screen}>
      {isLoading && <Text>Loading...</Text>}
      <Text>Profile Screen</Text>
    </ScrollView>
  )
};

export default MainProfileScreen;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.white,
  },
});