import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import SaferArea from '../UI/SaferArea';

export const DetailWrapper = props => {
  return (
    <SaferArea>
      <ScrollView>
        <View>{props.children}</View>
      </ScrollView>
    </SaferArea>
  );
};

export const detailStyles = StyleSheet.create({
  centeredContent: {
    flex: 1,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    height: 300,
    width: '100%'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  formControl: {
    width: '100%'
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },
  label: {
    fontFamily: 'roboto-bold',
    marginVertical: 8
  },
  subLabel: {
    fontFamily: 'roboto-light-italic'
  },
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    fontFamily: 'roboto-regular',
    color: 'grey',
    fontSize: 13,
    textAlign: 'right'
  },
  emptyState: {
    padding: 20,
    color: '#c0c0c0'
  }
});
