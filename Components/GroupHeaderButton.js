import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import theme from '../theme';
import { FontAwesome6 } from '@expo/vector-icons';

const GroupHeaderButton = ({ group, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.groupNameButton}
      onPress={onPress}
    >
      <GroupPhoto groupPhoto={group.groupPhoto} />
      <Text style={styles.groupNameText}>{group.name}</Text>
      {/* <FontAwesome6
        name="chevron-right"
        size={8}
        color={theme.colors.black} /> */}
    </TouchableOpacity>
  );
};

const GroupPhoto = ({ groupPhoto }) => {
  return (
    <View style={{ marginRight: 5 }}>
      {groupPhoto ?
        <Image style={styles.groupPhoto} source={groupPhoto} />
        :
        <View style={styles.groupPhotoIcon}>
          <FontAwesome6 name="users" size={9} color={theme.colors.white} />
        </View>}
    </View>
  );
};

const styles = StyleSheet.create({
  groupNameText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  groupNameButton: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center'
  },
  groupPhoto: {
    width: 20,
    height: 20,
    borderRadius: 30,
  },
  groupPhotoIcon: {
    backgroundColor: theme.colors.lightPurple,
    width: 20,
    height: 20,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GroupHeaderButton;