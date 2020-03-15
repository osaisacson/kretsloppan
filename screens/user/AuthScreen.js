import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { useDispatch } from 'react-redux';
//Components
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Alert
} from 'react-native';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import { Button } from 'react-native-paper';

//Actions
import * as authActions from '../../store/actions/auth';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};

const AuthScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: ''
    },
    inputValidities: {
      email: false,
      password: false
    },
    formIsValid: false
  });

  useEffect(() => {
    if (error) {
      Alert.alert('Oj!', error, [{ text: 'OK' }]);
    }
  }, [error]);

  const authHandler = async () => {
    let action;
    if (isSignup) {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password
      );
    } else {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  );

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <ImageBackground
        source={{
          uri:
            'https://images.unsplash.com/photo-1534328564742-a5e0c9d80f7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80'
        }}
        style={styles.centeredContent}
      >
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id="email"
              label="E-Mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="password"
              label="Password"
              keyboardType="default"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid password."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Button
                  color={'#000'}
                  mode="outlined"
                  contentStyle={{
                    justifyContent: 'center',
                    borderWidth: 0.1
                  }}
                  labelStyle={{
                    paddingTop: 13,
                    paddingBottom: 9,
                    fontFamily: 'bebas-neue-bold',
                    fontSize: 28
                  }}
                  onPress={authHandler}
                >
                  {isSignup ? 'Gå med' : 'Logga in'}
                </Button>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                color={'#666'}
                mode="contained"
                style={{
                  width: '60%',
                  alignSelf: 'center'
                }}
                labelStyle={{
                  paddingTop: 2,
                  fontFamily: 'bebas-neue-bold',
                  fontSize: 12
                }}
                compact={true}
                onPress={() => {
                  setIsSignup(prevState => !prevState);
                }}
              >
                {`Byt till ${isSignup ? 'logga in' : 'skapa konto'}`}
              </Button>
            </View>
          </ScrollView>
        </Card>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export const screenOptions = {
  headerTitle: ''
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  centeredContent: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20
  },
  buttonContainer: {
    marginTop: 10
  }
});

export default AuthScreen;
