import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import { getGroupComments, getCommentTimestamp } from '../Functions/utils';
import theme from '../theme';

const CommentSection = ({ group }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const comments = getGroupComments(group);
    setComments(comments);
  }, []);

  return (
    <ScrollView 
      style={{ transform: [{ scaleY: -1 }] }}
      horizontal={false}>
      <View style={styles.commentsContainer}>
        {comments.map(comment => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </View>
    </ScrollView>
  );
};

export default CommentSection;

const Comment = ({ comment }) => {
  return (
    <View style={styles.commentContainer}>
      <Image source={comment.user.photo} style={styles.profilePic} />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.userName}>{comment.user.name}</Text>
          <Text style={styles.timestamp}>{getCommentTimestamp(comment)}</Text>
        </View>
        <Text style={styles.commentText}>{comment.text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  commentsContainer: {
    paddingVertical: 10,
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
  }
});