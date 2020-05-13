import React from 'react';
//Components
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
import ButtonNormal from '../UI/ButtonNormal';
import ScrollViewToTop from './ScrollViewToTop';

const FormWrapper = (props) => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={120}
    >
      <ScrollViewToTop>
        <View style={styles.formWrapper}>{props.children}</View>
        <ButtonNormal
          disabled={props.isLoading}
          text={props.submitButtonText}
          actionOnPress={props.handlerForButtonSubmit}
        />
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
