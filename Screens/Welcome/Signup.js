import React from "react";
import { ScrollView, Text, StyleSheet, View, KeyboardAvoidingView, Alert } from "react-native";
import theme from "../../theme";
import { useAppContext } from "../../AppContext";
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
import { useUserContext } from "../../UserContext";

const SignupScreen = ({ navigation }) => {
    const { state, isLoading } = useAppContext();
    const [name, onChangeName] = React.useState('');
    const [email, onChangeEmail] = React.useState('');
    const [password, onChangePassword] = React.useState('');
    const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);
    const [hasGalleryPermission, setHasGalleryPermission] = React.useState(false);
    const [image, setImage] = React.useState(null);
    const [showPassword, setShowPassword] = React.useState(false);


    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    React.useEffect(() => {
        (async () => {
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');
        })();
    }, []);

    React.useEffect(() => {
        if (name !== '' && email !== '' && password !== '') {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [name, email, password]);

    const handleSubmit = async () => {
        try {
            console.log('handleSubmit triggered');
            if (email && password) {
                console.log('Creating user with email and password...');
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

                console.log('Signing in the user...');
                await signInWithEmailAndPassword(auth, email, password);
                console.log('User signed in');
            }
        } catch (error) {
            console.error('Error during sign up:', error);
            Alert.alert("Sign Up Error", error.message);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 10 }} behavior="padding" keyboardVerticalOffset={10}>
            <ScrollView style={{ backgroundColor: theme.colors.white }}>
                {isLoading ? <Text>Loading...</Text> :
                    <View style={styles.screen}>
                        <View style={styles.container}>
                            <Text style={styles.title}>promptu</Text>
                            <View style={styles.topSection}>
                                <InputImage image={image} setImage={setImage} />
                                <View style={styles.form}>
                                    <ThirdPartyAuth title="Sign up with Google" />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5, marginBottom: 29, marginTop: 16 }}>
                                    <View style={{ flex: 1, height: 1, backgroundColor: '#E0E5EC' }} />
                                    <View>
                                        <Text style={{ fontFamily: "Poppins_400Regular", width: 50, textAlign: 'center' }}>Or</Text>
                                    </View>
                                    <View style={{ flex: 1, height: 1, backgroundColor: '#E0E5EC' }} />
                                </View>
                                <View style={styles.form}>
                                    <SingleInput placeholder="Full Name" onChangeText={onChangeName} text={name} passwordBool={false} />
                                    <SingleInput placeholder="Email" onChangeText={onChangeEmail} text={email} passwordBool={false} />
                                    <SingleInputSecure placeholder="Password" onChangeText={onChangePassword} text={password} showPassword={showPassword} toggleShowPassword={toggleShowPassword} />
                                </View>
                            </View>
                        </View>
                        <View style={styles.bottomSection}>
                            <Button title="Create Account" disabled={isButtonDisabled} onPress={handleSubmit} />
                            <Text style={styles.signupText}>
                                Do you have an account? <Text style={{ color: theme.colors.purple }} onPress={() => navigation.navigate('Login')}>Sign in</Text>
                            </Text>
                        </View>
                    </View>
                }
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default SignupScreen;

const styles = StyleSheet.create({
    screen: { padding: 20 },
    title: { fontFamily: "PatrickHandSC_400Regular", fontSize: 70, marginVertical: 40 },
    topSection: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
    form: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
    bottomSection: { display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', marginVertical: 30 },
    container: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
    signupText: { fontSize: 14, fontFamily: "Poppins_400Regular", textAlign: 'center', margin: 16 }
});
