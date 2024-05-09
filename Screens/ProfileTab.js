import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainProfileScreen from './Profile/MainProfileScreen';
import { FontAwesome6 } from "@expo/vector-icons";
import theme from '../theme';

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
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => alert('This is a button!')}
            >
              <FontAwesome6
                name="gear"
                size={20}
                color={theme.colors.black}
              />
            </TouchableOpacity>
          )
        })} />
      </Stack.Navigator>
    )
}


// example of styling
const styles = StyleSheet.create({
  title: {
    textTransform: 'uppercase',
    fontFamily: "PatrickHand_400Regular",
    fontSize: 24,
  },
});

export default ProfileTab;