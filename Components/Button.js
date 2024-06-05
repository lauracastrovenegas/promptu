import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import theme from '../theme';

const Button = ({ title, onPress, disabled, small }) => {
  return (
    <TouchableOpacity style={[small ? styles.small : styles.normal].concat(disabled ? [styles.buttonDisabled] : [styles.button])} onPress={onPress} disabled={disabled}>
      <Text style={small ? styles.buttonTextSmall : styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.purple,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  normal: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  small: {
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.lightPurple,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  buttonTextSmall: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default Button;