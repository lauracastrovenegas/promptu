import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome6 } from "@expo/vector-icons";
import theme from '../../theme';

/* This component is the Profile Screen */
const MainCameraScreen = () => {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (
      current === "back" ? "front" : "back"
    ));
  }
  
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} />
      <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <FontAwesome6 name="bolt" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.centerButton}>
            <FontAwesome6 name="circle" size={60} color="white" solid/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <FontAwesome6 name="rotate" size={24} color="white" />
          </TouchableOpacity>
        </View>
    </View>
  )
};

export default MainCameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 30,
  },
  buttonContainer: {
    height: 'fit-content',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    gap: 20,
    backgroundColor: theme.colors.black,
    padding: 30,
  },
  button: {
    height: 'flex-end',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 1,
    padding: 16,
    borderRadius: 50,
    margin: 'auto'
  },
  centerButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 1,
    padding: 16,
    borderRadius: 50,
    margin: 'auto'
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});