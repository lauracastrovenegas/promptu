import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainCameraScreen from './Camera/MainCameraScreen';
import PhotoSubmissionScreen from './Camera/PhotoSubmissionScreen';
import { FontAwesome6 } from "@expo/vector-icons";
import theme from "../theme";

const Stack = createNativeStackNavigator();

/* This component defines the possible screens that can be accessed from the Camera Tab */
const CameraTab = () => {
  return (
    <Stack.Navigator initialRouteName="Main Camera Screen">
      <Stack.Screen
        name="Main Camera Screen"
        component={MainCameraScreen}
        options={() => ({
          headerShown: false,
        })} />
      <Stack.Screen
        name="Photo Submission Screen"
        component={PhotoSubmissionScreen}
        options={({ navigation }) => ({
          headerTitle: () => (
            <Text style={styles.submitPageTitle}>Submit Photo</Text>
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
        })} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  submitPageTitle: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 10,
  },
});

export default CameraTab;