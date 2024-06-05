import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { user, groups, groupContests } from "./data/fakeData";
import { getUserData, getGroupData, getGroupContestData, UpdateGroupContestWithSubmission, UpdateGroupContestWithVote } from './config/firebase';
import { signOut } from 'firebase/auth'; // Import signOut from Firebase auth
import { auth, storage } from './config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
const AppContext = createContext();


const initialState = {
  userData: null,
  groupsData: [],
  groupsContestData: [],
};


// Define what actions can be taken on the state
const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER_DATA':
      return {
        ...state,
        userData: action.payload,
      };
    case 'SET_GROUPS_DATA':
      return {
        ...state,
        groupsData: action.payload,
      };
    case 'UPDATE_USER_DATA':
      return {
        ...state,
        userData: {
          ...state.userData,
          ...action.payload,
        },
      };
    case 'ADD_GROUPS_DATA':
      return {
        ...state,
        groupsData: [
          ...state.groupsData,
          action.payload,
        ],
      };
    case 'UPDATE_GROUP_CONTEST_SUBMISSION_DATA':
      return {
        ...state,
        groupsContestData: state.groupsContestData.map(group =>
          group.id === action.payload.id ? { ...group, submissions: action.payload.submissions } : group
        ),
      };
    case 'SET_GROUPS_CONTEST_DATA':
      return {
        ...state,
        groupsContestData: action.payload,
      };
      case 'UPDATE_GROUP_CONTEST_DATA':
        return {
          ...state,
          groupsContestData: state.groupsContestData.map(group =>
            group.id === action.payload.id ? action.payload.data : group
          ),
        };
    case 'ADD_GROUPS_CONTEST_DATA':
      return {
        ...state,
        groupsContestData: [
          ...state.groupsContestData,
          action.payload,
        ],
      };
    case 'UPDATE_GROUPS_CONTEST_VOTES':
      return {
        ...state,
        groupsContestData: state.groupsContestData.map(groupContest =>
          groupContest.id === action.payload.groupContestId ? { ...groupContest, votes: action.payload.data } : groupContest
        ),
      };
      case 'UPDATE_GROUPS_CONTEST_HAS_VOTED':
        return {
          ...state,
          groupsContestData: state.groupsContestData.map(groupContest =>
            groupContest.id === action.payload.groupContestId ? { ...groupContest, hasVoted: action.payload.data } : groupContest
          ),
        };
    default:
      return state;
  }
};


export const AppProvider = ({ children, currentUser }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
  
      if (currentUser) {
        const userData = await fetchUserData(currentUser.uid);
        const groupData = await fetchGroupData(currentUser.uid);
        const groupIds = groupData.map((group) => group.id);
        const groupContestData = await fetchGroupContestData(groupIds);
  
        console.log("Dispatching user data, group data, and group contest data"); // Add this line to debug
        dispatch({ type: 'SET_USER_DATA', payload: userData });
        dispatch({ type: 'SET_GROUPS_DATA', payload: groupData });
        dispatch({ type: 'SET_GROUPS_CONTEST_DATA', payload: groupContestData });
  
        setIsLoading(false);
      } else {
        dispatch({ type: 'SET_USER_DATA', payload: null });
        dispatch({ type: 'SET_GROUPS_DATA', payload: [] });
        dispatch({ type: 'SET_GROUPS_CONTEST_DATA', payload: [] });
      }
    };
  
    fetchData();
  }, [currentUser]);
  

  const fetchUserData = async (uid) => {
    try {
      if (true) {
        const userData = await getUserData(uid);
        return userData;
      }
    } catch (err) {
      console.log("Error fetching user data: ", err.message);
      return null;
    }
  };

  const fetchGroupData = async (uid) => {
    try {
      const groupData = await getGroupData(uid);
      return groupData;
    } catch (err) {
      console.log("Error fetching group data: ", err.message);
      return null;
    }
  }

  const fetchGroupContestData = async (groupIds) => {
    try {
      const groupContestData = await getGroupContestData(groupIds);
      console.log("Fetched group contest data: ", groupContestData); // Add this line to debug
      return groupContestData;
    } catch (err) {
      console.log("Error fetching group contest data: ", err.message);
      return null;
    }
  };
  

  const addSubmissionToGroup = async (groupContestId, photo, caption, uid, hasSubmitted) => {
    const response = await fetch(photo);
    const blob = await response.blob();
    const storageRef = ref(storage, `submission_pictures/${groupContestId}_${uid}`);

    if (hasSubmitted) {
      await deleteObject(storageRef);
    }
    await uploadBytes(storageRef, blob);
    let photoURL = await getDownloadURL(storageRef);

    const currentContestInfo = await UpdateGroupContestWithSubmission(groupContestId, photoURL, caption, uid);
    dispatch({ type: 'UPDATE_GROUP_CONTEST_SUBMISSION_DATA', payload: {id: groupContestId, submissions: currentContestInfo} });
  }

  const addVoteToGroup = async (groupContestId, submissionId, numVotes, userId) => {
    const updatedVotesAndHasVoted = await UpdateGroupContestWithVote(groupContestId, submissionId, numVotes, userId);

    if (updatedVotesAndHasVoted != null) {
      dispatch({ type: 'UPDATE_GROUPS_CONTEST_VOTES', payload: { groupContestId: groupContestId, data: updatedVotesAndHasVoted.votes }});
      dispatch({ type: 'UPDATE_GROUPS_CONTEST_HAS_VOTED', payload: { groupContestId: groupContestId, data: updatedVotesAndHasVoted.hasVoted }});
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: 'SET_USER_DATA', payload: null });
      console.log("logout")
      // Clear flag in AsyncStorage
    } catch (error) {
      console.log("Error while logging out: ", error.message);
    }
  }

  return (
    <AppContext.Provider value={{ state, dispatch, isLoading, handleLogout, addSubmissionToGroup, fetchGroupData, fetchGroupContestData, addVoteToGroup }}>
      {children}
    </AppContext.Provider>
  );
};


export const useAppContext = () => useContext(AppContext);

