import { groupComments } from '../data/fakeData';
import { db } from "../config/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";

export const hasUserSubmittedToGroup = (group, user, groupsContests) => {
  const contestInfo = getTodaysGroupContest(group, groupsContests);
  const memberSubmission = contestInfo.submissions.find(submission => submission.userId === user.id);
  return memberSubmission ? true : false;
}

// used for the countdown timer in the group card
export const timeUntilEndOfDay = (deadline) => {

  const now = new Date();
  const deadlineDate = new Date();

  // Get the current hour and minute
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

export const getGroupComments = async (group) => {
  const q = query(collection(db, "group_comments"), where("groupId", "==", group));
  const querySnapshot = await getDocs(q);
  const comments = [];

  querySnapshot.forEach((doc) => {
    comments.push({ ...doc.data(), id: doc.id });
  });
  return comments;
}

export const getTodaysGroupContest = (group, groupContests) => {
  // get today's date
  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  // To do: use this when we have real data
  const dateStamp = year + "-" + month + "-" + day;

  return groupContests.find(contest => contest.groupId === group.groupId && contest.date === dateStamp);
}