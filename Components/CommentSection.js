import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { getCommentTimestamp } from '../Functions/utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import theme from '../theme';
import useComments from '../hooks/useComments';

const CommentSection = ({ group }) => {
const { comments, loading } = useComments(group.id);

  return (
    <KeyboardAwareScrollView
      style={{ transform: [{ scaleY: -1 }], backgroundColor: theme.colors.white, flex: 1 }}
      keyboardDismissMode="on-drag"
      horizontal={false}>
      <View style={styles.commentsContainer}>
        {loading ? <ActivityIndicator size="small" color={theme.colors.white} />
          : comments.map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))}
      </View>
    </KeyboardAwareScrollView>
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

const styles = StyleSheet.create({
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
});