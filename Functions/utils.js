import { db } from "../config/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";
import { Alert } from 'react-native';

export const hasUserSubmittedToGroup = (group, user, groupsContests) => {
  const contestInfo = getTodaysGroupContest(group, groupsContests);
  const memberSubmission = contestInfo.submissions.find(submission => submission.userId === user.uid);
  return memberSubmission ? true : false;
}

// used for the countdown timer in the group card
export const timeUntilEndOfDay = (deadline) => {
  const offset = -420;  // offset for PDT

  const now = new Date();
  const deadlineDate = new Date();

  // Get the current hour and minute
  now.setTime(now.getTime() + (now.getTimezoneOffset() * 60000) + (60000 * offset));
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();


  // Check if it's past deadline today
  if (currentHour > deadline || (currentHour === deadline && currentMinute > 0)) {
    // If so, increment the date by one day
    deadlineDate.setDate(deadlineDate.getDate() + 1);
  }

  // Set the time to deadline
  deadlineDate.setHours(deadline);
  deadlineDate.setMinutes(0);
  deadlineDate.setSeconds(0);

  const timeDifference = deadlineDate.getTime() - now.getTime();

  // Convert milliseconds to hours, minutes, and seconds
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  // Format the time difference
  const formattedTimeDifference = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return formattedTimeDifference;
}

// Get timestamp for comment
export const getCommentTimestamp = (comment) => {
  const date = new Date(comment.createdAt); // Multiply by 1000 to convert from seconds to milliseconds
  const now = new Date();

  const timeDifference = now.getTime() - date.getTime();
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
}

export const getGroupComments = async (groupId) => {
  const q = query(collection(db, "group_comments"), where("groupId", "==", groupId));
  const querySnapshot = await getDocs(q);
  const comments = [];

  querySnapshot.forEach((doc) => {
    comments.push({ ...doc.data(), id: doc.id });
  });
  return comments;
}

export const getAllContestsForGroup = async (groupId) => {
  const q = query(collection(db, "group_contests"), where("groupId", "==", groupId));
  const querySnapshot = await getDocs(q);
  const contests = [];

  querySnapshot.forEach((doc) => {
    contests.push({ ...doc.data(), id: doc.id });
  });

  return contests;
}

export const getTodaysDateStamp = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  // To do: use this when we have real data
  const dateStamp = year + "-" + month + "-" + day;
  return dateStamp;
}

export const getTomorrowsDateStamp = () => {
  const today = new Date();

  // Add one day to the current date
  today.setDate(today.getDate() + 1);

  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  // To do: use this when we have real data
  const dateStamp = year + "-" + month + "-" + day;
  return dateStamp;
}

export const getTodaysGroupContest = (group, groupContests) => {
  // get today's date
  const dateStamp = getTodaysDateStamp();

  const defaultContest = {
    groupId: group.id,
    date: dateStamp,
    winner: [],
    hasVotingOccurred: false,
    prompt: "",
    submissions: [],
    votes: [],
    hasVoted: [],
  };

  if (groupContests === null) return defaultContest;

  try {
    const contest = groupContests.find(contest => contest.groupId === group.id && contest.date === dateStamp);

    if (!contest) {
      return defaultContest;
    }

    const prompts = contest.prompt;

    // console.log("Prompt: ", contest.prompt);
    if (contest.prompt instanceof Array) {
      contest.prompt = prompts[0];
    }

    return contest;
  } catch (error) {
    console.error("Error getting today's group contest: ", error);
    return defaultContest;
  }
}

export function createConfirmationAlert(title, message, confirmOption) {
  return new Promise((resolve) => {
    Alert.alert(title, message, [
      {
        text: confirmOption,
        onPress: () => { resolve(true) },
      },
      {
        text: 'Cancel',
        onPress: () => { resolve(false) },
        style: 'cancel',
      },
    ], { cancelable: false });
  });
};

export function getCurrentTimePDT() {
  const offset = -420;  // offset for PDT

  const d = new Date();
  const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  const nd = new Date(utc + (60000 * offset));
  const time_since_start_day = nd.getHours() * 60 + nd.getMinutes();

  return time_since_start_day;
};
