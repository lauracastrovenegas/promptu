import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import { getUserData } from '../config/firebase';

const UserPhotoName = ({ user }) => {
  const [userData, setUserData] = React.useState(null);

  if (!userData) {
    return null;
  }

  useEffect(() => {
      const fetchAndSetUserData = async (uid) => {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
      if (!userData) {
        fetchAndSetUserData(user.uid);
      }
  }, []);

  return (
    <View style={styles.userPicAndName}>
      <UserPhoto userPhoto={userData.photo} />
      <Text style={styles.userName} numberOfLines={1}>{userData.name}</Text>
    </View>
  );
};

const UserPhoto = ({ userPhoto }) => {
  return (
    <View style={styles.centerImages}>
        <Image style={styles.userPhoto} source={{ uri : groupPhoto}} />
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