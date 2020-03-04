import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { Alert, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import FormWrapper from '../../components/wrappers/FormWrapper';
import FormFieldWrapper from '../../components/wrappers/FormFieldWrapper';
import formStyles from '../../components/wrappers/FormFieldWrapper';
import ImagePicker from '../../components/UI/ImgPicker';
//Actions
import * as projectsActions from '../../store/actions/projects';

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

const EditProjectScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const projId = props.route.params ? props.route.params.detailId : null;

  //Find project
  const editedProject = useSelector(state =>
    state.projects.userProjects.find(proj => proj.id === projId)
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProject ? editedProject.title : '',
      image: editedProject ? editedProject.image : '',
      slogan: editedProject ? editedProject.slogan : ''
    },
    inputValidities: {
      title: editedProject ? true : false,
      image: editedProject ? true : false,
      slogan: editedProject ? true : false
    },
    formIsValid: editedProject ? true : false
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
      if (editedProject) {
        await dispatch(
          projectsActions.updateProject(
            projId,
            formState.inputValues.title,
            formState.inputValues.slogan,
            formState.inputValues.image
          )
        );
      } else {
        await dispatch(
          projectsActions.createProject(
            formState.inputValues.title,
            formState.inputValues.slogan,
            formState.inputValues.image
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  }, [dispatch, projId, formState]);

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

  return (
    <FormWrapper
      submitButtonText="Spara Projekt"
      handlerForButtonSubmit={submitHandler}
      isLoading={isLoading}
    >
      <FormFieldWrapper
        label="Profilbild"
        showPromptIf={!formState.inputValues.image}
        prompt="Välj en profilbild"
      >
        <ImagePicker
          onImageTaken={textChangeHandler.bind(this, 'image')}
          passedImage={formState.inputValues.image}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        label="Titel"
        showPromptIf={!formState.inputValues.title}
        prompt="Skriv in en titel"
      >
        <TextInput
          style={formStyles.input}
          value={formState.inputValues.title}
          onChangeText={textChangeHandler.bind(this, 'title')}
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect={false}
          returnKeyType="next"
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        label="Slogan"
        showPromptIf={!formState.inputValues.slogan}
        prompt="Skriv in en kort slogan för ditt projekt"
      >
        <TextInput
          style={formStyles.input}
          value={formState.inputValues.slogan}
          onChangeText={textChangeHandler.bind(this, 'slogan')}
          autoCorrect={false}
          returnKeyType="done"
        />
      </FormFieldWrapper>
    </FormWrapper>
  );
};

export const screenOptions = navData => {
  const routeParams = navData.route.params ? navData.route.params : {};
  return {
    headerTitle: routeParams.projectId
      ? 'Redigera projekt'
      : 'Lägg till projekt'
  };
};

export default EditProjectScreen;
