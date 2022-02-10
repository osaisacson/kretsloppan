import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { Alert, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import ImagePicker from '../components/UI/ImgPicker';
import Loader from '../components/UI/Loader';
import { FormFieldWrapper, formStyles } from '../components/wrappers/FormFieldWrapper';
import FormWrapper from '../components/wrappers/FormWrapper';
import * as profilesActions from '../store/actions/profiles';

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

const EditProfileScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  //TBD: Find a better solution for this. Currently the user object does not update if we don't pull in all profiles
  const currentProfileForId = useSelector((state) => state.profiles.userProfile || {});
  const loggedInUserId = currentProfileForId.profileId;
  const currentProfile = useSelector((state) =>
    state.profiles.allProfiles.find((profile) => profile.profileId === loggedInUserId)
  );

  const firebaseId = props.route.params ? props.route.params.detailId : null;

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      profileName: currentProfile ? currentProfile.profileName : '',
      profileDescription: currentProfile ? currentProfile.profileDescription : '',
      email: currentProfile ? currentProfile.email : '',
      phone: currentProfile ? currentProfile.phone : '',
      address: currentProfile ? currentProfile.address : '',
      location: currentProfile ? currentProfile.location : '',
      defaultPickupDetails: currentProfile ? currentProfile.defaultPickupDetails : '',
      image: currentProfile ? currentProfile.image : '',
    },
    inputValidities: {
      profileName: !!currentProfile,
      profileDescription: true,
      email: !!currentProfile,
      phone: !!currentProfile,
      address: !!currentProfile,
      location: !!currentProfile,
      defaultPickupDetails: true,
      image: !!currentProfile,
    },
    formIsValid: !!currentProfile,
  });

  //Handlers
  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert('Något är felskrivet!', 'Kolla så du fyllt i alla fält.', [{ text: 'Ok' }]);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (currentProfile) {
        await dispatch(
          profilesActions.updateProfile(
            firebaseId,
            formState.inputValues.profileName,
            formState.inputValues.profileDescription,
            formState.inputValues.email,
            formState.inputValues.phone,
            formState.inputValues.address,
            formState.inputValues.location,
            formState.inputValues.defaultPickupDetails,
            formState.inputValues.image
          )
        );
        props.navigation.navigate('Min Sida');
        setIsLoading(false);
      } else {
        await dispatch(
          profilesActions.createProfile(
            formState.inputValues.profileName,
            formState.inputValues.profileDescription,
            formState.inputValues.email,
            formState.inputValues.phone,
            formState.inputValues.address,
            formState.inputValues.location,
            formState.inputValues.defaultPickupDetails,
            formState.inputValues.image
          )
        );
      }
    } catch (err) {
      setError(err.message);
    }
    props.navigation.navigate('Min Sida');
    setIsLoading(false);
  }, [dispatch, currentProfile, formState]);

  //Manages validation of title input
  const textChangeHandler = (inputIdentifier) => (text) => {
    //inputIdentifier and text will act as key:value in the form reducer

    let isValid = true;

    //If we haven't entered any value (its empty) set form validity to false
    if (text.trim().length === 0) {
      isValid = false;
    }

    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: text,
      isValid,
      input: inputIdentifier,
    });
  };

  //Alert if error
  useEffect(() => {
    if (error) {
      Alert.alert('Oj!', error, [{ text: 'OK' }]);
    }
  }, [error]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <FormWrapper
      submitButtonText="Spara Profil"
      handlerForButtonSubmit={submitHandler}
      isLoading={isLoading}>
      <FormFieldWrapper prompt="Välj en profilbild">
        <ImagePicker
          onImageTaken={textChangeHandler('image')}
          passedImage={formState.inputValues.image}
        />
      </FormFieldWrapper>
      <FormFieldWrapper prompt="Skriv in ett användarnamn">
        <TextInput
          placeholder="Användarnamn"
          style={formStyles.input}
          value={formState.inputValues.profileName}
          onChangeText={textChangeHandler('profileName')}
          keyboardType="default"
          autoCapitalize="none"
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper prompt="Skriv in en kort beskrivning">
        <TextInput
          placeholder="Beskrivning"
          style={formStyles.multilineInput}
          value={formState.inputValues.profileDescription}
          multiline
          numberOfLines={4}
          onChangeText={textChangeHandler('profileDescription')}
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper prompt="Lägg in ett kontaktnummer">
        <TextInput
          placeholder="Telefon"
          style={formStyles.input}
          value={formState.inputValues.phone.toString()}
          onChangeText={textChangeHandler('phone')}
          keyboardType="default"
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper prompt="Skriv in den email folk kan kontakta dig på">
        <TextInput
          placeholder="Email"
          style={formStyles.input}
          value={formState.inputValues.email}
          onChangeText={textChangeHandler('email')}
          keyboardType="email-address"
          required
          email
          autoCapitalize="none"
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper prompt="Skriv in addressen återbruket vanligtvis kan hämtas på">
        <TextInput
          placeholder="Address"
          style={formStyles.input}
          value={formState.inputValues.address}
          onChangeText={textChangeHandler('address')}
          keyboardType="default"
          autoCapitalize="none"
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper prompt="Skriv in din ort">
        <TextInput
          placeholder="Ort"
          style={formStyles.input}
          value={formState.inputValues.location}
          onChangeText={textChangeHandler('location')}
          keyboardType="default"
          autoCapitalize="none"
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper prompt="Skriv in eventuella generella upphämtningsdetaljer">
        <TextInput
          placeholder="Generella upphämtningsdetaljer (valfritt)"
          style={formStyles.input}
          value={formState.inputValues.defaultPickupDetails}
          onChangeText={textChangeHandler('defaultPickupDetails')}
          keyboardType="default"
          autoCapitalize="none"
          returnKeyType="done"
        />
      </FormFieldWrapper>
    </FormWrapper>
  );
};

export const screenOptions = (navData) => {
  const routeParams = navData.route.params ? navData.route.params : {};
  return {
    headerTitle: routeParams.detailId ? 'Redigera profil' : 'Skapa profil',
  };
};

export default EditProfileScreen;
