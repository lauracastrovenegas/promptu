import React from 'react';
import Button from '../Components/Button';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function ProfileSettings() {
    const handleLogout = async ()=> {
        await signOut(auth);
    }
    return (
            <Button
            title={"Logout"}
            onPress={handleLogout}
            />
    )
}