import React, { useState } from 'react';
import Button from '../../Components/Button';
import { useAppContext } from '../../AppContext';
import { StyleSheet, View, Alert, ActivityIndicator } from 'react-native';
import theme from '../../theme';
import { createConfirmationAlert, getAllContestsForGroup, getGroupComments } from '../../Functions/utils';
import { db } from '../../config/firebase';
import { getDoc, deleteDoc, doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { get, set } from 'firebase/database';

export default function GroupSettings({ route, navigation }) {
	const { state } = useAppContext();
	const [isLoading, setIsLoading] = useState(false);

	const group = route.params.group;
	const user = state.userData;

	async function handleLeaveGroup() {
		const shouldLeaveGroup = await createConfirmationAlert(`Leave ${group.groupName}?`, 'Are you sure you want to leave this group?', 'Yes, leave it');

		if (shouldLeaveGroup) {
			console.log("Leaving Group...");
			setIsLoading(true);

			// remove user from group members
			let updatedMembers = [];
			let groupDocRef = null;
			try {
				groupDocRef = doc(db, "groups", group.id);
				const groupDoc = await getDoc(groupDocRef);
				const groupData = groupDoc.data();
				updatedMembers = groupData.members.filter(member => member !== user.uid);
				
				await updateDoc(groupDocRef, {
					members: updatedMembers,
				});

				if (updatedMembers.length === 0) {
					// delete group if no members left
					await deleteGroup();
					setIsLoading(false);
					Alert.alert("Group Deleted", "The group has been successfully deleted since you were the last member in the group.");
					navigation.navigate("Groups Screen", { shouldRefresh: true });
					return;
				}
			} catch (error) {
				console.error("Error removing user from group members: ", error);
				Alert.alert("Error Leaving Group", "An error occurred while leaving the group. Please try again later.");
				setIsLoading(false);
				return;
			}

			// remove user's submissions from group contests
			try {
				const contests = await getAllContestsForGroup(group.id);
				contests.forEach(async contest => {
					const updatedSubmissions = contest.submissions.filter(submission => submission.userId !== user.uid);
					if (updatedSubmissions.length === contest.submissions.length) return; // user did not have any submissions in this contest
					await updateDoc(doc(db, "contests", contest.id), {
						submissions: updatedSubmissions,
					});
				});
			} catch (error) {
				console.error("Error removing user's submissions from group contests: ", error);
				Alert.alert("Error Leaving Group", "An error occurred while leaving the group. Please try again later.");
				setIsLoading(false);
				return;
			}

			// remove user's comments from group comments
			try {
				const comments = await getGroupComments(group.id);
				comments.forEach(async comment => {
					if (comment.userId === user.uid) {
						await deleteDoc(doc(db, "comments", comment.id));
					}
				});
			} catch (error) {
				console.error("Error removing user's comments from group comments: ", error);
				Alert.alert("Error Leaving Group", "An error occurred while leaving the group. Please try again later.");
				setIsLoading(false);
				return;
			}

			// randomly set the new owner if the owner is leaving
			if (group.ownerId === user.uid) {
				const newOwner = updatedMembers[Math.floor(Math.random() * updatedMembers.length)];
				try {
					await updateDoc(groupDocRef, {
						ownerId: newOwner ?? "",
					});
				} catch (error) {
					console.error("Error setting new owner: ", error);
				}
			}

			setIsLoading(false);
			Alert.alert("Group Left", "You have successfully left the group.");
			navigation.navigate("Groups Screen", { shouldRefresh: true });
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
			await deleteGroup();
			
			setIsLoading(false);
			Alert.alert("Group Deleted", "The group has been successfully deleted.");
			navigation.navigate("Groups Screen", { shouldRefresh: true });
		} else {
			console.log("Cancel Delete Group");
		}
	}

	async function deleteGroup() {
		try {
			// delete group
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
			navigation.navigate("Groups Screen");
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
			navigation.navigate("Groups Screen");
		}
	}

	if (isLoading) {
    return <View style={styles.screen}><ActivityIndicator size="large" /></View>;
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
