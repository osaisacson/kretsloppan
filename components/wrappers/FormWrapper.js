import React from 'react';
//Components
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-paper';

import ScrollViewToTop from './ScrollViewToTop';

const FormWrapper = (props) => {
  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={120} style={{ flex: 1 }}>
      <ScrollViewToTop>
        <View style={styles.formWrapper}>{props.children}</View>

        <Button
          disabled={props.isLoading}
          labelStyle={{
            fontFamily: 'roboto-light',
            fontSize: 18,
          }}
          mode="contained"
          onPress={props.handlerForButtonSubmit}
          style={{
            width: '90%',
            alignSelf: 'center',
            marginBottom: 140,
          }}>
          {props.submitButtonText}
        </Button>
      </ScrollViewToTop>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  formWrapper: {
    paddingHorizontal: 8,
  },
});

export default FormWrapper;
