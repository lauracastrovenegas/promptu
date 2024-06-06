// useComments.js
import { useEffect, useState } from 'react';
import { getDocs, collection, query, where, onSnapshot, orderBy, doc } from "firebase/firestore";
import { db } from '../config/firebase';
import { getTodaysDateStamp } from '../Functions/utils';

// This hook is used to get the group contest for a group with real time updates
export default function useGroupContest(groupContestId) {
  const [groupContest, setGroupContest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "group_contests", groupContestId), (doc) => {
      const contest = { ...doc.data(), id: doc.id };
      setGroupContest(contest);
      setLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [groupContestId]);

  return { groupContest, loading };
};
