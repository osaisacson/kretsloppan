import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {
  Alert,
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButton';
import * as categoryActions from '../../store/actions/categories';

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

const EditCategoryScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const categoryId = props.navigation.getParam('categoryId');
  const editedCategory = useSelector(state =>
    state.categories.categories.find(category => category.id === categoryId)
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      categoryName: editedCategory ? editedCategory.categoryName : '',
      color: editedCategory ? editedCategory.color : ''
    },
    inputValidities: {
      categoryName: editedCategory ? true : false,
      color: editedCategory ? true : false
    },
    formIsValid: editedCategory ? true : false
  });

  //Add or edit a category
  const submitHandler = useCallback(() => {
    // Only submit if we have valid form field inputs
    if (!formState.formIsValid) {
      Alert.alert('Wrong input', 'Please check the errors in the form', [
        { text: 'Ok' }
      ]);
      return;
    }
    //if editedCategory is true we are editing, else we are adding
    if (editedCategory) {
      dispatch(
        categoryActions.updateCategory(
          categoryId,
          formState.inputValues.categoryName,
          formState.inputValues.color
        )
      );
    } else {
      dispatch(
        categoryActions.createCategory(
          formState.inputValues.categoryName,
          formState.inputValues.color
        )
      );
    }
    props.navigation.goBack(); //Goes back to the previous screen after the above action has been performed
  }, [dispatch, categoryId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
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

  return (
    //KeyboardAvoidingView makes sure we can always reach our inputs, so they don't get covered by the keyboard
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          <View style={styles.formControl}>
            <Text style={styles.label}>Category Name</Text>
            <TextInput
              style={styles.input}
              value={formState.inputValues.categoryName}
              onChangeText={textChangeHandler.bind(this, 'categoryName')}
              keyboardType="default"
              autoCorrect={false}
              autoCapitalize="sentences"
              returnKeyType="next"
            />
            {!formState.inputValues.categoryName ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  Please enter a category name
                </Text>
              </View>
            ) : null}
          </View>
          <View
            style={styles.formControl}
            style={{
              backgroundColor: formState.inputValues.color
            }}
          >
            <Text style={styles.label}>Color</Text>
            <TextInput
              style={styles.input}
              value={formState.inputValues.color}
              onChangeText={textChangeHandler.bind(this, 'color')}
              autoCorrect={false}
              returnKeyType="done"
            />
            {!formState.inputValues.color ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  Please enter an color for the category
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditCategoryScreen.navigationOptions = navData => {
  const submitFn = navData.navigation.getParam('submit');
  return {
    headerTitle: navData.navigation.getParam('categoryId')
      ? 'Edit Category'
      : 'Add Category',
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20
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

export default EditCategoryScreen;
