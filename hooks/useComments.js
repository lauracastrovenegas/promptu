// useComments.js
import { useEffect, useState } from 'react';
import { getDocs, collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from '../config/firebase';

export default function useComments(groupId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTodayTimestamp = Math.floor(startOfToday.getTime() / 1000);

    const q = query(collection(db, "group_comments"), where("groupId", "==", groupId), where("createdAt", ">=", startOfTodayTimestamp), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const comments = [];
      querySnapshot.forEach((doc) => {
        comments.push({ ...doc.data(), id: doc.id });
      });
      setComments(comments);
      setLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [groupId]);

  return { comments, loading };
};
