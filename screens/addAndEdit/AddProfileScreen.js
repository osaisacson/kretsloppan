import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ActivityIndicator, Alert, TextInput, View } from 'react-native';

//Components
import FormWrapper from '../../components/wrappers/FormWrapper';
import {
  FormFieldWrapper,
  formStyles,
} from '../../components/wrappers/FormFieldWrapper';
import ImagePicker from '../../components/UI/ImgPicker';
//Actions
import * as profilesActions from '../../store/actions/profiles';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value, // From textChangeHandler = (inputIdentifier, text)
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const AddProfileScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  //Get profiles, return only the one which matches the logged in id
  const loggedInUserId = useSelector((state) => state.auth.userId);
  const profilesArray = useSelector(
    (state) => state.profiles.allProfiles
  ).filter((profile) => profile.profileId === loggedInUserId);

  //Currently edited profile
  const currentProfile = profilesArray[0];

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      profileName: '',
      email: '',
      phone: '',
      address: '',
      image: '',
    },
    inputValidities: {
      profileName: false,
      email: false,
      phone: false,
      address: false,
      image: false,
    },
    formIsValid: false,
  });

  //Handlers
  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert(
        'Något är felskrivet!',
        'Kolla om det står någon text under något av fälten.',
        [{ text: 'Ok' }]
      );
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(
        profilesActions.createProfile(
          formState.inputValues.profileName,
          formState.inputValues.email,
          formState.inputValues.phone,
          formState.inputValues.address,
          formState.inputValues.image
        )
      );
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, currentProfile, formState]);

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
      input: inputIdentifier,
    });
  };

  //Alert if error
  useEffect(() => {
    if (error) {
      Alert.alert('Oj, det blev fel! Försök igen.', error, [{ text: 'OK' }]);
    }
  }, [error]);

  useEffect(() => {
    if (isLoading) {
      Alert.alert(
        'Laddar upp din profil, ändringarna syns om några sekunder',
        error,
        [{ text: 'OK' }]
      );
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {isLoading && <ActivityIndicator color={'#ff0000'} />}
      </View>
    );
  }

  return (
    <FormWrapper
      submitButtonText="Spara Profil"
      handlerForButtonSubmit={submitHandler}
      isLoading={isLoading}
    >
      <FormFieldWrapper
        showPromptIf={!formState.inputValues.image}
        prompt="Välj en profilbild"
      >
        <ImagePicker
          onImageTaken={textChangeHandler.bind(this, 'image')}
          passedImage={formState.inputValues.image}
        />
      </FormFieldWrapper>
      <FormFieldWrapper
        showPromptIf={!formState.inputValues.profileName}
        prompt="Skriv in ett användarnamn"
      >
        <TextInput
          placeholder="Användarnamn"
          style={formStyles.input}
          value={formState.inputValues.profileName}
          onChangeText={textChangeHandler.bind(this, 'profileName')}
          keyboardType="default"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper
        showPromptIf={!formState.inputValues.phone}
        prompt="Lägg in ett kontaktnummer"
      >
        <TextInput
          placeholder="Telefon"
          style={formStyles.input}
          value={formState.inputValues.phone.toString()}
          onChangeText={textChangeHandler.bind(this, 'phone')}
          keyboardType="number-pad"
          autoCorrect={false}
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper
        showPromptIf={!formState.inputValues.email}
        prompt="Skriv in den email folk kan kontakta dig på"
      >
        <TextInput
          placeholder="Email"
          style={formStyles.input}
          value={formState.inputValues.email}
          onChangeText={textChangeHandler.bind(this, 'email')}
          keyboardType="email-address"
          required
          email
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper
        showPromptIf={!formState.inputValues.profileName}
        prompt="Skriv in addressen återbruket vanligtvis kan hämtas på"
      >
        <TextInput
          placeholder="Address"
          style={formStyles.input}
          value={formState.inputValues.address}
          onChangeText={textChangeHandler.bind(this, 'address')}
          keyboardType="default"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
        />
      </FormFieldWrapper>
    </FormWrapper>
  );
};

export const screenOptions = (navData) => {
  return {
    headerLeft: '',
    headerTitle: 'Skapa profil',
    headerRight: '',
  };
};

export default AddProfileScreen;
