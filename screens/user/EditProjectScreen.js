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
import * as categoriesActions from '../../store/actions/categories';
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

  const projId = props.route.params ? props.route.params.projectId : null;

  //Categories
  const categories = useSelector(state => state.categories.categories);

  const loadCategories = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(categoriesActions.fetchCategories());
    } catch (err) {
      console.log('Cannot fetch categories');
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  //Update the menu when there's new data: when the screen focuses (see docs for other options, like onBlur), call loadCategories again
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', loadCategories);

    return () => {
      unsubscribe();
    };
  }, [loadCategories]);

  useEffect(() => {
    loadCategories();
  }, [dispatch, loadCategories]);

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
          <ImagePicker
            onImageTaken={textChangeHandler.bind(this, 'image')}
            passedImage={formState.inputValues.image}
          />
          <View style={styles.formControl}>
            <Text style={styles.label}>Titel</Text>
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
                <Text style={styles.errorText}>Skriv in en titel</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.formControl}>
            <Text style={styles.label}>Slogan</Text>
            <TextInput
              style={styles.input}
              value={formState.inputValues.slogan}
              onChangeText={textChangeHandler.bind(this, 'slogan')}
              autoCorrect={false}
              returnKeyType="done"
            />
            {!formState.inputValues.slogan ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  Skriv in en kort slogan för projektet
                </Text>
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
    headerTitle: routeParams.projectId ? 'Edit Project' : 'Add Project'
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

export default EditProjectScreen;
