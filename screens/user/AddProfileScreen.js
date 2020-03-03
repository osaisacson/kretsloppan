import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ButtonNormal from '../../components/UI/ButtonNormal';

//Component
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Text,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import HeaderOne from '../../components/UI/HeaderOne';
import ImagePicker from '../../components/UI/ImgPicker';

//Actions
import * as profilesActions from '../../store/actions/profiles';

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

const AddProfileScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  //Profiles
  const authUserId = useSelector(state => state.auth.userId);

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      profileName: '',
      email: '',
      phone: '',
      image: ''
    },
    inputValidities: {
      profileName: false,
      email: false,
      phone: false,
      image: false
    },
    formIsValid: false
  });

  useEffect(() => {
    if (error) {
      Alert.alert('Oj!', error, [{ text: 'OK' }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert('Fel input!', 'Verkar som något inte är ifyllt korrekt', [
        { text: 'Ok, fine' }
      ]);
      return;
    }
    setError(null);
    setIsLoading(true); //renders loader instead of form
    try {
      await dispatch(
        profilesActions.createProfile(
          authUserId,
          formState.inputValues.profileName,
          formState.inputValues.email,
          formState.inputValues.phone,
          formState.inputValues.image
        )
      );
    } catch (err) {
      setError(err.message);
    }
    console.log('saved successfully');
    props.navigation.navigate('ProductsOverview');
    setIsLoading(false);
  }, [dispatch, authUserId, formState]);

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
    return (
      console.log('we are loading'),
      (
        <View>
          <Text>Sparar profil</Text>
          {/* <Loader /> */}
          {/* <View style={styles.centered}>
<ActivityIndicator size="large" color={Colors.primary} />
</View> */}
        </View>
      )
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <HeaderOne title="skapa profil" />
        <View style={styles.form}>
          <ImagePicker
            onImageTaken={textChangeHandler.bind(this, 'image')}
            passedImage={formState.inputValues.image}
            imagePrompt="Välj en profilbild"
          />

          <View style={styles.formControl}>
            <Text style={styles.label}>Användarnamn</Text>
            <TextInput
              style={styles.input}
              value={formState.inputValues.profileName}
              onChangeText={textChangeHandler.bind(this, 'profileName')}
              keyboardType="default"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
            {!formState.inputValues.profileName ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Skriv in ett användarnamn</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.formControl}>
            <Text style={styles.label}>Telefon</Text>

            <TextInput
              style={styles.input}
              value={formState.inputValues.phone.toString()}
              onChangeText={textChangeHandler.bind(this, 'phone')}
              keyboardType="number-pad"
              autoCorrect={false}
              returnKeyType="next"
            />
            {!formState.inputValues.phone ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Lägg in ett kontaktnummer</Text>
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
              required
              email
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
            />
            {!formState.inputValues.email ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  Skriv in den email köpare kan kontakta dig på
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        <ButtonNormal
          isLoading={isLoading}
          actionOnPress={submitHandler}
          text={'Spara Profil'}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export const screenOptions = navData => {
  return {
    headerLeft: null,
    headerTitle: ''
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
  subLabel: {
    fontFamily: 'roboto-light-italic'
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

export default AddProfileScreen;
