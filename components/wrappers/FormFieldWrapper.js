import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const FormFieldWrapper = props => {
  return (
    <View style={formStyles.formControl}>
      <Text style={formStyles.label}>{props.label}</Text>
      {props.subLabel ? (
        <Text style={formStyles.subLabel}>{props.subLabel}</Text>
      ) : null}
      {props.children}
      {props.showPromptIf ? (
        <View style={formStyles.errorContainer}>
          <Text style={formStyles.errorText}>{props.prompt}</Text>
        </View>
      ) : null}
    </View>
  );
};

const formStyles = StyleSheet.create({
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
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    fontFamily: 'roboto-regular',
    color: 'grey',
    fontSize: 13,
    textAlign: 'right'
  }
});

export default FormFieldWrapper;
