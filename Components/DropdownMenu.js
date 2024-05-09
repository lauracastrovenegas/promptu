import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import theme from '../theme';

const DropdownMenu = ({ items, selectedItem, setSelectedItem }) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View style={styles.container}>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: theme.colors.purple }]}
        selectedTextStyle={styles.textStyle}
        itemTextStyle={styles.textStyle}
        placeholderStyle={styles.placeholder}
        placeholder="Select a group to submit to..."
        data={items}
        maxHeight={300}
        labelField="name"
        valueField="id"
        value={selectedItem ? selectedItem.id : null}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setSelectedItem(item);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default DropdownMenu;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
  },
  dropdown: {
    height: 50,
    borderColor: theme.colors.lightGray,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  textStyle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    color: theme.colors.lightGray,
  },
});