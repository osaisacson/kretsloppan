import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { Alert, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import HeaderThree from '../../components/UI/HeaderThree';
import HorizontalScrollContainer from '../../components/UI/HorizontalScrollContainer';
import Loader from '../../components/UI/Loader';
import RoundItem from '../../components/UI/RoundItem';
import { detailStyles } from '../../components/wrappers/DetailWrapper';
import { FormFieldWrapper, formStyles } from '../../components/wrappers/FormFieldWrapper';
import FormWrapper from '../../components/wrappers/FormWrapper';
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
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const proposalId = props.route.params ? props.route.params.detailId : null;

  const currentProfile = useSelector((state) => state.profiles.userProfile || {});
  const loggedInUserId = currentProfile.profileId;

  //Find proposal
  const availableProposals = useSelector((state) => state.projects.availableProposals);
  const userProposals = availableProposals.filter(
    (proposal) => proposal.ownerId === loggedInUserId
  );
  const editedProposal = userProposals.find((proposal) => proposal.id === proposalId);

  //Find the user's projects
  const availableProjects = useSelector((state) => state.projects.availableProjects);
  const userProjects = availableProjects.filter((project) => project.ownerId === loggedInUserId);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProposal ? editedProposal.title : '',
      description: editedProposal ? editedProposal.description : '',
      price: editedProposal ? editedProposal.price : '',
      projectId: editedProposal ? editedProposal.projectId : '',
    },
    inputValidities: {
      title: !!editedProposal,
      description: !!editedProposal,
      price: !!editedProposal,
      projectId: true,
    },
    formIsValid: !!editedProposal,
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
            +formState.inputValues.price,
            formState.inputValues.projectId
          )
        );
      } else {
        await dispatch(
          proposalsActions.createProposal(
            formState.inputValues.title,
            formState.inputValues.description,
            +formState.inputValues.price,
            formState.inputValues.projectId
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
      isValid,
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
      isLoading={isLoading}>
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
      <FormFieldWrapper subLabel="Ersättning">
        <TextInput
          placeholder="Lägg in ersättning om relevant. Skriv 0 om inte."
          style={formStyles.input}
          value={formState.inputValues.price.toString()}
          onChangeText={textChangeHandler.bind(this, 'price')}
          keyboardType="number-pad"
          returnKeyType="next"
        />
      </FormFieldWrapper>

      <>
        <HeaderThree
          text="Relaterar efterlysningen till ett projekt?"
          style={detailStyles.centeredHeader}
        />

        <HorizontalScrollContainer>
          <RoundItem
            itemData={{
              image: './../../assets/avatar-placeholder-image.png',
              title: 'Inget projekt',
            }}
            key="000"
            isHorizontal
            isSelected={formState.inputValues.projectId === '000'}
            onSelect={textChangeHandler.bind(this, 'projectId', '000')}
          />
          {userProjects.map((item) => (
            <RoundItem
              itemData={item}
              key={item.id}
              isHorizontal
              isSelected={formState.inputValues.projectId === item.id}
              onSelect={textChangeHandler.bind(this, 'projectId', item.id)}
            />
          ))}
        </HorizontalScrollContainer>
      </>
    </FormWrapper>
  );
};

export const screenOptions = (navData) => {
  const routeParams = navData.route.params ? navData.route.params : {};
  return {
    headerTitle: routeParams.detailId ? 'Redigera efterlysning' : 'Lägg till ny efterlysning',
  };
};

export default EditProposalScreen;
