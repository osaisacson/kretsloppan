import React from 'react';

//Components
import { StyleSheet, TextInput } from 'react-native';

import SearchBar from '../../components/UI/SearchBar';
//Constants
import Colors from '../../constants/Colors';

const SearchBar = props => {
  return (
    <TextInput
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
    padding: 10
  },
  textInputStyle: {
    textAlign: 'center',
    height: 40,
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: Colors.darkPrimary,
    backgroundColor: '#FFFFFF'
  }
});

export default SearchBar;
