import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export default function useAuth() {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setReady(true);
                } else {
                    setReady(false); // User data not in Firestore
                }
            } else {
                setReady(true);
            }
            setUser(user);
        });

        return unsub;
    }, []);

    return { user, ready };
}
