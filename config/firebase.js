import { initializeApp, getApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, doc, getDoc, getDocs, updateDoc, collection, query, where, addDoc } from "firebase/firestore";
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
    const groupContestData = [];

    for (const groupId of groupIds) {
      const groupIdString = groupId.toString();
      const groupContestQuery = query(
        collection(db, "group_contests"),
        where("groupId", "==", groupIdString),
        where("date", "==", dateStamp)
      );
      
      // Execute the query
      const results = [];
      const querySnapshot = await getDocs(groupContestQuery);
      querySnapshot.forEach((doc) => {
        const groupContest = doc.data();
        results.push(groupContest);
        groupContestData.push(groupContest);
      });
      
      if (results.length === 0) {
        // No group contest document exists, so create one
        try {
          const contestDocRef = await addDoc(collection(db, "group_contests"), {
            groupId: groupId,
            date: dateStamp,
            winner: null,
            hasVotingOccurred: false,
            prompt: "This is the prompt of the day",  // TODO fetch from prompt bank
            submissions: [],
            votes: [],
            hasVoted: [],
          });

          if (contestDocRef.exists()) {
            const contestDoc = await getDoc(contestDocRef);
            groupContestData.push(contestDoc.data());
          }
          
        } catch (error) {
          console.log("Error creating group contest: ", error.message);
        }
      }
    }

    return groupContestData
  } catch (error) {
    console.log("Error getting document in getGroupContestData: ", error.message);
    return [];
  }
};

export const UpdateGroupContestWithSubmission = async (groupContestId, photo, caption, uid) => {
  const newSubmission = {
    photo: photo,
    caption: caption,
    userId: uid,
  };

  try {
    const groupContestDocRef = doc(db, "group_contests", groupContestId);
    const groupContestDoc = await getDoc(groupContestDocRef);

    if (groupContestDoc.exists()) {
      const groupContestData = groupContestDoc.data();

      const originalSubmissions = groupContestData.submissions;
      const usersWhoSubmitted = originalSubmissions.map(submission => submission.userId);

      let updatedSubmissions = [];
      if (!usersWhoSubmitted.includes(uid)) {
        updatedSubmissions = [...originalSubmissions, newSubmission];
      } else {
        originalSubmissions.forEach((submission) => {
          if (submission.userId === uid)
          {
            updatedSubmissions.push(newSubmission);
          } else {
            updatedSubmissions.push(submission);
          }
        });
      }

      await updateDoc(groupContestDocRef, {
        submissions: updatedSubmissions
      });

      return updatedSubmissions;
    } else {
      return null;
    }

  } catch (error) {
    console.log("Error getting document in UpdateGroupContestWithSubmission: ", error.message);
  }
}

export const UpdateGroupContestWithVote = async (groupContestId, submissionId, numVotes, userId) => {
  const votes = [];

  for (let i = 0; i < numVotes; i++)
  {
    votes.push(submissionId);
  }

  try {
    const groupContestDocRef = doc(db, "group_contests", groupContestId);
    const groupContestDoc = await getDoc(groupContestDocRef);

    if (groupContestDoc.exists()) {
      const groupContestData = groupContestDoc.data();
      const updatedVotes = [...groupContestData.votes, ...votes];

      await updateDoc(groupContestDocRef, {
        votes: updatedVotes
      });

      if (!groupContestData.hasVoted.includes(userId)) {
        await updateDoc(groupContestDocRef, {
          hasVoted: [...groupContestData.hasVoted, userId]
        });
        return { votes: updatedVotes, hasVoted: [...groupContestData.hasVoted, userId] };
      }
      return { votes: updatedVotes, hasVoted: groupContestData.hasVoted };
    } else {
      return null;
    }

  } catch (error) {
    console.log("Error getting document in UpdateGroupContestWithVote: ", error.message);
  }
}

export { db, auth, app, storage };