import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Button from '../../../Components/Button';
import CardContainer from '../../../Components/CardContainer';
import theme from '../../../theme';

const prompts = [
  'This is the first option for a prompt',
  'This is another option for a prompt that is slightly longer',
  'This is a third option for a prompt',
];

const ChoosePromptScreen = ({ navigation }) => {
  const [selectedPrompt, setSelectedPrompt] = React.useState('');
  const [customPrompt, setCustomPrompt] = React.useState('');

  function setPrompt(prompt) {
    setSelectedPrompt(prompt);
    setCustomPrompt('');
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topSection}>
        <Text style={styles.title}>Choose tomorrow's photo prompt...</Text>
        <KeyboardAwareScrollView>
          <View style={styles.options}>
            {prompts.map(prompt => (
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
        onPress={() => {
          navigation.pop(3);
        }} />
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