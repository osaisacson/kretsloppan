import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Picker,
  Alert,
  Text,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';
import HeaderButton from '../../components/UI/HeaderButton';
import ImagePicker from '../../components/UI/ImgPicker';
import Loader from '../../components/UI/Loader';
//Actions
import * as usersActions from '../../store/actions/users';
//Constants
import Colors from '../../constants/Colors';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value // From textChangeHandler = (inputIdentifier, text)
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

const EditUserScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  //Find user
  const editedUser = useSelector(state => state.users.currentUser);
  const userId = editedUser.id;

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      userName: editedUser ? editedUser.userName : '',
      email: editedUser ? editedUser.email : '',
      password: editedUser ? editedUser.password : ''
    },
    inputValidities: {
      userName: editedUser ? true : false,
      email: editedUser ? true : false,
      password: editedUser ? true : false
    },
    formIsValid: editedUser ? true : false
  });

  useEffect(() => {
    if (error) {
      Alert.alert('Oj!', error, [{ text: 'OK' }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [
        { text: 'Okay' }
      ]);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (editedUser) {
        await dispatch(
          usersActions.updateUser(
            userId,
            formState.inputValues.userName,
            formState.inputValues.email,
            formState.inputValues.password
          )
        );
      } else {
        await dispatch(
          usersActions.createUser(
            formState.inputValues.userName,
            formState.inputValues.email,
            formState.inputValues.password
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  }, [dispatch, userId, formState]);

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Save"
            iconName={
              Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
            }
            onPress={submitHandler}
          />
        </HeaderButtons>
      )
    });
  }, [submitHandler]);

  //Manages validation of title input
  const textChangeHandler = (inputIdentifier, text) => {
    //inputIdentifier and text will act as key:value in the form reducer

    let isValid = true;

    //If we haven't entered any value (its empty) set form validity to false
    if (text.trim().length === 0) {
      isValid = false;
    }

    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: text,
      isValid: isValid,
      input: inputIdentifier
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Användarnamn</Text>
            <TextInput
              style={styles.input}
              value={formState.inputValues.userName}
              onChangeText={textChangeHandler.bind(this, 'userName')}
              keyboardType="default"
              autoCapitalize="sentences"
              autoCorrect={false}
              returnKeyType="next"
            />
            {!formState.inputValues.userName ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Skriv in ett användarnamn</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.formControl}>
            <Text style={styles.label}>email</Text>
            <TextInput
              style={styles.input}
              value={formState.inputValues.email}
              onChangeText={textChangeHandler.bind(this, 'email')}
              keyboardType="email-address"
              email
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
            />
            {!formState.inputValues.email ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Skriv in din email</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.formControl}>
            <Text style={styles.label}>Lösenord</Text>
            <TextInput
              style={styles.input}
              value={formState.inputValues.password}
              secureTextEntry
              minLength={5}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={textChangeHandler.bind(this, 'password')}
              returnKeyType="done"
            />

            {!formState.inputValues.password ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Skriv in ditt lösenord</Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export const screenOptions = navData => {
  const routeParams = navData.route.params ? navData.route.params : {};
  return {
    headerTitle: routeParams.userId ? 'Edit User' : 'Add User'
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  formControl: {
    width: '100%'
  },
  label: {
    fontFamily: 'roboto-bold',
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
    fontFamily: 'roboto-regular',
    color: 'grey',
    fontSize: 13,
    textAlign: 'right'
  }
});

export default EditUserScreen;
