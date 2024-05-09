import React from "react";
import { View, Text, StyleSheet } from "react-native";
import theme from "../../theme";
import MemberListBubbles from "../../Components/MemberListBubbles";
import CardContainer from "../../Components/CardContainer";
import Button from "../../Components/Button";
import { hasUserSubmittedToGroup, timeUntilEndOfDay } from "../../Functions/utils";
import { useAppContext } from "../../AppContext";
import Countdown from "../../Components/Countdown";
import CommentSection from "../../Components/CommentSection";

/* This component is the Individual Group Screen  */
const GroupScreen = ({ route, navigation }) => {
  const { state } = useAppContext();
  
  const group = route.params.group;

  return (
    <View style={styles.screen}>
      <CardContainer>
        <View style={styles.cardContents}>
          <Text style={styles.promptTitle}>Today's Prompt</Text>
          <Text style={styles.prompt}>{group.prompt}</Text>
          <Countdown style={styles.countdown} deadline={group.votingTime}/>
          <MemberListBubbles group={group} />
          <Button
            title={`${hasUserSubmittedToGroup(group, state.userData) ? "Resubmit" : "Submit"} Your Photo`}
            onPress={() => {
              navigation.navigate('Main Camera Screen', { group })
            }
            } />
        </View>
      </CardContainer>
      <CommentSection group={group} />
    </View>
  )
};

export default GroupScreen;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.white,
    height: '100%',
    padding: 20,
    gap: 20
  },
  cardContents: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  promptTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: -10,
    fontSize: 16,
  },
  prompt: {
    fontSize: 16,
    textAlign: 'center',
  },
  countdown: {
    fontSize: 60,
    textAlign: 'center',
    fontFamily: theme.fonts.patrickHand,
  },
});