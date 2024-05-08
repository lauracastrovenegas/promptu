import React from "react";
import { ScrollView, Text, StyleSheet, TouchableOpacity } from "react-native";
import theme from "../../theme";
import CardContainer from "../../Components/CardContainer";
import { groups } from "../../data/fakeData";

/* This component is the Main Groups Screen of the app opened by default */
const MainGroupsScreen = ({ route, navigation }) => {
  return (
    <ScrollView style={styles.screen}>
      {route.params.groupData.map(group => (
        <TouchableOpacity 
          key={group.id}
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

const GroupCard = ({group}) => {
  return (
    <CardContainer>
      <Text>{group.name}</Text>
    </CardContainer>
  )
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.white,
    padding: 20,
  },
});