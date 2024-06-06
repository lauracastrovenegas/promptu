import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { getGroupComments, getCommentTimestamp } from '../Functions/utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import theme from '../theme';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAppContext } from '../AppContext';
import { db } from "../config/firebase";
import { getDoc, addDoc, collection } from "firebase/firestore";
import { onSnapshot, query, where } from "firebase/firestore";
import useComments from '../hooks/useComments';

const CommentSection = ({ group }) => {
  const { state } = useAppContext();

  const { comments, loading } = useComments(group.id);

  async function onSend(comment) {
    if (comment.length === 0) return;

    const timestamp = new Date().getTime();

    try {
      const docRef = await addDoc(collection(db, "group_comments"), {  // generates ID for you
        groupId: group.id,
        user: state.userData,
        createdAt: timestamp,
        text: comment,
      });

      const commentDoc = await getDoc(docRef);

      if (commentDoc.exists()) {
        const newComment = commentDoc.data();
        // setComments([...comments, { ...newComment, id: commentDoc.id }]);
      } else {
        console.log("No comment document exists.");
      }
    } catch (error) {
      Alert.alert("Error Adding Comment", error.message);
    }

  }

  return (
    <KeyboardAvoidingView behavior="position" style={styles.keyboardAvoidingView} keyboardVerticalOffset={95}>
      <KeyboardAwareScrollView
        style={{ transform: [{ scaleY: -1 }], backgroundColor: theme.colors.white }}
        keyboardDismissMode="on-drag"
        horizontal={false}>
        <View style={styles.commentsContainer}>
          {loading ? <ActivityIndicator size="small" color={theme.colors.white} />
            : comments.map(comment => (
              <Comment key={comment.id} comment={comment} />
            ))}
        </View>
      </KeyboardAwareScrollView>
      <CommentTextInput
        groupName={group.groupName}
        onSend={onSend}
        isLoading={loading} />
    </KeyboardAvoidingView>
  );
};

export default CommentSection;

const Comment = ({ comment }) => {
  return (
    <View style={styles.commentContainer}>
      <Image source={comment.user.photoURL ? { uri: comment.user.photoURL } : require('../assets/default_profile_picture.png')} style={styles.profilePic} />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.userName}>{comment.user.displayName}</Text>
          <Text style={styles.timestamp}>{getCommentTimestamp(comment)}</Text>
        </View>
        <Text style={styles.commentText}>{comment.text}</Text>
      </View>
    </View>
  );
}

const CommentTextInput = ({ groupName, onSend, isLoading }) => {
  const [comment, setComment] = useState('');

  function onSendComment() {
    onSend(comment);
    setComment('');
  }

  return (
    <View style={styles.commentInputContainer}>
      <TextInput
        multiline
        placeholder={`Send a message to ${groupName}`}
        style={styles.commentTextBox}
        maxLength={200}
        onChangeText={setComment}
        value={comment} />
      <TouchableOpacity style={styles.sendButton} onPress={onSendComment} disabled={isLoading}>
        <FontAwesome6
          name="arrow-up"
          size={20}
          color={theme.colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightGray,
    flex: 1,
    paddingBottom: 75,
  },
  commentsContainer: {
    padding: 20,
    display: 'flex',
    gap: 15,
    orderTopWidth: 1,
    borderTopColor: theme.colors.lightGray,
    transform: [{ scaleY: -1 }]
  },
  commentContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  profilePic: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },
  userName: {
    fontWeight: 'bold',
    color: theme.colors.gray
  },
  timestamp: {
    color: theme.colors.gray,
  },
  content: {
    flexDirection: 'column',
    gap: 5,
    flexShrink: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  commentText: {
    fontSize: 16,
  },
  commentInputContainer: {
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderColor: theme.colors.lightGray,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  commentTextBox: {
    backgroundColor: theme.colors.mediumGray,
    borderColor: theme.colors.white,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 15,
    fontSize: 16,
    flex: 1,
  },
  sendButton: {
    backgroundColor: theme.colors.purple,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    paddingHorizontal: 15,
    height: 45,
    marginVertical: 'auto'
  },
});