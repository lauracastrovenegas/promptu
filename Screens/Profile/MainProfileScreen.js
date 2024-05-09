import React from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import theme from "../../theme";
import { useAppContext } from "../../AppContext";

/* This component is the Profile Screen */
const MainProfileScreen = () => {
  const { state, isLoading } = useAppContext();

  return (
    <ScrollView style={{ backgroundColor: theme.colors.white }}>
      <View style={styles.screen}>
        {isLoading && <Text>Loading...</Text>}
        <Text>Profile Screen</Text>
      </View>
    </ScrollView>
  )
};

export default MainProfileScreen;

const styles = StyleSheet.create({
  screen: {
    padding: 20,
  },
});