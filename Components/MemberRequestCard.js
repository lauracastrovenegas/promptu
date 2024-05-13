import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import CardContainer from './CardContainer';
import UserPhotoName from './UserPhotoName';
import Button from "./Button";

const MemberRequestCard = ( user ) => {
  return (
    <CardContainer>
      <View style={styles.row}>
        <UserPhotoName user={user} />
        <View style={styles.options}>
            <Button
                title={`Approve`}
                onPress={() => {}} />
        </View>
        <View style={styles.options}>
            <Button
                style={styles.options}
                title={`Reject`}
                onPress={() => {}} />
        </View>
      </View>
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 30,
  },
  options: {
    flex: 3,
    justifyContent: 'center',
  },
});

export default MemberRequestCard;
