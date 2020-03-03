import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Picker,
  Alert,
  Text,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import ButtonNormal from '../../components/UI/ButtonNormal';
import { useSelector, useDispatch } from 'react-redux';
import ImagePicker from '../../components/UI/ImgPicker';
import HorizontalPicker from '../../components/UI/HorizontalPicker';
import Loader from '../../components/UI/Loader';
//Actions
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const prodId = props.route.params ? props.route.params.detailId : null;

  //Projects
  const userProjects = useSelector(state => state.projects.userProjects);

  //Find product
  const editedProduct = useSelector(state =>
    state.products.userProducts.find(prod => prod.id === prodId)
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      categoryName: editedProduct ? editedProduct.categoryName : '',
      title: editedProduct ? editedProduct.title : '',
      image: editedProduct ? editedProduct.image : '',
      description: editedProduct ? editedProduct.description : '',
      price: editedProduct ? editedProduct.price : ''
    },
    inputValidities: {
      categoryName: editedProduct ? true : false,
      title: editedProduct ? true : false,
      image: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false
    },
    formIsValid: editedProduct ? true : false
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
      if (editedProduct) {
        await dispatch(
          productsActions.updateProduct(
            prodId,
            formState.inputValues.categoryName,
            formState.inputValues.title,
            formState.inputValues.description,
            +formState.inputValues.price,
            formState.inputValues.image
          )
        );
      } else {
        await dispatch(
          productsActions.createProduct(
            formState.inputValues.categoryName,
            formState.inputValues.title,
            formState.inputValues.description,
            +formState.inputValues.price,
            formState.inputValues.image
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  }, [dispatch, prodId, formState]);

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
            <Text style={styles.label}>Pris</Text>
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
                  Lägg in ett pris (det kan vara 0)
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
                  Skriv in en kort beskrivning
                </Text>
              </View>
            ) : null}
          </View>
          <View style={styles.formControl}>
            <Text style={styles.label}>Kategori</Text>
            <Picker
              selectedValue={formState.inputValues.categoryName}
              onValueChange={textChangeHandler.bind(this, 'categoryName')}
            >
              <Picker.Item
                key={'tak'}
                label={'tak'}
                value={'tak'.toLowerCase()}
              />
              <Picker.Item
                key={'golv'}
                label={'golv'}
                value={'golv'.toLowerCase()}
              />
              <Picker.Item
                key={'dörr'}
                label={'dörr'}
                value={'dörr'.toLowerCase()}
              />
            </Picker>
            {!formState.inputValues.categoryName ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Välj en kategori</Text>
              </View>
            ) : null}
          </View>
          <ButtonNormal actionOnPress={submitHandler} text="Spara" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export const screenOptions = navData => {
  const routeParams = navData.route.params ? navData.route.params : {};
  return {
    headerTitle: routeParams.detailId ? 'Edit Product' : 'Add Product'
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

export default EditProductScreen;
