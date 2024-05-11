import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import theme from '../theme';


const SingleInput = ({ placeholder, onChangeText, text }) => {

  return (
    <SafeAreaView>

      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder={placeholder}
        placeholderTextColor="#7C8BA0"

      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 60,
    width: 390,
    marginBottom: 16,
    padding: 10,
    borderRadius: 14,
    backgroundColor: theme.colors.lighterPurple,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    paddingHorizontal: 14,
  },
});


export default SingleInput;