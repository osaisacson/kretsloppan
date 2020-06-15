import React from 'react';
import { StyleSheet } from 'react-native';
import SearchInput from 'react-native-search-filter';

import Colors from '../../constants/Colors';

const SearchBar = (props) => {
  return (
    <SearchInput
      onChangeText={props.onChangeText}
      clearTextOnFocus
      style={styles.textInputStyle}
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
