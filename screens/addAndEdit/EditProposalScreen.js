import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';

//Components
import { Alert, TextInput } from 'react-native';
import FormWrapper from '../../components/wrappers/FormWrapper';
import {
  FormFieldWrapper,
  formStyles,
} from '../../components/wrappers/FormFieldWrapper';
import Loader from '../../components/UI/Loader';

//Actions
import * as proposalsActions from '../../store/actions/proposals';

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

const EditProposalScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const proposalId = props.route.params ? props.route.params.detailId : null;

  //Find proposal
  const editedProposal = useSelector((state) =>
    state.proposals.userProposals.find((proposal) => proposal.id === proposalId)
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProposal ? editedProposal.title : '',
      description: editedProposal ? editedProposal.description : '',
      price: editedProposal ? editedProposal.price : '',
    },
    inputValidities: {
      title: editedProposal ? true : false,
      description: editedProposal ? true : false,
      price: editedProposal ? true : false,
    },
    formIsValid: editedProposal ? true : false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert('Oj!', error, [{ text: 'OK' }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert(
        'Ojoj',
        'Det verkar som något saknas i formuläret, Kolla så du fyllt i alla fält.',
        [{ text: 'OK' }]
      );
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (editedProposal) {
        await dispatch(
          proposalsActions.updateProposal(
            proposalId,
            formState.inputValues.title,
            formState.inputValues.description,
            +formState.inputValues.price
          )
        );
      } else {
        await dispatch(
          proposalsActions.createProposal(
            formState.inputValues.title,
            formState.inputValues.description,
            +formState.inputValues.price
          )
        );
      }
    } catch (err) {
      setError(err.message);
    }
    props.navigation.goBack();
    setIsLoading(false);
  }, [dispatch, proposalId, formState]);

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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <FormWrapper
      submitButtonText="Spara Efterlysning"
      handlerForButtonSubmit={submitHandler}
      isLoading={isLoading}
    >
      <FormFieldWrapper prompt="Skriv in titeln på din efterlysning">
        <TextInput
          placeholder="Jag efterlyser..."
          style={formStyles.input}
          value={formState.inputValues.title}
          onChangeText={textChangeHandler.bind(this, 'title')}
          keyboardType="default"
          autoCapitalize="sentences"
          returnKeyType="next"
        />
      </FormFieldWrapper>

      <FormFieldWrapper prompt="Skriv in en kort beskrivning av vad du efterlyser">
        <TextInput
          placeholder="Beskrivning"
          style={formStyles.multilineInput}
          value={formState.inputValues.description}
          multiline
          numberOfLines={4}
          onChangeText={textChangeHandler.bind(this, 'description')}
          returnKeyType="done"
        />
      </FormFieldWrapper>
      <FormFieldWrapper
        subLabel="Om du lägger upp som företag, ange pris inklusive moms"
        prompt="Skriv in en ersättning, 0 för volontärer/donationer"
      >
        <TextInput
          placeholder="Ersättning (skriv 0 för om du söker volontärer/donationer)"
          style={formStyles.input}
          value={formState.inputValues.price.toString()}
          onChangeText={textChangeHandler.bind(this, 'price')}
          keyboardType="number-pad"
          returnKeyType="next"
        />
      </FormFieldWrapper>
    </FormWrapper>
  );
};

export const screenOptions = (navData) => {
  const routeParams = navData.route.params ? navData.route.params : {};
  return {
    headerTitle: routeParams.detailId
      ? 'Redigera efterlysning'
      : 'Lägg till ny efterlysning',
  };
};

export default EditProposalScreen;
