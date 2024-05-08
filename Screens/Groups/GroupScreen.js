import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import theme from "../../theme";

/* This component is the Individual Group Screen  */
const GroupScreen = ({ route }) => {
  return (
    <ScrollView style={styles.screen}>
      <Text>Individual Group Screen</Text>
      <Text>{route.params.group.name}</Text>
    </ScrollView>
  )
};

export default GroupScreen;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.white,
  },
});