import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';

import { user, groups, groupContests } from "./data/fakeData";

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

  function fetchUserData() {
    let userData = user;
    // use the fake data for now
    if (currentUser) {
      if (currentUser.displayName !== undefined)
        userData.displayName = currentUser.displayName;

    }

    return userData;
  }

  function fetchGroupData() {
    // use the fake data for now
    return groups;
  }

  function fetchGroupContestData() {
    // use the fake data for now
    return groupContests;
  }

  useEffect(() => {
    const userData = fetchUserData();
    const groupData = fetchGroupData();
    const groupContestData = fetchGroupContestData();

    dispatch({ type: 'SET_USER_DATA', payload: userData });
    dispatch({ type: 'SET_GROUPS_DATA', payload: groupData });
    dispatch({ type: 'SET_GROUPS_CONTEST_DATA', payload: groupContestData });
    setIsLoading(false);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, isLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);