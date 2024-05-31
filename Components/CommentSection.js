import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { getGroupComments, getCommentTimestamp } from '../Functions/utils';
import theme from '../theme';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAppContext } from '../AppContext';
import { db } from "../config/firebase";
import { getDoc, addDoc, collection } from "firebase/firestore";

const CommentSection = ({ group }) => {
  const { state } = useAppContext();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchAndSetComments = async () => {
      const comments = await getGroupComments(group.id);
      setComments(comments);
    };

    fetchAndSetComments();
  }, []);

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
        setComments([...comments, { ...newComment, id: commentDoc.id }]);
      } else {
        console.log("No comment document exists.");
      }
    } catch (error) {
      Alert.alert("Error Adding Comment", error.message);
    }

  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ transform: [{ scaleY: -1 }] }}
        horizontal={false}>
        <View style={styles.commentsContainer}>
          {comments.map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </View>
      </ScrollView>
      <CommentTextInput
        groupName={group.groupName}
        onSend={onSend} />
    </View>
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

const CommentTextInput = ({ groupName, onSend }) => {
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
      <TouchableOpacity style={styles.sendButton} onPress={onSendComment}>
        <FontAwesome6
          name="arrow-up"
          size={20}
          color={theme.colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  commentsContainer: {
    padding: 20,
    display: 'flex',
    gap: 15,
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