import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { Alert, TextInput, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import ImagePicker from '../../components/UI/ImgPicker';
import Loader from '../../components/UI/Loader';
import { FormFieldWrapper, formStyles } from '../../components/wrappers/FormFieldWrapper';
import FormWrapper from '../../components/wrappers/FormWrapper';
import * as projectsActions from '../../store/actions/projects';

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

const EditProjectScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const projId = props.route.params ? props.route.params.detailId : null;

  //Find project
  const currentProfile = useSelector((state) => state.profiles.userProfile || {});
  const loggedInUserId = currentProfile.profileId;
  const availableProjects = useSelector((state) => state.projects.availableProjects);
  const userProjects = availableProjects.filter((project) => project.ownerId === loggedInUserId);
  const editedProject = userProjects.find((project) => project.id === projId);

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProject ? editedProject.title : '',
      location: editedProject ? editedProject.location : '',
      description: editedProject ? editedProject.description : '',
      image: editedProject ? editedProject.image : '',
      slogan: editedProject ? editedProject.slogan : '',
    },
    inputValidities: {
      title: !!editedProject,
      location: !!editedProject,
      description: true,
      image: !!editedProject,
      slogan: true,
    },
    formIsValid: !!editedProject,
  });

  useEffect(() => {
    if (error) {
      Alert.alert('Oj!', error, [{ text: 'OK' }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert('Fel input!', 'Kolla så alla fält är ifyllda.', [{ text: 'Ok' }]);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (editedProject) {
        await dispatch(
          projectsActions.updateProject(
            projId,
            formState.inputValues.title,
            formState.inputValues.location,
            formState.inputValues.description,
            formState.inputValues.slogan,
            formState.inputValues.image
          )
        );
        props.navigation.navigate('ProductDetail', { detailId: projId });
        setIsLoading(false);
      } else {
        await dispatch(
          projectsActions.createProject(
            formState.inputValues.title,
            formState.inputValues.location,
            formState.inputValues.description,
            formState.inputValues.slogan,
            formState.inputValues.image
          )
        );
        props.navigation.goBack();
        setIsLoading(false);
      }
    } catch (err) {
      setError(err.message);
    }
    props.navigation.navigate('ProjectDetail', { detailId: projId });
    setIsLoading(false);
  }, [dispatch, projId, formState]);

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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <FormWrapper
      submitButtonText="Spara Projekt"
      handlerForButtonSubmit={submitHandler}
      isLoading={isLoading}>
      <FormFieldWrapper prompt="Välj en bild som representerar projektet">
        <ImagePicker
          onImageTaken={textChangeHandler('image')}
          passedImage={formState.inputValues.image}
        />
        <Text style={{ textAlign: 'center' }}>
          Lägg in en bild som representerar projektet ovan - det kan till exempel vara en bild på
          pågående bygge, ritningen av hur det är tänkt att bli eller platsen där det ska byggas.
        </Text>
      </FormFieldWrapper>

      <FormFieldWrapper prompt="Skriv in en titel">
        <TextInput
          placeholder="Titel"
          style={formStyles.input}
          value={formState.inputValues.title}
          onChangeText={textChangeHandler('title')}
          keyboardType="default"
          autoCapitalize="sentences"
          returnKeyType="next"
        />
      </FormFieldWrapper>

      <FormFieldWrapper prompt="Skriv in en kort slogan för ditt projekt">
        <TextInput
          placeholder="Slogan"
          style={formStyles.input}
          value={formState.inputValues.slogan}
          onChangeText={textChangeHandler('slogan')}
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper prompt="Beskrivning av projektet (valfritt)">
        <TextInput
          placeholder="Beskrivning"
          style={formStyles.input}
          value={formState.inputValues.description}
          onChangeText={textChangeHandler('description')}
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper prompt="Vart ligger projektet?">
        <TextInput
          placeholder="Plats"
          style={formStyles.input}
          value={formState.inputValues.location}
          onChangeText={textChangeHandler('location')}
          returnKeyType="done"
        />
      </FormFieldWrapper>
    </FormWrapper>
  );
};

export const screenOptions = (navData) => {
  const routeParams = navData.route.params ? navData.route.params : {};
  return {
    headerTitle: routeParams.detailId ? 'Redigera projekt' : 'Lägg till projekt',
  };
};

export default EditProjectScreen;
