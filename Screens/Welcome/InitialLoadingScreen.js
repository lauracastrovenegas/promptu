import React from "react";
import { StyleSheet, View, Image } from "react-native";
import theme from "../../theme";
import logo from "../../assets/promptu_logo_app.png"

const InitialLoadingScreen = () => {
  return (
    <View style={styles.screen}>
      <View style={styles.topSection}>
        <Image source={logo} style={styles.logo} resizeMode="cover" />
      </View>
    </View>
  )
}

export default InitialLoadingScreen

const styles = StyleSheet.create({
  screen: {
    flexDirection: 'column',
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: theme.colors.lightPurple,
    height: '100%',
  },
  logo: {
    width: '100%',
    height: '80%',
  },
  topSection: {
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
    flex: 1,
    paddingTop: '15%',
  },
});