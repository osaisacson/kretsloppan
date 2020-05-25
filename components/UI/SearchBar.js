import React from 'react';

//Imports
import { StyleSheet, TextInput } from 'react-native';

//Constants
import Colors from '../../constants/Colors';

const SearchBar = (props) => {
  return (
    <TextInput
      clearTextOnFocus
      style={styles.textInputStyle}
      onChangeText={props.actionOnChangeText}
      value={props.searchQuery}
      underlineColorAndroid="transparent"
      placeholder={props.placeholder}
    />
  );
};

const styles = StyleSheet.create({
  textStyle: {
    padding: 10,
  },
  textInputStyle: {
    textAlign: 'center',
    height: 40,
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: Colors.neutral,
    backgroundColor: '#FFFFFF',
  },
});

export default SearchBar;
