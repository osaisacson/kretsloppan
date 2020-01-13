import React, { useReducer, useEffect, useCallback } from 'react';
import {
  Alert,
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Picker
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';

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

const EditProductScreen = props => {
  const prodId = props.navigation.getParam('productId');
  const editedProduct = useSelector(state =>
    state.products.userProducts.find(prod => prod.id === prodId)
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : '',
      imageUrl: editedProduct ? editedProduct.imageUrl : '',
      description: editedProduct ? editedProduct.description : '',
      price: '',
      categoryName: editedProduct ? editedProduct.categoryName : ''
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
      categoryName: editedProduct ? true : false
    },
    formIsValid: editedProduct ? true : false
  });

  //Add or edit a product
  const submitHandler = useCallback(() => {
    // Only submit if we have valid form field inputs
    if (!formState.formIsValid) {
      Alert.alert('Wrong input', 'Please check the errors in the form', [
        { text: 'Ok' }
      ]);
      return;
    }
    //if editedProduct is true we are editing, else we are adding
    if (editedProduct) {
      dispatch(
        productsActions.updateProduct(
          prodId,
          formState.inputValues.title,
          formState.inputValues.description,
          formState.inputValues.imageUrl,
          formState.inputValues.categoryName
        )
      );
    } else {
      dispatch(
        productsActions.createProduct(
          formState.inputValues.title,
          formState.inputValues.description,
          formState.inputValues.imageUrl,
          +formState.inputValues.price,
          formState.inputValues.categoryName
        )
      );
    }
    props.navigation.goBack(); //Goes back to the previous screen after the above action has been performed
  }, [dispatch, prodId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  //Manages validation of title input
  const textChangeHandler = (inputIdentifier, text) => {
    //inputIdentifier and text will act as key:value in the form reducer

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;

    //If we haven't entered any value (its empty) set form validity to false
    if (text.trim().length === 0) {
      isValid = false;
    }
    if (inputIdentifier === 'email' && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    // if (min != null && +text < min) {
    //   isValid = false;
    // }
    // if (max != null && +text > max) {
    //   isValid = false;
    // }
    // if (minLength != null && text.length < minLength) {
    //   isValid = false;
    // }

    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: text,
      isValid: isValid,
      input: inputIdentifier
    });
  };

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Category</Text>

          <Picker
            selectedValue={formState.inputValues.categoryName}
            onValueChange={textChangeHandler.bind(this, 'categoryName')}
          >
            {/* NOTE: These are hardcoded to match the categories defined in the categories dummy data. They shalt not be hardcoded in the end. */}
            <Picker.Item label="Tak" value="Tak" />
            <Picker.Item label="Grund" value="Grund" />
            <Picker.Item label="Fönster" value="Fönster" />
            <Picker.Item label="Maskiner" value="Maskiner" />
            <Picker.Item label="Diverse" value="Diverse" />
          </Picker>
          {!formState.inputValues.categoryName ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Please select a category</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={formState.inputValues.title}
            onChangeText={textChangeHandler.bind(this, 'title')}
            keyboardType="default"
            autoCapitalize="sentences"
            returnKeyType="next"
          />
          {!formState.inputValues.title ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Please enter a title</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={styles.input}
            value={formState.inputValues.imageUrl}
            onChangeText={textChangeHandler.bind(this, 'imageUrl')}
            returnKeyType="next"
          />
          {!formState.inputValues.imageUrl ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Please enter an image url</Text>
            </View>
          ) : null}
        </View>
        {editedProduct ? null : (
          <View style={styles.formControl}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={formState.inputValues.price}
              onChangeText={textChangeHandler.bind(this, 'price')}
              keyboardType="number-pad"
              returnKeyType="next"
            />
            {!formState.inputValues.price ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Please enter a price</Text>
              </View>
            ) : null}
          </View>
        )}
        <View style={styles.formControl}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={formState.inputValues.description}
            onChangeText={textChangeHandler.bind(this, 'description')}
            returnKeyType="done"
          />
          {/* Error message */}
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{props.errorText}</Text>
          </View>
          {!formState.inputValues.description ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Please enter a description</Text>
            </View>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
};

EditProductScreen.navigationOptions = navData => {
  const submitFn = navData.navigation.getParam('submit');
  return {
    headerTitle: navData.navigation.getParam('productId')
      ? 'Edit Product'
      : 'Add Product',
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
    fontFamily: 'open-sans-bold',
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
    fontFamily: 'open-sans',
    color: 'red',
    fontSize: 13
  }
});

export default EditProductScreen;
