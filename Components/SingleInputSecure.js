import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import theme from '../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

const SingleInputSecure = ({ placeholder, onChangeText, text, showPassword, toggleShowPassword }) => {

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <TextInput
                    secureTextEntry={!showPassword}
                    value={text}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#7C8BA0"
                    style={styles.input} // Added style for the input
                />
                <MaterialCommunityIcons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="#aaa"
                    onPress={toggleShowPassword}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        width: 390,
        marginBottom: 16,
        padding: 10,
        borderRadius: 14,
        backgroundColor: theme.colors.lighterPurple,
    },
    input: {
        flex: 1, // Take the remaining space
    },
});

export default SingleInputSecure;
