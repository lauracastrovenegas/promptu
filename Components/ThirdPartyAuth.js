import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import theme from '../theme';
import google from '../assets/google_icon.png';


const ThirdPartyAuth = ({ title, onPress, disabled }) => {
    const [text, onChangeText] = React.useState('');
    return (
        <TouchableOpacity style={disabled ? styles.buttonDisabled : styles.button} onPress={onPress} disabled={disabled}>
                <Image source={google} style={styles.logo} />
                <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 60,
        width: 390,
        margin: 12,
        padding: 10,
        borderRadius: 14,
        backgroundColor: theme.colors.lighterPurple,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonDisabled: {
        backgroundColor: theme.colors.lightPurple,
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#61677D',
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
    },
    logo: {
        width: 24,
        height: 24,
        marginRight: 17,
    },

});


export default ThirdPartyAuth;


