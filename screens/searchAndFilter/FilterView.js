import React, { useState } from 'react';

//Components
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TextInput
} from 'react-native';
import Filters from './Filters';
//Constants
import Colors from '../../constants/Colors';

const FilterView = props => {
  return (
    <View>
      <Text>This is where the filters will go</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textStyle: {
    padding: 10
  },
  textInputStyle: {
    textAlign: 'center',
    height: 40,
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: '#009688',
    backgroundColor: '#FFFFFF'
  }
});

export default FilterView;
