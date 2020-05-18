import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import HeaderThree from '../../components/UI/HeaderThree';
//Constants
import Colors from '../../constants/Colors';

export const FormFieldWrapper = (props) => {
  return (
    <View style={formStyles.formControl}>
      {props.label ? (
        <HeaderThree text={props.label} style={formStyles.sectionLabel} />
      ) : null}
      {props.subLabel ? <HeaderThree text={props.subLabel} /> : null}
      {props.children}
    </View>
  );
};

export const formStyles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formControl: {
    width: '100%',
  },
  sectionLabel: {
    alignSelf: 'center',
  },
  input: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginVertical: 15,
  },
  multilineInput: {
    minHeight: 100, //... For dynamic height
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginVertical: 15,
  },
});
