import React, { useState } from 'react';
import Button from '../../Components/Button';
import { useAppContext } from '../../AppContext';
import { StyleSheet, View, Alert } from 'react-native';
import theme from '../../theme';
import { createConfirmationAlert, getAllContestsForGroup, getGroupComments } from '../../Functions/utils';
import { db } from '../../config/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { get, set } from 'firebase/database';

export default function GroupSettings({ route, navigator }) {
	const { state } = useAppContext();
	const [isLoading, setIsLoading] = useState(true);

	const group = route.params.group;
	const user = state.userData;


	async function handleLeaveGroup() {
		const shouldLeaveGroup = await createConfirmationAlert(`Leave ${group.groupName}?`, 'Are you sure you want to leave this group?', 'Yes, leave it');

		if (shouldLeaveGroup) {
			console.log("Leave Group");
			// remove user from group members

			// remove user's submissions from group contests

			// remove user's comments from group comments

			// have user pick a new group owner if they are the current owner
		} else {
			console.log("Cancel Leave Group");
		}
	}

	async function handleDeleteGroup() {
		const shouldDeleteGroup = await createConfirmationAlert(`Delete ${group.groupName}?`, 'Are you sure you want to delete this group? All data will be lost.', 'Yes, delete it');

		if (shouldDeleteGroup) {
			setIsLoading(true);
			console.log("Deleting Group...");

			// delete group
			try {
				await deleteDoc(doc(db, "groups", group.id));
			} catch (error) {
				console.error("Error deleting group: ", error);
				setIsLoading(false);
				Alert.alert("Error Deleting Group", "An error occurred while deleting the group. Please try again later.");
			}
			
			try {
				// delete all group contests for this group
				const contests = await getAllContestsForGroup(group.id);
				contests.forEach(async contest => {
					await deleteDoc(doc(db, "contests", contest.id));
				});
			} catch (error) {
				console.error("Error deleting group contests: ", error);
				setIsLoading(false);
				navigator.navigate("Groups Screen");
			}

			try {
				// delete all group comments for this group
				const comments = await getGroupComments(group.id);
				comments.forEach(async comment => {
					await deleteDoc(doc(db, "comments", comment.id));
				});
			} catch (error) {
				console.error("Error deleting group comments: ", error);
				setIsLoading(false);
				navigator.navigate("Groups Screen");
			}

			setIsLoading(false);
			Alert.alert("Group Deleted", "The group has been successfully deleted.");
			navigator.navigate("Groups Screen");
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