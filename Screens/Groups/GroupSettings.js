import React from 'react';
import Button from '../../Components/Button';
import { useAppContext } from '../../AppContext';
import { StyleSheet, View, Alert } from 'react-native';
import theme from '../../theme';

function createReplaceSubmissionConfirmationAlert(title, message, confirmOption) {
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

export default function GroupSettings({ route }) {
	const { state } = useAppContext();
	const group = route.params.group;
	const user = state.userData;

	console.log(group);

	async function handleLeaveGroup() {
		const shouldLeaveGroup = await createReplaceSubmissionConfirmationAlert(`Leave ${group.groupName}?`, 'Are you sure you want to leave this group?', 'Yes, leave it');

		if (shouldLeaveGroup) {
			console.log("Leave Group");
		} else {
			console.log("Cancel Leave Group");
		}
	}

	async function handleDeleteGroup() {
		const shouldDeleteGroup = await createReplaceSubmissionConfirmationAlert(`Delete ${group.groupName}?`, 'Are you sure you want to delete this group? All data will be lost.', 'Yes, delete it');

		if (shouldDeleteGroup) {
			console.log("Delete Group");
		} else {
			console.log("Cancel Delete Group");
		}
	}

	return (
		<View style={styles.screen}>
			<Button
				title={"Leave Group"}
				onPress={handleLeaveGroup}
			/>
			{group.ownerId === user.uid &&
				<Button
					style={{ backgroundColor: theme.colors.red }}
					title={"Delete Group"}
					onPress={handleDeleteGroup}
				/>}
		</View>
	)
}

const styles = StyleSheet.create({
	screen: {
		flexDirection: 'column',
		padding: 20,
		flex: 1,
		backgroundColor: theme.colors.white,
		gap: 20,
	},
	topSection: {
		flex: 1,
	}
});