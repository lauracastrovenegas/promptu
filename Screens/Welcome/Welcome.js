import React from "react";
import { StyleSheet, View, Image } from "react-native";
import theme from "../../theme";
import logo from "../../assets/promptu_logo_app.png"
import Button from "../../Components/Button";
import WhiteButton from "../../Components/WhiteButton";

const WelcomeScreen = ({ navigation }) => {
	return (
		<View style={styles.screen}>
			<View style={styles.topSection}>
				<Image source={logo} style={styles.logo} resizeMode="cover" />
			</View>
			<View style={styles.bottomSection}>
				<Button
					title="Log in"
					onPress={() => {
						navigation.navigate('Login')
					}
					} />
				<WhiteButton
					title="Create Account"
					onPress={() => {
						navigation.navigate('Signup')
					}
					} />
			</View>
		</View>
	)
}

export default WelcomeScreen

const styles = StyleSheet.create({
	screen: {
		flexDirection: 'column',
		paddingTop: 60,
		paddingBottom: 20,
		backgroundColor: theme.colors.lightPurple,
		height: '100%',
	},
	logo: {
		width: '100%',
		height: '80%',
	},
	topSection: {
		flexDirection: 'column',
		width: '100%',
		justifyContent: 'center',
		flex: 1,
		paddingTop: '15%',
	},
	bottomSection: {
		padding: 20,
	}
});