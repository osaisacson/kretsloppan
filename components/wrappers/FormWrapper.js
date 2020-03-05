import React, { useEffect } from 'react';
//Components
import {
  ScrollView,
  StyleSheet,
  View,
  KeyboardAvoidingView
} from 'react-native';
import ButtonNormal from '../UI/ButtonNormal';
import SaferArea from '../UI/SaferArea';
import Loader from '../UI/Loader';

const FormWrapper = props => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <SaferArea>
        <ScrollView>
          <View style={styles.formWrapper}>{props.children}</View>
          <ButtonNormal
            text={props.submitButtonText}
            actionOnPress={props.handlerForButtonSubmit}
          />
        </ScrollView>
      </SaferArea>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  formWrapper: {
    paddingHorizontal: 8
  }
});

export default FormWrapper;
