import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import theme from "../../theme";

/* This component is the Profile Screen */
const MainProfileScreen = ({ route }) => {
  console.log(route.params.userData);
  return (
    <ScrollView style={styles.screen}>
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