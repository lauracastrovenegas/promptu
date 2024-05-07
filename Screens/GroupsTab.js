import * as React from 'react';
import { StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainGroupsScreen from './Groups/MainGroupsScreen';
import GroupScreen from './Groups/GroupScreen';
import { FontAwesome } from "@expo/vector-icons";
import theme from "../theme";

const Stack = createNativeStackNavigator();

/* This component defines the possible screens that can be accessed from the Groups Tab */
const GroupsTab = () => {
  return (
    <Stack.Navigator initialRouteName="Homepage">
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
              <FontAwesome
                name="plus"
                size={20}
                color={theme.colors.black}
              />
            </TouchableOpacity>
          )

        })} />
      <Stack.Screen
        name="Group Page"
        component={GroupScreen}
        options={({ route, navigation }) => ({
          headerTitle: () => (
            // set header title to the group name passed through route params
            <Text>{route.params.group.name}</Text>
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <Image style={styles.icon}
                source={require('../assets/back.png')}
              />
            </TouchableOpacity>
          )
        })}
      />
    </Stack.Navigator>
  )
}

export default GroupsTab;

// example of styling
const styles = StyleSheet.create({
  icon: {
    width: 27,
    height: 25,
    objectFit: 'fill',
    marginRight: 10,
  },
  title: {
    fontFamily: "PatrickHand_400Regular",
    textTransform: 'uppercase',
    fontSize: 24,
  }
});

