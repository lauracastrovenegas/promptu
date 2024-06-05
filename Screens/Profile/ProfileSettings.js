import React from 'react';
import Button from '../../Components/Button';
import { useAppContext } from '../../AppContext';
import { StyleSheet, View } from 'react-native';
import theme from '../../theme';

export default function ProfileSettings() {
    const { handleLogout } = useAppContext();

    return (
        <View style={styles.screen}>
            <Button
                title={"Logout"}
                onPress={handleLogout}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flexDirection: 'column',
        padding: 20,
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    topSection: {
        flex: 1,
    }
});