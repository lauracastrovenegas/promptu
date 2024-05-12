import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import theme from '../theme';
import google from '../assets/google_icon.png';


const ThirdPartyAuth = ({ title, onPress, disabled }) => {
    const [text, onChangeText] = React.useState('');
    return (
        <TouchableOpacity onPress={onPress} disabled={disabled} style={disabled ? styles.buttonDisabled : styles.button}>
            <View style={styles.contents}>
                <Image source={google} style={styles.logo} />
                <Text style={styles.buttonText}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        backgroundColor: theme.colors.lighterPurple,
        width: '100%',
        borderRadius: 14,
    },
    buttonDisabled: {
        flexDirection: 'row',
        backgroundColor: theme.colors.lightPurple,
        width: '100%',
        borderRadius: 14,
    },
    buttonText: {
        color: '#61677D',
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
    },
    logo: {
        width: 24,
        height: 24,
        marginRight: 16,
    },
    contents: {
        flex: 1, // Take the remaining space
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },

});


export default ThirdPartyAuth;


