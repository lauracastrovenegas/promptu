import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, ScrollView, Keyboard, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import theme from "../../theme";
import MemberListBubbles from "../../Components/MemberListBubbles";
import CardContainer from "../../Components/CardContainer";
import Button from "../../Components/Button";
import { getCurrentTimePDT, getTodaysGroupContest } from "../../Functions/utils";
import { useAppContext } from "../../AppContext";
import Countdown from "../../Components/Countdown";
import CommentSection from "../../Components/CommentSection";
import PolaroidPhoto from "../../Components/PolaroidPhoto";
import GroupLink from "../../Components/GroupLink";
import { addDoc, collection, getDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { FontAwesome6 } from '@expo/vector-icons';
import useGroupContest from "../../hooks/useGroupContest";

/* This component is the Individual Group Screen  */
const GroupScreen = ({ route, navigation }) => {
  const { state } = useAppContext();
  const group = route.params.group;
  const contestInfo = getTodaysGroupContest(group, state.groupsContestData);
  const { groupContest, loading } = useGroupContest(contestInfo.id);
  const [voteTime, setVoteTime] = useState(false);

  useEffect(() => {
    // This is a hacky way to force a re-render when it's voting time by updating the database
    const intervalId = setInterval(async () => {
      const time = getCurrentTimePDT();

      if (time >= 18 * 60 && !voteTime) {
        setVoteTime(true);
        const groupContestDoc = await getDoc(doc(db, 'group_contests', groupContest.id));
        if (groupContestDoc.exists()) {
          await updateDoc(doc(db, "group_contests", groupContest.id), {
            votingTimeReached: true,
          });
        }
      }
    }, 1000); // Check every second

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {}, [voteTime]); // This forces the component to re-render when voteTime changes

  if (loading) {
    return <View style={styles.screen}><ActivityIndicator size="large" style={{ marginTop: 20 }} /></View>;
  }

  if (group.members.length < 3) {
    return (
      <View style={styles.screen}>
        <View style={styles.addMoreMembersMessage}>
          <Text style={styles.largePromptTitle}>You need at least 3 members to complete your group! Share the joining code with more friends to begin!</Text>
          <GroupLink link={group.inviteCode} />
        </View>
      </View>
    );
  }

  const hasUserSubmitted = groupContest.submissions.map(submission => submission.userId).includes(state.userData.uid);

  function getBox() {
    const time = getCurrentTimePDT();

    if (time >= 18 * 60) {  // 6PM
      // voting has occured
      if (groupContest.hasVotingOccurred) {
        return <ResultsBox group={group} contestInfo={groupContest} />;
      }

      // not enough users submitted
      if (groupContest.submissions.length < 3) {
        return <VotingBox group={group} contestInfo={groupContest} hasUserSubmitted={hasUserSubmitted} onSubmit={() => navigation.navigate('Choose Prompt Screen', { group })} />;
      }

      // voting screen
      const navTo = groupContest.submissions.length == 3 ? 'Second Voting Screen' : 'First Voting Screen';
      return <VotingBox group={group} contestInfo={groupContest} hasUserSubmitted={hasUserSubmitted} onSubmit={() => navigation.navigate(navTo, { group })} />;
    }

    return <DailyPromptInfoBox group={group} contestInfo={groupContest} hasUserSubmitted={hasUserSubmitted} onSubmit={() => navigation.navigate('Main Camera Screen', { group })} />;
  }

  async function onSendComment(comment) {
    if (comment.length === 0) return;

    const timestamp = new Date().getTime();

    try {
      const docRef = await addDoc(collection(db, "group_comments"), {  // generates ID for you
        groupId: group.id,
        user: state.userData,
        createdAt: timestamp,
        text: comment,
      });

      const commentDoc = await getDoc(docRef);

      if (commentDoc.exists()) {
        const newComment = commentDoc.data();
        // setComments([...comments, { ...newComment, id: commentDoc.id }]);
      } else {
        console.log("No comment document exists.");
      }
    } catch (error) {
      Alert.alert("Error Adding Comment", error.message);
    }

    Keyboard.dismiss();
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior="padding" keyboardVerticalOffset={95}>
      <View style={styles.topSection}>
        <View style={{ padding: 20 }}>
          {getBox()}
        </View>
        <CommentSection group={group} />
      </View>
      <View style={styles.bottomSection}>
        <CommentTextInput
          groupName={group.groupName}
          onSend={onSendComment} />
      </View >
    </KeyboardAvoidingView >
  )
};

export default GroupScreen;

const DailyPromptInfoBox = ({ group, contestInfo, hasUserSubmitted, onSubmit }) => {
  const { state } = useAppContext();
  return (
    <CardContainer>
      <View style={styles.cardContents}>
        <Text style={styles.promptTitle}>Today's Prompt</Text>
        <Text style={styles.prompt}>{contestInfo ? contestInfo.prompt : ""}</Text>
        <Countdown style={styles.countdown} deadline={18} />
        <MemberListBubbles group={group} groupContests={state.groupsContestData} />
        <Button
          title={`${hasUserSubmitted ? "Resubmit" : "Submit"} Your Photo`}
          onPress={onSubmit}
        />
      </View>
    </CardContainer>
  );
}

const VotingBox = ({ group, contestInfo, hasUserSubmitted, onSubmit }) => {
  const voteButton = hasUserSubmitted ? <Button title="Vote" onPress={onSubmit} /> : null;

  return (
    <CardContainer>
      <View style={styles.cardContents}>
        {contestInfo.submissions.length < 3 ?
          <Text style={styles.largePromptTitle}>You need at least 3 photos to vote, today you only had {contestInfo.submissions.length}!</Text>
          : <Text style={styles.largePromptTitle}>{hasUserSubmitted ? "It's time to vote!" : "You didn't submit today :( Wait for your friends to vote."}</Text>
        }
        <MemberListBubbles group={group} />
        {contestInfo.submissions.length < 3 ? <Button title="Continue" onPress={onSubmit} /> : voteButton}
      </View>
    </CardContainer>
  );
}

const ResultsBox = ({ contestInfo }) => {
  if (contestInfo.winner.length === 0) {
    return null;
  }

  if (contestInfo.winner.length === 1) {
    return (
      <CardContainer>
        <WinnersBox showTitle contestInfo={contestInfo} winner={contestInfo.winner[0]} />
      </CardContainer>
    );
  }

  return (
    <CardContainer>
      <Text style={styles.promptTitle}>Today's Winners</Text>
      <ScrollView horizontal style={{}}>
        {contestInfo.winner.map(winner => (
          <WinnersBox key={winner.uid} contestInfo={contestInfo} winner={winner} />
        ))}
      </ScrollView>
    </CardContainer>
  );
}

const WinnersBox = ({ contestInfo, winner, showTitle }) => {
  return (
    <View>
      {showTitle && <Text style={styles.promptTitle}>Today's Winner</Text>}

      <View style={styles.cardContentsRow}>
        <View style={styles.winner}>
          <View style={styles.centerImage}>
            <Image source={winner && winner.photoURL ? { uri: winner.photoURL } : require('../../assets/default_profile_picture.png')} style={styles.image} />
          </View>
          <Text style={styles.prompt}>{winner.displayName.split(" ")[0]}</Text>
        </View>
        <View style={{ flex: 1, width: 200, paddingBottom: 5 }}>
          {winner.uid
            ?
            <PolaroidPhoto small image={contestInfo.submissions.filter(s => s.userId === winner.uid)[0].photo} caption={contestInfo.submissions.filter(s => s.userId === winner.uid)[0].caption} />
            :
            null
          }
        </View>
      </View>
    </View>
  );
}

const CommentTextInput = ({ groupName, onSend, isLoading }) => {
  const [comment, setComment] = useState('');

  function onSendComment() {
    onSend(comment);
    setComment('');
  }

  return (
    <View style={styles.commentInputContainer}>
      <TextInput
        multiline
        placeholder={`Send a message to ${groupName}`}
        style={styles.commentTextBox}
        maxLength={200}
        onChangeText={setComment}
        value={comment}
        blurOnSubmit={true}
        returnKeyType="done" />
      <TouchableOpacity style={styles.sendButton} onPress={onSendComment} disabled={isLoading}>
        <FontAwesome6
          name="arrow-up"
          size={20}
          color={theme.colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexDirection: 'column',
    backgroundColor: theme.colors.white,
    height: '100%',
    flex: 1,
  },
  topSection: {
    display: 'flex',
    flex: 1,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    height: 'fit-content',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 3,
  },
  signupText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    textAlign: 'center',
    margin: 16
  },
  cardContents: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  cardContentsRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    flexShrink: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  promptTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  largePromptTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
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
  image: {
    width: 80,
    height: 80,
    borderRadius: 100
  },
  centerImage: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  winner: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'center',
  },
  addMoreMembersMessage: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'center',
    height: '100%',
    padding: 20,
    gap: 40,
  },
  commentInputContainer: {
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderColor: theme.colors.lightGray,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  commentTextBox: {
    backgroundColor: theme.colors.mediumGray,
    borderColor: theme.colors.white,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 15,
    fontSize: 16,
    flex: 1,
  },
  sendButton: {
    backgroundColor: theme.colors.purple,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    paddingHorizontal: 15,
    height: 45,
    marginVertical: 'auto'
  },
});