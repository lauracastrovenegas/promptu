import React from "react";
import { ScrollView, Text, StyleSheet, View, Image } from "react-native";
import theme from "../../theme";
import { useAppContext } from "../../AppContext";
import logo from "../../assets/promptu_logo_app.png"
import Button from "../../Components/Button";
import WhiteButton from "../../Components/WhiteButton";



const WelcomeScreen = ({ navigation }) => {
    const { state, isLoading } = useAppContext();

    const user = state.userData;
    return (
        <ScrollView style={{ backgroundColor: theme.colors.lightPurple }}>
            {isLoading ? <Text>Loading...</Text> :
                <View style={styles.screen}>
                    <View style={styles.topSection}>
                        <Image source={logo} style={styles.logo} />
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
                </View>}
        </ScrollView>
    )
}

export default WelcomeScreen

const styles = StyleSheet.create({
    screen: {
        padding: 20,
    },
    logo: {
        width: 430,
        height: 465,
    },
    topSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: "50%",
    },

    bottomSection: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        marginVertical: -100
    }
    
});