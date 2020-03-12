import React from 'react';
//Components
import {
  ScrollView,
  StyleSheet,
  View,
  KeyboardAvoidingView
} from 'react-native';
import ButtonNormal from '../UI/ButtonNormal';

const FormWrapper = props => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.formWrapper}>{props.children}</View>
        <ButtonNormal
          text={props.submitButtonText}
          actionOnPress={props.handlerForButtonSubmit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  formWrapper: {
    paddingHorizontal: 8
  }
});

export default FormWrapper;
