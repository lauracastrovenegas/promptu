import React from 'react';
import { View, StyleSheet } from 'react-native';
import theme from '../theme';

const CardContainer = ({children}) => {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
  },
});

export default CardContainer;