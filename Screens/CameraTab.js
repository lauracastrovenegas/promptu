import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainCameraScreen from './Camera/MainCameraScreen';
import PhotoSubmissionScreen from './Camera/PhotoSubmissionScreen';

const Stack = createNativeStackNavigator();

/* This component defines the possible screens that can be accessed from the Camera Tab */
const CameraTab = ({ route }) => {
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
              <Image style={styles.icon}
                source={require('../assets/back.png')}
              />
            </TouchableOpacity>
          ),
        })} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  submitPageTitle: {
    textTransform: 'uppercase',
    fontFamily: "PatrickHand_400Regular",
    fontSize: 24,
  },
  icon: {
    width: 27,
    height: 25,
    objectFit: 'fill',
    marginRight: 10,
  },
});

export default CameraTab;