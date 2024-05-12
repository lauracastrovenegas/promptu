import React from "react";
import { ScrollView, Text, StyleSheet, View, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import theme from "../../theme";
import { useAppContext } from "../../AppContext";
import SingleInput from "../../Components/SingleInput";
import ThirdPartyAuth from "../../Components/ThirdPartyAuth";
import Button from "../../Components/Button";
import SingleInputSecure from "../../Components/SingleInputSecure";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";

/* This component is the Login Screen */
const LoginScreen = ({ navigation }) => {
    const { state, isLoading } = useAppContext();
    const [email, onChangeEmail] = React.useState('');
    const [password, onChangePassword] = React.useState('');
    const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);

    // State variable to track password visibility 
    const [showPassword, setShowPassword] = React.useState(false);

    // Function to toggle the password visibility state 
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async () => {
        if (email && password) {
            try {
                await signInWithEmailAndPassword(auth, email, password);
            } catch (err) {
                console.log('Error: ', err.message);
            }
        }
    }

    // Function to check if all fields are filled and set the button disabled state accordingly
    React.useEffect(() => {
        if (email !== '' && password !== '') {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [email, password]);


    return (
        <KeyboardAvoidingView style={styles.screen} behavior="padding" keyboardVerticalOffset={10}>
            {isLoading ? <Text>Loading...</Text> :
                <ScrollView>
                    <View style={styles.screen2}>
                        <View style={styles.welcomeBox}>
                            <Text style={styles.title}>promptu</Text>
                            <Text style={styles.subtext}>Log in with the data you entered during registration.</Text>
                        </View>

                        <View style={styles.topSection}>

                            <ThirdPartyAuth
                                title="Sign in with Google">
                            </ThirdPartyAuth>
                            <View style={{ flexDirection: 'row', alignItems: 'center', margin: 5, marginBottom: 29, marginTop: 16 }}>
                                <View style={{ flex: 1, height: 1, backgroundColor: '#E0E5EC' }} />
                                <View>
                                    <Text style={{ fontFamily: "Poppins_400Regular", width: 50, textAlign: 'center' }}>Or</Text>
                                </View>
                                <View style={{ flex: 1, height: 1, backgroundColor: '#E0E5EC' }} />
                            </View>
                            <View style={styles.form}>
                                <SingleInput
                                    placeholder="Email"
                                    onChangeText={onChangeEmail}
                                    text={email}
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
                        <View style={styles.bottomSection}>
                            <Button
                                title="Sign in"
                                disabled={isButtonDisabled}
                                onPress={handleSubmit}
                            />
                            <TouchableOpacity onPress={() => navigation.navigate('Signup')} >
                                <Text style={styles.signupText}>
                                    <Text style={[styles.signupText, { color: theme.colors.black }]}>Don't have an account? </Text>
                                    <Text style={[styles.signupText, { color: theme.colors.purple }]}> Sign up</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>}
        </KeyboardAvoidingView>
    )
};

export default LoginScreen;

const styles = StyleSheet.create({
    screen: {
        flexDirection: 'column',
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: theme.colors.white,
        height: '100%',
        flex: 10
    },
    screen2: {
        minHeight: '100%',
        flex: 1,
        padding: 20,
    },
    welcomeBox: {
        display: 'flex',
        alignItems: 'center',
        flex: 2,
        justifyContent: 'center',
    },
    title: {
        fontFamily: "PatrickHandSC_400Regular",
        fontSize: 70,
    },
    subtext: {
        fontFamily: "Poppins_400Regular",
        color: "#7C8BA0",
        marginBottom: 20
    },
    topSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 3,
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
        height: 'fit-content',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
    },
    signupText: {
        fontSize: "14px",
        fontFamily: "Poppins_400Regular",
        textAlign: 'center',
        margin: 16,
    },
});
