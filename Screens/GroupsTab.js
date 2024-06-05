import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainGroupsScreen from './Groups/MainGroupsScreen';
import GroupScreen from './Groups/GroupScreen';
import CreateGroupScreen from './Groups/CreateGroupScreen';
import ShareGroupScreen from './Groups/ShareGroupScreen';
import JoinGroupScreen from './Groups/JoinGroupScreen';
import { FontAwesome6 } from "@expo/vector-icons";
import theme from "../theme";
import GroupHeaderButton from '../Components/GroupHeaderButton';
import WinnerAnnouncementScreen from './Groups/VotingFlow/WinnerAnnouncementScreen.js';
import ChoosePromptScreen from './Groups/VotingFlow/ChoosePromptScreen';
import FirstVotingScreen from './Groups/VotingFlow/FirstVotingScreen';
import SecondVotingScreen from './Groups/VotingFlow/SecondVotingScreen';
import WaitingScreen from './Groups/VotingFlow/WaitingScreen';
import GroupSettings from './Groups/GroupSettings';

const Stack = createNativeStackNavigator();

/* This component defines the possible screens that can be accessed from the Groups Tab */
const GroupsTab = ({ route, navigation }) => {
  return (
    <Stack.Navigator initialRouteName="Groups Screen">
      {/* Groups Page is the default screen that will be shown when the user clicks on the Groups Tab. It displays a list of all groups the user is a part of. */}
      <Stack.Screen
        name="Groups Screen"
        component={MainGroupsScreen}
        options={({ navigation }) => ({
          // hide center header text but keep the header itself
          headerTitle: () => (
            <Text></Text>
          ),
          headerLeft: () => (
            <Text style={styles.title}>Promptu</Text>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Create Group Page')}
            >
              <FontAwesome6
                name="plus"
                size={20}
                color={theme.colors.black}
              />
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
        })} />
      {/* Group Page is the screen that will be shown when the user clicks on a specific group in the Groups screen. */}
      <Stack.Screen
        name="Group Screen"
        component={GroupScreen}
        options={({ route, navigation }) => ({
          headerTitle: () => (
            <GroupHeaderButton
              group={route.params.group}
              onPress={() => navigation.navigate('Share Group Page', { group: route.params.group, backTo: 'Group Screen'})}
            />
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <FontAwesome6
                name="chevron-left"
                size={20}
                color={theme.colors.black}
                style={styles.icon} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Group Settings", { group: route.params.group })}
            >
              <FontAwesome6
                name="gear"
                size={20}
                color={theme.colors.black}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Group Settings"
        component={GroupSettings}
        options={() => ({
          headerTitle: () => (
            <Text style={styles.title}>Settings</Text>
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <FontAwesome6
                name="chevron-left"
                size={20}
                color={theme.colors.black}
                style={styles.icon} />
            </TouchableOpacity>
          ),
        })}
      />
      {/* Share Groups Page is the screen that allows users to share new groups and approve members. */}
      <Stack.Screen
        name="Share Group Page"
        component={ShareGroupScreen}
        options={({ route, navigation }) => ({
          headerTitle: () => (
            <Text style={styles.title}>Share Group</Text>
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate(route.params.backTo, { group: route.params.group })}
            >
              <FontAwesome6
                name="chevron-left"
                size={20}
                color={theme.colors.black}
                style={styles.icon} />
            </TouchableOpacity>
          ),
        })} />
      {/* Create Groups Page is the screen that allows users to create new groups. It lets users imput a group photo icon and a group name. */}
      <Stack.Screen
        name="Create Group Page"
        component={CreateGroupScreen}
        options={({ navigation }) => ({
          headerTitle: () => (
            <Text style={styles.title}>Create New Group</Text>
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <FontAwesome6
                name="chevron-left"
                size={20}
                color={theme.colors.black}
                style={styles.icon} />
            </TouchableOpacity>
          ),
        })} />
      <Stack.Screen
        name="First Voting Screen"
        component={FirstVotingScreen}
        options={({ route, navigation }) => ({
          headerTitle: () => (
            <GroupHeaderButton group={route.params.group} />
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <FontAwesome6
                name="chevron-left"
                size={20}
                color={theme.colors.black}
                style={styles.icon} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Second Voting Screen"
        component={SecondVotingScreen}
        options={({ route, navigation }) => ({
          headerTitle: () => (
            <GroupHeaderButton group={route.params.group} />
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <FontAwesome6
                name="chevron-left"
                size={20}
                color={theme.colors.black}
                style={styles.icon} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Waiting Screen"
        component={WaitingScreen}
        options={({ route, navigation }) => ({
          headerTitle: () => (
            <GroupHeaderButton group={route.params.group} />
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <FontAwesome6
                name="chevron-left"
                size={20}
                color={theme.colors.black}
                style={styles.icon} />
            </TouchableOpacity>
          ),
        })}
      />
      {/* Join Groups Page is the screen that allows users to join groups. */}
      <Stack.Screen
        name="Join Group Page"
        component={JoinGroupScreen}
        options={({ navigation }) => ({
          headerTitle: () => (
            <Text style={styles.title}>Join Group</Text>
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Groups Screen")}
            >
              <FontAwesome6
                name="chevron-left"
                size={20}
                color={theme.colors.black}
                style={styles.icon} />
            </TouchableOpacity>
          ),
        })} />
      <Stack.Screen
        name="Winner Announcement Screen"
        component={WinnerAnnouncementScreen}
        options={({ route, navigation }) => ({
          headerTitle: () => (
            <GroupHeaderButton group={route.params.group} />
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <FontAwesome6
                name="chevron-left"
                size={20}
                color={theme.colors.black}
                style={styles.icon} />
            </TouchableOpacity>
          ),
        })} />
      <Stack.Screen
        name="Choose Prompt Screen"
        component={ChoosePromptScreen}
        options={({ route, navigation }) => ({
          headerTitle: () => (
            <GroupHeaderButton group={route.params.group} />
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <FontAwesome6
                name="chevron-left"
                size={20}
                color={theme.colors.black}
                style={styles.icon} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  )
}

export default GroupsTab;

// example of styling
const styles = StyleSheet.create({
  icon: {
    marginRight: 10,
  },
  title: {
    fontFamily: "PatrickHandSC_400Regular",
    textTransform: 'uppercase',
    fontSize: 24,
  },
});

