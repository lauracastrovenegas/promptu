import React from "react";
import { ScrollView, Text, StyleSheet, View, Image } from "react-native";
import theme from "../../theme";
import { useAppContext } from "../../AppContext";
import GroupPhotoName from "../../Components/GroupPhotoName";

/* This component is the Profile Screen */
const MainProfileScreen = () => {
  const { state, isLoading } = useAppContext();

  const user = state.userData;

  return (
    <ScrollView style={{ backgroundColor: theme.colors.white }}>
      {isLoading ? <Text>Loading...</Text> :
        <View style={styles.screen}>
          <View style={styles.topSection}>
            <Image source={user.photo} style={styles.profilePic} />
            <Text style={styles.userName}>{user.name}</Text>
          </View>
          <View style={{ display: 'flex' }}>
            <Text style={styles.sectionTitle}>Your Groups</Text>
            <View style={styles.groups}>
              {state.groupsData.map(group => (
                <GroupPhotoName key={group.id} group={group} />
              ))}
            </View>
          </View>
        </View>}
    </ScrollView>
  )
};

export default MainProfileScreen;

const styles = StyleSheet.create({
  screen: {
    padding: 20,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 20,
  },
  topSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  groups: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
  },
});