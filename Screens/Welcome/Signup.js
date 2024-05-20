import React from "react";
import { ScrollView, Text, StyleSheet, View, Image, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import theme from "../../theme";
import { useAppContext } from "../../AppContext";
import InputImage from "../../Components/InputImage";
import SingleInput from "../../Components/SingleInput";
import ThirdPartyAuth from "../../Components/ThirdPartyAuth";
import Button from "../../Components/Button";
import SingleInputSecure from "../../Components/SingleInputSecure";
import * as ImagePicker from "expo-image-picker";
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { addUserToFirestore, uploadImageAsync } from "../../config/firebase";

/* This component is the Signup Screen */
const SignupScreen = ({ navigation }) => {
    const { state, isLoading } = useAppContext();
    const [name, onChangeName] = React.useState('');
    const [email, onChangeEmail] = React.useState('');
    const [password, onChangePassword] = React.useState('');
    const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);
    const [hasGalleryPermission, setHasGalleryPermission] = React.useState(false);
    const [isFormValid, setFormValid] = React.useState(false);
    const [formErrors, setFormErrors] = React.useState('');
    const [image, setImage] = React.useState(null);

    // State variable to track password visibility 
    const [showPassword, setShowPassword] = React.useState(false);

    // Function to toggle the password visibility state 
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async () => {
        if (email && password) {
            try {
                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
                let photoURL = null;
                if (image) {
                    photoURL = await uploadImageAsync(image);
                }
                await updateProfile(userCredentials.user, { displayName: name, photoURL: photoURL });

                const user = {
                    uid: userCredentials.user.uid,
                    displayName: name,
                    photoURL: photoURL,
                };
                console.log("User object to be added to Firestore: ", user);
                await addUserToFirestore(user);
                console.log("User added to Firestore successfully");
            } catch (error) {
                setFormValid(false);
                setFormErrors(error.message);
                console.log("Error during sign up: ", error.message);

                // Clean up the user from Firebase Auth in case of an error in adding user to db
                const currentUser = auth.currentUser;
                if (currentUser) {
                    try {
                        await currentUser.delete();
                        console.log("Partially created user deleted from Firebase Auth");
                    } catch (cleanupError) {
                        console.log("Error during user cleanup: ", cleanupError.message);
                    }
                }
            }
        }
    }


    // Function to check if all fields are filled and set the button disabled state accordingly
    React.useEffect(() => {
        if (name !== '' && email !== '' && password !== '') {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [name, email, password]);

    React.useEffect(() => {
        (async () => {
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');
        })();
    }, []);

    return (
        <KeyboardAvoidingView style={{ flex: 10 }} behavior="padding" keyboardVerticalOffset={10}>
            <ScrollView style={{ backgroundColor: theme.colors.white }}>
                {isLoading ? <Text>Loading...</Text> :
                    <View style={styles.screen}>
                        <View style={styles.container}>
                            <Text style={styles.title}>promptu</Text>
                            <View style={styles.topSection}>
                                <InputImage image={image} setImage={setImage} profile={true} />
                                <View style={styles.form}>
                                    <ThirdPartyAuth
                                        title="Sign up with Google">
                                    </ThirdPartyAuth>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5, marginBottom: 29, marginTop: 16 }}>
                                    <View style={{ flex: 1, height: 1, backgroundColor: '#E0E5EC' }} />
                                    <View>
                                        <Text style={{ fontFamily: "Poppins_400Regular", width: 50, textAlign: 'center' }}>Or</Text>
                                    </View>
                                    <View style={{ flex: 1, height: 1, backgroundColor: '#E0E5EC' }} />
                                </View>
                                <View style={styles.form}>
                                    <SingleInput
                                        placeholder="Full Name"
                                        onChangeText={onChangeName}
                                        text={name}
                                        passwordBool={false}
                                    />
                                    <SingleInput
                                        placeholder="Email"
                                        onChangeText={onChangeEmail}
                                        text={email.trim()}
                                        passwordBool={false}
                                    />
                                    <SingleInputSecure
                                        placeholder="Password"
                                        onChangeText={onChangePassword}
                                        text={password}
                                        showPassword={showPassword}
                                        toggleShowPassword={toggleShowPassword}
                                    />
                                </View>
                            </View>
                            {!isFormValid ?
                                <Text style={{ color: 'red', fontFamily: "Poppins_400Regular", width: '90%', textAlign: 'center' }}>{formErrors}</Text>
                                :
                                null}
                        </View>
                        <View style={styles.bottomSection}>
                            <Button
                                title="Create Account"
                                disabled={isButtonDisabled}
                                onPress={handleSubmit}
                            />
                            <TouchableOpacity onPress={() => navigation.navigate('Login')} >
                                <Text style={styles.signupText}>
                                    <Text style={[styles.signupText, { color: theme.colors.black }]}>Do you have an account? </Text>
                                    <Text style={[styles.signupText, { color: theme.colors.purple }]}> Sign in</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>}

            </ScrollView>
        </KeyboardAvoidingView>
    )
};

export default SignupScreen;

const styles = StyleSheet.create({
    screen: {
        padding: 20,
    },
    title: {
        fontFamily: "PatrickHandSC_400Regular",
        fontSize: 70,
        marginVertical: 40,
    },
    topSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomSection: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        marginVertical: 30
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    signupText: {
        fontSize: "14px",
        fontFamily: "Poppins_400Regular",
        textAlign: 'center',
        margin: 16,
    },
});