import React, { useEffect, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import GroupsTab from "./Screens/GroupsTab";
import CameraTab from "./Screens/CameraTab";
import ProfileTab from "./Screens/ProfileTab";
import theme from "./theme";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Inter_400Regular, Inter_700Bold, Inter_900Black, PatrickHand_400Regular } from '@expo-google-fonts/dev';
import useSplashScreen from "./Functions/Hooks";
import { AppProvider } from "./AppContext";
// needed for now because Expo SDK 51 is having issues with tab switching (app crashes)
import 'react-native-reanimated';
import { useAppContext } from "./AppContext";

const Tab = createBottomTabNavigator();
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

const App = () => {
  let [fontsLoaded] = useFonts({
    Inter_400Regular, Inter_700Bold, Inter_900Black,
    PatrickHand_400Regular
  });

  /* This can be expanded to more than just fonts in the future,
     could also check for api results, and other stuff. Just stick
     the bool in the array */
  const isReady = useSplashScreen([fontsLoaded]);

  if (!isReady) {
    return null;
  }

  return (
    <AppProvider>
      <NavigationContainer>
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
};

export default App;

