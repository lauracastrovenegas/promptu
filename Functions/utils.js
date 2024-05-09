export const hasUserSubmittedToGroup = (group, user) => {
  const memberSubmission = group.submissions.find(submission => submission.userId === user.id);
  return memberSubmission ? true : false;
}

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