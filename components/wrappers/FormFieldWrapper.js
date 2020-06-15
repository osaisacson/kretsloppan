import React from 'react';
import { View, StyleSheet } from 'react-native';

import HeaderThree from '../../components/UI/HeaderThree';

export const FormFieldWrapper = (props) => {
  return (
    <View style={formStyles.formControl}>
      {props.label ? <HeaderThree text={props.label} style={formStyles.sectionLabel} /> : null}
      {props.highlightedSubLabel ? (
        <HeaderThree
          style={{ fontFamily: 'roboto-bold', marginLeft: 5 }}
          text={props.highlightedSubLabel}
        />
      ) : null}
      {props.subLabel ? <HeaderThree text={props.subLabel} style={{ marginLeft: 5 }} /> : null}
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
    marginTop: 10,
    marginLeft: 10,
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
