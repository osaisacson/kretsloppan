import React from 'react';

//Components
import { StyleSheet, TextInput } from 'react-native';

//Constants
import Colors from '../../constants/Colors';

const SearchBar = (props) => {
  return (
    <TextInput
      onChangeText={props.actionOnChangeText}
      placeholder={props.placeholder}
      style={styles.textInputStyle}
      underlineColorAndroid="transparent"
      value={props.searchQuery}
    />
  );
};

const styles = StyleSheet.create({
  textInputStyle: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.neutral,
    borderWidth: 1,
    height: 40,
    paddingLeft: 10,
    textAlign: 'center',
  },
});

export default SearchBar;
