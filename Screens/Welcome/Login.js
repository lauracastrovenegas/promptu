import React, { useState, useEffect } from "react";
import { ScrollView, Text, StyleSheet, View, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import theme from "../../theme";
import SingleInput from "../../Components/SingleInput";
import ThirdPartyAuth from "../../Components/ThirdPartyAuth";
import Button from "../../Components/Button";
import SingleInputSecure from "../../Components/SingleInputSecure";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";

/* This component is the Login Screen */
const LoginScreen = ({ navigation }) => {
	const [email, onChangeEmail] = useState('');
	const [password, onChangePassword] = useState('');
	const [isButtonDisabled, setIsButtonDisabled] = useState(true);
	const [isFormValid, setFormValid] = useState(false);
	const [formErrors, setFormErrors] = useState('');
	const [isButtonLoading, setIsButtonLoading] = useState(false);

	// State variable to track password visibility 
	const [showPassword, setShowPassword] = useState(false);

	// Function to toggle the password visibility state 
	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleSubmit = async () => {
		if (email && password) {
			setIsButtonLoading(true);
			try {
				await signInWithEmailAndPassword(auth, email, password);
				setIsButtonLoading(false);
			} catch (err) {
				setFormValid(false);
				setFormErrors(err.message);
				console.log("Error in logging in: ", err.message);
				setIsButtonLoading(false);
			}
		}
	}

	// Function to check if all fields are filled and set the button disabled state accordingly
	useEffect(() => {
		if (email !== '' && password !== '') {
			setIsButtonDisabled(false);
		} else {
			setIsButtonDisabled(true);
		}
	}, [email, password]);

	return (
		<KeyboardAvoidingView style={styles.screen} behavior="padding">
			<ScrollView>
				<View style={styles.screen2}>
					<View style={styles.welcomeBox}>
						<Text style={styles.title}>promptu</Text>
						<Text style={styles.subtext}>Log in with the data you entered during registration.</Text>
					</View>
					<View style={styles.topSection}>
						{/* <ThirdPartyAuth
							title="Sign in with Google">
						</ThirdPartyAuth>
						<View style={{ flexDirection: 'row', alignItems: 'center', margin: 5, marginBottom: 29, marginTop: 16 }}>
							<View style={{ flex: 1, height: 1, backgroundColor: '#E0E5EC' }} />
							<View>
								<Text style={{ fontFamily: "Poppins_400Regular", width: 50, textAlign: 'center' }}>Or</Text>
							</View>
							<View style={{ flex: 1, height: 1, backgroundColor: '#E0E5EC' }} />
						</View> */}
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
						{!isFormValid ?
							<Text style={{ color: 'red', fontFamily: "Poppins_400Regular", width: '90%', textAlign: 'center' }}>{formErrors}</Text>
							:
							null}
					</View>
				</View>
			</ScrollView>
			<View style={styles.bottomSection}>
				<Button
					title="Sign in"
					disabled={isButtonDisabled}
					onPress={handleSubmit}
					isLoading={isButtonLoading}
				/>
				<Text style={styles.signupText}>
					Don't have an account?
					<Text style={{ color: theme.colors.purple }} onPress={() => navigation.navigate('Signup')}> Sign up</Text>
				</Text>
			</View>
		</KeyboardAvoidingView>
	)
};

export default LoginScreen;

const styles = StyleSheet.create({
	screen: {
		flexDirection: 'column',
		paddingTop: 60,
		backgroundColor: theme.colors.white,
		height: '100%',
		flex: 10,
	},
	screen2: {
		flex: 1,
		padding: 20,
	},
	welcomeBox: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 60,
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
		padding: 20,
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
