import React from 'react';

//Components
import {
  ScrollView,
  StyleSheet,
  View,
  KeyboardAvoidingView
} from 'react-native';

import SaferArea from '../../components/UI/SaferArea';

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
