import React from 'react';
import { View, Text } from 'react-native';

const CommentSection = ({ group }) => {
  return (
    <View>
      <Text>Comment Section for {group.name} would go here:</Text>
    </View>
  );
};

export default CommentSection;