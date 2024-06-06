import React from "react";
import { ScrollView, Text, StyleSheet, View, Image, FlatList, ActivityIndicator } from "react-native";
import theme from "../../theme";
import { useAppContext } from "../../AppContext";
import GroupPhotoName from "../../Components/GroupPhotoName";

/* This component is the Profile Screen */
const MainProfileScreen = () => {
  const { state, isLoading } = useAppContext();

  const user = state.userData;

  if (isLoading || !user) {
    return <View style={styles.screen}><ActivityIndicator size="large"/></View>;
  }


  return (
    <View style={{ backgroundColor: theme.colors.white, flex: 1 }}>
        <View style={styles.screen}>
            <View>
              <View style={styles.topSection}>
                <Image source={user.photoURL ? { uri: user.photoURL } : require('../../assets/default_profile_picture.png')} style={styles.profilePic} />
                <Text style={styles.userName}>{user.displayName}</Text>
              </View>
              <View>
                <Text style={styles.sectionTitle}>Your Groups</Text>
                <FlatList
                  data={state.groupsData}
                  keyExtractor={item => item.id}
                  numColumns={3}
                  renderItem={({ item }) => (
                    <View style={{ marginBottom: 20 }}>
                      <GroupPhotoName group={item} />
                    </View>
                  )}
                  style={styles.groups}
                />
              </View>
            </View>
        </View>
    </View>
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
    marginBottom: 20,
    fontWeight: 'bold',
  },
  groups: {
    height: '100%',
  },
  noGroups: {
    fontSize: 16,
    color: theme.colors.gray,
  },
});
