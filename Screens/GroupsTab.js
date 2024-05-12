import * as React from 'react';
import { StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainGroupsScreen from './Groups/MainGroupsScreen';
import GroupScreen from './Groups/GroupScreen';
import { FontAwesome6 } from "@expo/vector-icons";
import theme from "../theme";
import { useAppContext } from '../AppContext';
import GroupHeaderButton from '../Components/GroupHeaderButton';

const Stack = createNativeStackNavigator();

/* This component defines the possible screens that can be accessed from the Groups Tab */
const GroupsTab = ({ route }) => {
  return (
    <Stack.Navigator initialRouteName="Groups Page">
      {/* Groups Page is the default screen that will be shown when the user clicks on the Groups Tab. It displays a list of all groups the user is a part of. */}
      <Stack.Screen
        name="Groups Page"
        component={MainGroupsScreen}
        options={() => ({
          // hide center header text but keep the header itself
          headerTitle: () => (
            <Text></Text>
          ),
          headerLeft: () => (
            <Text style={styles.title}>Promptu</Text>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => alert('This is a button!')}
            >
              <FontAwesome6
                name="plus"
                size={20}
                color={theme.colors.black}
              />
            </TouchableOpacity>
          )
        })} />
      {/* Group Page is the screen that will be shown when the user clicks on a specific group in the Groups screen. */}
      <Stack.Screen
        name="Group Page"
        component={GroupScreen}
        options={({ route, navigation }) => ({
          headerTitle: () => (
            // set header title to the group name passed through route params
            <GroupHeaderButton group={route.params.group} onPress={() => alert('This opens the group settings button!')} />
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <FontAwesome6
                name="chevron-left"
                size={20}
                color={theme.colors.black}
                style={styles.icon}/>
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  )
}

export default GroupsTab;

// example of styling
const styles = StyleSheet.create({
  icon: {
    marginRight: 10,
  },
  title: {
    fontFamily: "PatrickHandSC_400Regular",
    textTransform: 'uppercase',
    fontSize: 24,
  },
});

