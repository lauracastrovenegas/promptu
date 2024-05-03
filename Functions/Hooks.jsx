import { useState, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

/**
 *
 * @param {[boolean]} thingsToCheck
 * @returns boolean
 */
export default function useSplashScreen(thingsToCheck) {
  const [isReady, setIsReady] = useState(false);
  const containsFalse = thingsToCheck.includes(false);
  if (!containsFalse && !isReady) setIsReady(true);

  /* If all things in thingsToCheck is true,
    then hide the splash screen */
  useEffect(() => {
    const hideSplashScreen = async () => await SplashScreen.hideAsync();

    if (isReady) hideSplashScreen();
  }, [isReady]);

  return isReady;
}
