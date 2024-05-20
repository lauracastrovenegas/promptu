import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';

import { user, groups, groupContests } from "./data/fakeData";
import { getUserData } from './config/firebase';
import { signOut } from 'firebase/auth'; // Import signOut from Firebase auth
import { auth } from './config/firebase';
const AppContext = createContext();

const initialState = {
  userData: null,
  groupsData: [],
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
    case 'UPDATE_GROUPS_DATA':
      return {
        ...state,
        groupsData: state.groupsData.map(group =>
          group.id === action.payload.id ? { ...group, ...action.payload.data } : group
        ),
      };
    case 'SET_GROUPS_CONTEST_DATA':
      return {
        ...state,
        groupsContestData: action.payload,
      };
    case 'ADD_GROUPS_CONTEST_DATA':
      return {
        ...state,
        groupsContestData: [
          ...state.groupsContestData,
          action.payload,
        ],
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children, currentUser }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async (uid) => {
    try {
      const userData = await getUserData(uid);
      return userData;
    } catch (err) {
      console.log("Error fetching user data: ", err.message);
      return null;
    }
  };
  function fetchGroupData() {
    // use the fake data for now
    return groups;
  }

  function fetchGroupContestData() {
    // use the fake data for now
    return groupContests;
  }

  const handleLogout = async () => { // Mark handleLogout as async
    try {
      // Call signOut asynchronously
      await signOut(auth); // Assuming auth is imported from Firebase config
      // Clear user data from state
      dispatch({ type: 'SET_USER_DATA', payload: null });
    } catch (error) {
      console.log("Error while logging out: ", error.message);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      if (currentUser) {
        const userData = await fetchUserData(currentUser.uid);
        const groupData = fetchGroupData();
        const groupContestData = fetchGroupContestData();

        dispatch({ type: 'SET_USER_DATA', payload: userData });
        dispatch({ type: 'SET_GROUPS_DATA', payload: groupData });
        dispatch({ type: 'SET_GROUPS_CONTEST_DATA', payload: groupContestData });
        setIsLoading(false);
      } else {
        // No user logged in, clear user data from state
        dispatch({ type: 'SET_USER_DATA', payload: null });
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser]); // when currentUser changes aka when new user logged in

  return (
    <AppContext.Provider value={{ state, dispatch, isLoading, handleLogout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);