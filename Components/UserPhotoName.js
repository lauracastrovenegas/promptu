import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';

const UserPhotoName = ({ user }) => {
  return (
    <View style={styles.userPicAndName}>
      <UserPhoto userPhoto={user.user.photo} />
      <Text style={styles.userName} numberOfLines={1}>{user.user.name}</Text>
    </View>
  );
};

const UserPhoto = ({ userPhoto }) => {
  return (
    <View style={styles.centerImages}>
        <Image style={styles.userPhoto} source={userPhoto} />
    </View>
  );
};

const styles = StyleSheet.create({
  userName: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userPicAndName: {
    gap: 5,
  },
  userPhoto: {
    width: 44,
    height: 44,
    borderRadius: 50,
  },
  centerImages: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  }
});

export default UserPhotoName;