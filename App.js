import React from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./Screens/Welcome/Welcome";
import SignupScreen from "./Screens/Welcome/Signup";
import LoginScreen from "./Screens/Welcome/Login";
import GroupsTab from "./Screens/GroupsTab";
import CameraTab from "./Screens/CameraTab";
import ProfileTab from "./Screens/ProfileTab";
import theme from "./theme";
import * as SplashScreen from "expo-splash-screen";
import InitialLoadingScreen from "./Screens/Welcome/InitialLoadingScreen";
import { useFonts, Inter_400Regular, Inter_700Bold, Inter_900Black, PatrickHandSC_400Regular, Poppins_500Medium, Poppins_400Regular } from '@expo-google-fonts/dev';
import useSplashScreen from "./Functions/Hooks";
import { AppProvider } from "./AppContext";
// needed for now because Expo SDK 51 is having issues with tab switching (app crashes)
import 'react-native-reanimated';
import useAuth from "./hooks/useAuth";
import * as Linking from 'expo-linking';
import { View } from "react-native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const linking = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Tab: {
        screens: {
          Profile: 'profile',
          Groups: {
            screens: {
              'Groups Screen': 'groups',
              // 'Group Screen': 'groups/:groupId', // assuming groupId is a parameter
              'Create Group Page': 'groups/create',
              'Share Group Page': 'groups/share',
              'Join Group Page': 'group-invite/:groupId',
            },
          },
          Camera: 'camera',
        },
      },
    },
  },
};
/* Automatically shows splash screen on start
It is hidden in useSplashScreen hook when everything
is loaded in */
SplashScreen.preventAutoHideAsync();

const tabIcons = {
  Profile: {
    inactive: <FontAwesome6
      name="circle-user"
      size={24}
      color={theme.colors.gray}
      solid
    />,
    active: <FontAwesome6
      name="circle-user"
      size={24}
      color={theme.colors.black}
      solid
    />
  },
  Groups: {
    inactive: <FontAwesome6
      name="users"
      size={24}
      color={theme.colors.gray}
    />,
    active: <FontAwesome6
      name="users"
      size={24}
      color={theme.colors.black}
    />
  },
  Camera: {
    inactive: <FontAwesome6
      name="camera"
      size={24}
      color={theme.colors.gray}
    />,
    active: <FontAwesome6
      name="camera"
      size={24}
      color={theme.colors.black}
    />
  },
};

function App() {
  const { user, authReady } = useAuth();

  let [fontsLoaded] = useFonts({
    Inter_400Regular, Inter_700Bold, Inter_900Black,
    PatrickHandSC_400Regular
  });

  /* This can be expanded to more than just fonts in the future,
     could also check for api results, and other stuff. Just stick
     the bool in the array */
  const isReady = useSplashScreen([fontsLoaded, authReady, user !== null]);

  if (!isReady) {
    return <InitialLoadingScreen />;
  }

  if (user) {
    return (
      <AppProvider currentUser={user}>
        <NavigationContainer linking={linking}>
          <Tab.Navigator
            initialRouteName="Groups"
            screenOptions={({ route }) => ({
              lazy: false, // needed to navigate to camera from groups
              headerShown: false, // hide the header of each tab
              tabBarIcon: ({ focused }) => {
                // set the icons for each tab
                return (
                  focused ? tabIcons[route.name].active : tabIcons[route.name].inactive
                );
              },
              tabBarActiveTintColor: theme.colors.black,
              tabBarStyle: {
                paddingTop: 10,
                height: 85,
              },
            })}
          >
            {/* Bottom Navigation Bar Tabs */}
            <Tab.Screen name="Profile" component={ProfileTab} />
            <Tab.Screen name="Groups" component={GroupsTab} />
            <Tab.Screen name="Camera" component={CameraTab} />
          </Tab.Navigator>
        </NavigationContainer>
      </AppProvider>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false, animation: 'none'  }}
          initialRouteName="Welcome"
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen
            name="Signup"
            // Pass setOnSubmit as a prop to Signup component
            children={({ navigation }) => (
              <SignupScreen
                navigation={navigation}
              />
            )}
          />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};

export default App;
