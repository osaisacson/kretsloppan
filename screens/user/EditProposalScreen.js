import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { View, StyleSheet, Alert, Text, TextInput } from 'react-native';
import FormWrapper from '../../components/wrappers/FormWrapper';
import ButtonNormal from '../../components/UI/ButtonNormal';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../components/UI/Loader';
//Actions
import * as proposalsActions from '../../store/actions/proposals';

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

const EditProposalScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const proposalId = props.route.params ? props.route.params.detailId : null;

  //Find proposal
  const editedProposal = useSelector(state =>
    state.proposals.userProposals.find(proposal => proposal.id === proposalId)
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProposal ? editedProposal.title : '',
      description: editedProposal ? editedProposal.description : '',
      price: editedProposal ? editedProposal.price : ''
    },
    inputValidities: {
      title: editedProposal ? true : false,
      description: editedProposal ? true : false,
      price: editedProposal ? true : false
    },
    formIsValid: editedProposal ? true : false
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
        'Det verkar som något saknas i formuläret, kolla om det står någonting under fälten.',
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
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }

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
      input: inputIdentifier
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <FormWrapper>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Jag efterlyser...</Text>
          <TextInput
            style={styles.input}
            value={formState.inputValues.title}
            onChangeText={textChangeHandler.bind(this, 'title')}
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect={false}
            returnKeyType="next"
          />
          {!formState.inputValues.title ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Skriv in titeln på din efterlysning
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.formControl}>
          <Text style={styles.label}>Beskrivning</Text>
          <TextInput
            style={styles.input}
            value={formState.inputValues.description}
            onChangeText={textChangeHandler.bind(this, 'description')}
            autoCorrect={false}
            returnKeyType="done"
          />
          {!formState.inputValues.description ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Skriv in en kort beskrivning av vad du efterlyser
              </Text>
            </View>
          ) : null}
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>
            Ersättning (skriv 0 för om du söker voluntärer/donationer)
          </Text>
          <Text style={styles.subLabel}>
            Om du lägger upp som företag, ange pris inklusive moms
          </Text>
          <TextInput
            style={styles.input}
            value={formState.inputValues.price.toString()}
            onChangeText={textChangeHandler.bind(this, 'price')}
            keyboardType="number-pad"
            autoCorrect={false}
            returnKeyType="next"
          />
          {!formState.inputValues.price ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                Lägg in ett pris (sätt 0 för voluntärarbete)
              </Text>
            </View>
          ) : null}
        </View>
        <ButtonNormal actionOnPress={submitHandler} text="Spara" />
      </View>
    </FormWrapper>
  );
};

export const screenOptions = navData => {
  const routeParams = navData.route.params ? navData.route.params : {};
  return {
    headerTitle: routeParams.detailId
      ? 'Redigera efterlysning'
      : 'Lägg till ny efterlysning'
  };
};

const styles = StyleSheet.create({
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

export default EditProposalScreen;
