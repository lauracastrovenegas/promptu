import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainProfileScreen from './Profile/MainProfileScreen';

const Stack = createNativeStackNavigator();

/* This component defines the possible screens that can be accessed from the Profile Tab */
const ProfileTab = () => {
    return (
      <Stack.Navigator initialRouteName="Main Profile Screen">
        <Stack.Screen 
          name="Main Profile Screen" 
          component={MainProfileScreen} 
          options={() => ({
          headerTitle: () => (
            <Text style={styles.title}>Profile</Text>
          )
        })} />
      </Stack.Navigator>
    )
}


// example of styling
const styles = StyleSheet.create({
  title: {
    textTransform: 'capitalize',
    fontFamily: "Inter_900Black",
    fontSize: 24,
  },
});

export default ProfileTab;