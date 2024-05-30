import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import { db, getUserData } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';


const getFirstNameAndLastInitial = (displayName) => {
 if (!displayName) return '';


 const nameParts = displayName.split(' ');
 const firstName = nameParts[0];
 const lastInitial = nameParts.length > 1 ? nameParts[1].charAt(0) : '';
 return lastInitial ? `${firstName} ${lastInitial}.` : firstName;
};
const UserPhotoName = ({ user }) => {
 const [userData, setUserData] = useState(null);


 useEffect(() => {
   const fetchAndSetUserData = async (uid) => {
     const userDoc = await getDoc(doc(db, 'users', uid));
     if (userDoc.exists()) {
       setUserData(userDoc.data());
     }
   };


   if (user && !userData) {
     fetchAndSetUserData(user);
   }
 }, [user, userData]);


 return (
   <View style={styles.userPicAndName}>
     {userData ? (
       <View>
         <UserPhoto userPhoto={userData.photoURL} />
         <Text style={styles.userName} numberOfLines={1}>{getFirstNameAndLastInitial(userData.displayName)}</Text>
       </View>
     ) : (
       <Text>Loading...</Text>
     )}
   </View>
 );
};


const UserPhoto = ({ userPhoto }) => {
 return (
   <View style={styles.centerImages}>
     <Image style={styles.userPhoto} source={{ uri: userPhoto }} />
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



