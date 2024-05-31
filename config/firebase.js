import { initializeApp, getApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, doc, getDoc, getDocs, updateDoc, collection, query, where } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC0dBiY-wDc_hMuwjAdHHjpgKgDqmDL2W4",
  authDomain: "promptu-cs278.firebaseapp.com",
  projectId: "promptu-cs278",
  storageBucket: "promptu-cs278.appspot.com",
  messagingSenderId: "20940171622",
  appId: "1:20940171622:web:096c16007ad10c3459c0a7",
  measurementId: "G-SNGG5GLP88"
};

let app;
let auth;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} else {
  app = getApp();
  auth = getAuth(app);
}

const storage = getStorage(app);
const db = getFirestore(app);



export const getUserData = async (uid) => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log("No user document exists.");
      return null;
    }
  } catch (error) {
    console.log("Error getting document in getUserData: ", error.message);
    return null;
  }
};

export const getGroupData = async (uid) => {
  try {
    const q = query(collection(db, "groups"), where("members", "array-contains-any", [uid]));
    const querySnapshot = await getDocs(q);
    let allMembers = [];
    const groupsData = [];

    querySnapshot.forEach(async (groupDoc) => {
      const groupData = groupDoc.data();
      groupData.id = groupDoc.id;

      const members = groupData.members;

      groupsData.push(groupData);

      members.forEach((member) => {
        if (!allMembers.includes(member)) {
          allMembers.push(member);
        }
      })
    });

    const membersData = await Promise.all(Array.from(allMembers).map(async (userId) => {
      return await getUserData(userId);
    }));

    const fullGroupData = groupsData.map((groupData) => {
      const membersWithPhotos = groupData.members.map((userId) => {
        for (let i = 0; i < membersData.length; i++) {
          const member = membersData[i];
          if (member.uid === userId) {
            return member;
          }
        }
        return null;
      });

      return { ...groupData, members: membersWithPhotos };
    });

    return fullGroupData;
  } catch (error) {
    console.log("Error getting document in fullGroupData: ", error.message);
    return [];
  }
};

export const getGroupContestData = async (groupIds) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const dateStamp = year + "-" + month + "-" + day;

  try {
    if (groupIds.length === 0) {
      return [];
    }

    const q = query(collection(db, "group_contests"), where("groupId", "in", groupIds), where("date", "==", dateStamp))
    const querySnapshot = await getDocs(q);
    const groupContestData = [];

    querySnapshot.forEach((groupContestDoc) => {
      const groupContest = groupContestDoc.data();
      groupContest.id = groupContestDoc.id;

      groupContestData.push(groupContest);
    });

    console.log("groupContestData: ", groupContestData);

    return groupContestData
  } catch (error) {
    console.log("Error getting document in getGroupContestData: ", error.message);
    return [];
  }
};

export const UpdateGroupContestWithSubmission = async (groupId, photo, caption, uid) => {
  const newSubmission = {
    photo: photo,
    caption: caption,
    userId: uid,
  };


  try {
    const groupContestDocRef = doc(db, "group_contests", groupId);
    const groupContestDoc = await getDoc(groupContestDocRef);

    if (groupContestDoc.exists()) {
      const groupContestData = groupContestDoc.data();

      await updateDoc(groupContestDocRef, {
        submissions: [...groupContestData.submissions, newSubmission]
      });

      return { ...newSubmission, id: groupId };
    } else {
      return null;
    }

  } catch (error) {
    console.log("Error getting document in UpdateGroupContestWithSubmission: ", error.message);
  }
}

export { db, auth, app, storage };