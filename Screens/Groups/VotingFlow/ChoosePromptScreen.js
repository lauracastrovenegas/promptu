import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Button from '../../../Components/Button';
import CardContainer from '../../../Components/CardContainer';
import theme from '../../../theme';
import { db } from "../../../config/firebase";
import { addDoc, arrayUnion, collection, getDocs, query, updateDoc, where, doc } from "firebase/firestore";
import { getTomorrowsDateStamp } from "../../../Functions/utils";

const prompts = [
  'This is the first option for a prompt',
  'This is another option for a prompt that is slightly longer',
  'This is a third option for a prompt',
];

const ChoosePromptScreen = ({ route, navigation }) => {
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [promptBank, setPromptBank] = useState([]);

  const group = route.params.group;
  const dateStamp = getTomorrowsDateStamp();
  console.log(dateStamp);

  function setPrompt(prompt) {
    setSelectedPrompt(prompt);
    setCustomPrompt('');
  }

  async function onSubmit() {
    try {
      const dateStamp = getTomorrowsDateStamp();
      const groupContestRef = collection(db, "group_contests");
      const querySnapshot = await getDocs(query(groupContestRef, where("groupId", "==", group.id), where("date", "==", dateStamp)));
  
      if (querySnapshot.empty) {
        // No contest exists for tomorrow, create a new one
        await addDoc(groupContestRef, {
          groupId: group.id,
          date: dateStamp,
          winner: [], // Update with actual winners if necessary
          hasVotingOccurred: false,
          prompt: [customPrompt.length > 0 ? customPrompt : selectedPrompt], // Initialize prompt as an array
          submissions: [],
          votes: [],
          hasVoted: [],
        });
      } else {
        // Contest exists, update the prompt array
        const contestDoc = querySnapshot.docs[0];
        const newPrompt = customPrompt.length > 0 ? customPrompt : selectedPrompt;
  
        await updateDoc(doc(db, "group_contests", contestDoc.id), {
          prompt: arrayUnion(newPrompt),
        });
        console.log('choose p: ', contestDoc.data().prompt)
      }
    } catch (error) {
      Alert.alert("Error Creating or Updating Group Contest", error.message);
    }
  
    navigation.pop(5); // Pop back to the group screen
  }
  

  useEffect(() => {
    // TODO fetch from prompt bank
    setPromptBank(prompts);
  },[]);

  return (
    <View style={styles.screen}>
      <View style={styles.topSection}>
        <Text style={styles.title}>Choose tomorrow's photo prompt...</Text>
        <KeyboardAwareScrollView>
          <View style={styles.options}>
            {promptBank.map(prompt => (
              <TouchableOpacity key={prompt} onPress={() => setPrompt(prompt)}>
                <CardContainer selected={selectedPrompt === prompt && customPrompt === ''}>
                  <Text style={[styles.prompt].concat(selectedPrompt === prompt && customPrompt === '' ? { color: theme.colors.white, fontWeight: 'bold' } : {})}>{prompt}</Text>
                </CardContainer>
              </TouchableOpacity>
            ))}
            <CardContainer selected={customPrompt !== ''}>
              <Text style={[styles.prompt].concat(customPrompt !== '' ? { color: theme.colors.white, fontWeight: 'bold' } : {})}>Custom Prompt</Text>
              <TextInput
                multiline
                placeholder="Come up with your own prompt..."
                style={styles.textBox}
                maxLength={200}
                onChangeText={setCustomPrompt}
                value={customPrompt} />
            </CardContainer>
          </View>
        </KeyboardAwareScrollView>
      </View>
      <Button
        title="Continue"
        onPress={onSubmit} />
    </View>
  );
};

export default ChoosePromptScreen;

const styles = StyleSheet.create({
  screen: {
    flexDirection: 'column',
    padding: 20,
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  topSection: {
    flex: 1,
    paddingBottom: 20,
  },
  title: {
    fontSize: 30,
    marginVertical: 20,
    marginBottom: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textBox: {
    backgroundColor: theme.colors.mediumGray,
    borderColor: theme.colors.white,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 15,
    fontSize: 18,
    flex: 1,
    marginTop: 10,
  },
  selected: {
    backgroundColor: theme.colors.primary,
  },
  options: {
    flexDirection: 'column',
    gap: 20,
  },
  prompt: {
    fontSize: 18,
  },
});