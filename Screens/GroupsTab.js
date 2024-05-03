import * as React from 'react';
import { StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainGroupsScreen from './Groups/MainGroupsScreen';
import GroupScreen from './Groups/GroupScreen';

const Stack = createNativeStackNavigator();

/* This component defines the possible screens that can be accessed from the Groups Tab */
const GroupsTab = () => {
  return (
    <Stack.Navigator initialRouteName="Homepage">
      <Stack.Screen
        name="Groups Page"
        component={MainGroupsScreen}
        options={() => ({
          headerTitle: () => (
            <Text>Groups</Text>
          ),
        })} />
      <Stack.Screen 
        name="Group Page"
        component={GroupScreen}
        options={({ navigation }) => ({
          headerTitle: () => (
            <Text>Groups</Text>
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
});

