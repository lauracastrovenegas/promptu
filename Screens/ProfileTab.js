import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainProfileScreen from './Profile/MainProfileScreen';
import { FontAwesome6 } from "@expo/vector-icons";
import theme from '../theme';
import ProfileSettings from './ProfileSettings';
import useAuth from "../hooks/useAuth";

const Stack = createNativeStackNavigator();

/* This component defines the possible screens that can be accessed from the Profile Tab */
const ProfileTab = ({navigation}) => {
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
              onPress={() => navigation.navigate("Profile Settings")}
            >
              <FontAwesome6
                name="gear"
                size={20}
                color={theme.colors.black}
              />
            </TouchableOpacity>
          )
        })} />
        <Stack.Screen 
        name="Profile Settings"
        component={ProfileSettings}
        options={() => ({
          headerTitle: () => (
            <Text style={styles.title}>Settings</Text>
          ),
        
        })} 
        />
      </Stack.Navigator>
    )
}


// example of styling
const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ProfileTab;