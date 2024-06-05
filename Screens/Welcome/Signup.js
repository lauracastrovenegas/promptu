import React, { useState, useEffect } from "react";
import { ScrollView, Text, StyleSheet, View, KeyboardAvoidingView, Alert } from "react-native";
import theme from "../../theme";
import InputImage from "../../Components/InputImage";
import SingleInput from "../../Components/SingleInput";
import ThirdPartyAuth from "../../Components/ThirdPartyAuth";
import Button from "../../Components/Button";
import SingleInputSecure from "../../Components/SingleInputSecure";
import * as ImagePicker from "expo-image-picker";
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { auth, storage, db } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { set } from "firebase/database";

const SignupScreen = ({ navigation }) => {
  const [name, onChangeName] = useState('');
  const [email, onChangeEmail] = useState('');
  const [password, onChangePassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(false);
  const [image, setImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    (async () => {
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (name !== '' && email !== '' && password !== '') {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [name, email, password]);

  const handleSubmit = async () => {
    setIsButtonLoading(true);
    try {
      console.log('handleSubmit triggered');
      if (email && password) {
        console.log('Creating user with email and password and signing in...');
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredentials.user;
        console.log('User created:', user.uid);

        let photoURL = null;
        if (image) {
          console.log('Uploading image...');
          const response = await fetch(image);
          const blob = await response.blob();
          const storageRef = ref(storage, `profile_pictures/${user.uid}`);
          await uploadBytes(storageRef, blob);
          photoURL = await getDownloadURL(storageRef);
          console.log('Image uploaded:', photoURL);
        }

        console.log('Updating user profile...');
        await updateProfile(user, { displayName: name, photoURL });
        console.log('User profile updated');

        console.log('Storing user data in Firestore...');
        await setDoc(doc(db, "users", user.uid), {
          displayName: name,
          email: user.email,
          photoURL,
          uid: user.uid,
        });
        console.log('User data stored in Firestore');
        setIsButtonLoading(false);
      }
    } catch (error) {
      console.log('Error during sign up:', error);
      Alert.alert("Sign Up Error", error.message);
      setIsButtonLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior="padding">
      <ScrollView>
        <View style={styles.screen2}>
          <Text style={styles.title}>promptu</Text>
          <View style={styles.topSection}>
            <InputImage image={image} setImage={setImage} profile={true} />
            {/* <View style={styles.form}>
              <ThirdPartyAuth title="Sign up with Google" />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5, marginBottom: 29, marginTop: 16 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: '#E0E5EC' }} />
              <View>
                <Text style={{ fontFamily: "Poppins_400Regular", width: 50, textAlign: 'center' }}>Or</Text>
              </View>
              <View style={{ flex: 1, height: 1, backgroundColor: '#E0E5EC' }} />
            </View> */}
            <View style={styles.form}>
              <SingleInput placeholder="Full Name" onChangeText={onChangeName} text={name} passwordBool={false} />
              <SingleInput placeholder="Email" onChangeText={onChangeEmail} text={email} passwordBool={false} />
              <SingleInputSecure placeholder="Password" onChangeText={onChangePassword} text={password} showPassword={showPassword} toggleShowPassword={toggleShowPassword} />
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomSection}>
        <Button title="Create Account" disabled={isButtonDisabled} onPress={handleSubmit} />
        <Text style={styles.signupText}>
          Do you have an account? <Text style={{ color: theme.colors.purple }} onPress={() => navigation.navigate('Login')}>Sign in</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  screen: {
    flexDirection: 'column',
    paddingTop: 60,
    backgroundColor: theme.colors.white,
    height: '100%',
    flex: 10
  },
  screen2: {
		flex: 1,
		padding: 20,
  },
  title: {
    fontFamily: "PatrickHandSC_400Regular",
    fontSize: 70,
    marginBottom: 40,
    textAlign: 'center',
  },
  topSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomSection: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    height: 'fit-content',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 3,
  },
  signupText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    textAlign: 'center',
    margin: 16
  }
});
