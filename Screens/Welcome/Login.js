import React from "react";
import { ScrollView, Text, StyleSheet, View, Image, TouchableOpacity, Pressable } from "react-native";
import theme from "../../theme";
import { useAppContext } from "../../AppContext";
import SingleInput from "../../Components/SingleInput";
import ThirdPartyAuth from "../../Components/ThirdPartyAuth";
import Button from "../../Components/Button";
import SingleInputSecure from "../../Components/SingleInputSecure";
import * as ImagePicker from "expo-image-picker";

/* This component is the Signup Screen */
const SignupScreen = ({ navigation }) => {
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

    // Function to check if all fields are filled and set the button disabled state accordingly
    React.useEffect(() => {
        if (email !== '' && password !== '') {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [email, password]);


    return (
        <ScrollView style={{ backgroundColor: theme.colors.white }}>
            {isLoading ? <Text>Loading...</Text> :
                <View style={styles.screen}>
                    <View style={styles.container}>
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
                                    placeholder="Email/Phone Number"
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
                    </View>
                    <View style={styles.bottomSection}>
                        <Button
                            title="Sign in"
                            disabled={isButtonDisabled} />
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')} >
                            <Text style={styles.signupText}>
                                <Text style={[styles.signupText, { color: theme.colors.black }]}>Don't have an account? </Text>
                                <Text style={[styles.signupText, { color: theme.colors.purple }]}> Sign up</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>}

        </ScrollView>

    )
};

export default SignupScreen;

const styles = StyleSheet.create({
    screen: {
        padding: 20,
    },
    welcomeBox: {
        display: 'flex',
        alignItems: 'center',
        marginVertical: "34%",
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
        marginVertical: -40
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
        marginVertical: 148
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    signupText: {
        fontSize: "14px",
        fontFamily: "Poppins_400Regular",
        textAlign: 'center',
        margin: 16,
    },
});
