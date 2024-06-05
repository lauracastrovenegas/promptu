import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import CardContainer from './CardContainer';
import theme from '../theme';
import * as Clipboard from 'expo-clipboard';

const GroupLink = ({ link }) => {
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(link);
    alert('Code copied to clipboard!');
  };

  return (
    <TouchableOpacity
      onPress={() => copyToClipboard()}
    >
      <CardContainer>
        <View style={styles.groupLink}>
          <FontAwesome6
            name="link"
            size={18}
            color={theme.colors.black}
          />
          <Text style={styles.groupLinkText}>{link}</Text>
        </View>
      </CardContainer>
    </TouchableOpacity>
  );
};

export default GroupLink;

const styles = StyleSheet.create({
  groupLink: {
    flexDirection: 'row',
    gap: 20,
  },
  groupLinkText: {
    flex: 2,
    fontSize: 16,
  }
});