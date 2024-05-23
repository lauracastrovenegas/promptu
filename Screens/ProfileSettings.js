import React from 'react';
import Button from '../Components/Button';
import { useAppContext } from '../AppContext';


export default function ProfileSettings() {
    const { handleLogout } = useAppContext();

    return (
        <Button
            title={"Logout"}
            onPress={handleLogout}
        />
    )
}