import React from 'react';
import { View, StyleSheet } from 'react-native';
import theme from '../theme';

const CardContainer = ({ children, selected }) => {
  return (
    <View style={[styles.container].concat(selected ? styles.containerSelected : {})}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
    backgroundColor: theme.colors.white,
  },
  containerSelected: {
    borderColor: theme.colors.purple,
    backgroundColor: theme.colors.purple,
    color: theme.colors.white,
  },
});

export default CardContainer;