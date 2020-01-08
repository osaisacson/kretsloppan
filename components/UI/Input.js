import React, { useReducer, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Picker } from 'react-native';

const INPUT_CHANGE = 'INPUT_CHANGE';
const INPUT_BLUR = 'INPUT_BLUR';

//Initial state. Merges all the states into one reducer that handles hooks and validities
const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true
      };
    default:
      return state;
  }
};

const Input = props => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : '',
    isValid: props.initiallyValid,
    touched: false
  });

  const { onInputChange, id } = props;

  useEffect(() => {
    if (inputState.touched) {
      onInputChange(id, inputState.value, inputState.isValid);
    }
  }, [inputState, onInputChange, id]);

  const textChangeHandler = text => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }
    dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });
  };

  const lostFocusHandler = () => {
    dispatch({ type: INPUT_BLUR });
  };

  //...else return the regular input field
  return (
    <View style={styles.formControl}>
      <Text style={styles.label}>{props.label}</Text>
      {props.picker ? (
        //If the input is set as picker render the picker input
        <Picker
          {...props}
          value={inputState.value}
          selectedValue={inputState.value}
          onValueChange={textChangeHandler}
        >
          {/* NOTE: These are hardcoded to match the categories defined in the categories dummy data. They shalt not be hardcoded in the end. */}
          <Picker.Item label="Tak" value="Tak" />
          <Picker.Item label="Grund" value="Grund" />
          <Picker.Item label="Fönster" value="Fönster" />
          <Picker.Item label="Maskiner" value="Maskiner" />
          <Picker.Item label="Diverse" value="Diverse" />
        </Picker>
      ) : (
        //  Else render the TextInput
        <TextInput
          {...props}
          style={styles.input}
          value={inputState.value}
          onChangeText={textChangeHandler}
          onBlur={lostFocusHandler}
        />
      )}

      {!inputState.isValid && inputState.touched && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formControl: {
    width: '100%'
  },
  label: {
    fontFamily: 'open-sans-bold',
    marginVertical: 8
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
    fontFamily: 'open-sans',
    color: 'red',
    fontSize: 13
  }
});

export default Input;
