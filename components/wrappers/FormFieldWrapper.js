import React from 'react';
import { View, StyleSheet } from 'react-native';

import HeaderThree from '../../components/UI/HeaderThree';

export const FormFieldWrapper = (props) => {
  return (
    <View style={formStyles.formControl}>
      {props.label ? <HeaderThree style={formStyles.sectionLabel} text={props.label} /> : null}
      {props.subLabel ? <HeaderThree text={props.subLabel} /> : null}
      {props.children}
    </View>
  );
};

export const formStyles = StyleSheet.create({
  formControl: {
    width: '100%',
  },
  sectionLabel: {
    alignSelf: 'center',
  },
});
