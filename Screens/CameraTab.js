import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainCameraScreen from './Camera/MainCameraScreen';

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
      </Stack.Navigator>
    )
}

const styles = StyleSheet.create({
  component: {},
});

export default CameraTab;