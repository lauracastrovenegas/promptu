import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import theme from '../theme';

const GroupPhotoName = ({ group }) => {
  return (
    <View style={styles.groupPicAndName}>
      <GroupPhoto groupPhoto={group.groupPhoto} />
      <Text style={styles.groupName} numberOfLines={1}>{group.name}</Text>
    </View>
  );
};

const GroupPhoto = ({ groupPhoto }) => {
  return (
    <View style={styles.centerImages}>
      {groupPhoto ?
        <Image style={styles.groupPhoto} source={groupPhoto} />
        :
        <View style={styles.groupPhotoIcon}>
          <FontAwesome6 name="users" size={30} color={theme.colors.white} />
        </View>}
    </View>
  );
};

const styles = StyleSheet.create({
  groupName: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  groupPicAndName: {
    gap: 5,
  },
  groupPhoto: {
    width: 75,
    height: 75,
    borderRadius: 50,
  },
  groupPhotoIcon: {
    backgroundColor: theme.colors.lightPurple,
    width: 75,
    height: 75,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerImages: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  }
});

export default GroupPhotoName;