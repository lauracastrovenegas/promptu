import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import theme from '../theme';


const SingleInput = ({ placeholder, onChangeText, text, showSecureIcon }) => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
          placeholder={placeholder}
          placeholderTextColor="#7C8BA0"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 20,
    borderRadius: 14,
    backgroundColor: theme.colors.lighterPurple,
    width: '100%',
  },
  input: {
    flex: 1, // Take the remaining space
  },
});


export default SingleInput;