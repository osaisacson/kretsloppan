import React from 'react';
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-paper';

import ScrollViewToTop from './ScrollViewToTop';

const FormWrapper = (props) => {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={120}>
      <ScrollViewToTop>
        <View style={styles.formWrapper}>{props.children}</View>
        <Button
          mode="contained"
          disabled={props.isLoading}
          style={styles.button}
          labelStyle={styles.buttontext}
          onPress={props.handlerForButtonSubmit}>
          {props.submitButtonText}
        </Button>
      </ScrollViewToTop>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 140,
  },
  buttontext: {
    fontFamily: 'roboto-light',
    fontSize: 18,
  },
  formWrapper: {
    paddingHorizontal: 8,
  },
});

export default FormWrapper;
