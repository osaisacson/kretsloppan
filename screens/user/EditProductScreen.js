import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';

//Components
import {
  Alert,
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Picker,
  KeyboardAvoidingView
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import ImagePicker from '../../components/UI/ImgPicker';
import Loader from '../../components/UI/Loader';
import HeaderButton from '../../components/UI/HeaderButton';
//Actions
import * as categoriesActions from '../../store/actions/categories';
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

  const prodId = props.navigation.getParam('productId');
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
    const willFocusSubscription = props.navigation.addListener(
      'willFocus',
      loadCategories
    );
    //Cleanup afterwards. Removes the subscription
    return () => {
      willFocusSubscription.remove();
    };
  }, [loadCategories]);

  useEffect(() => {
    loadCategories();
  }, [dispatch, loadCategories]);

  const editedProduct = useSelector(state =>
    state.products.userProducts.find(prod => prod.id === prodId)
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      categoryName: editedProduct ? editedProduct.categoryName : '',
      title: editedProduct ? editedProduct.title : '',
      imageUrl: editedProduct ? editedProduct.imageUrl : '',
      description: editedProduct ? editedProduct.description : '',
      price: editedProduct ? editedProduct.price : ''
    },
    inputValidities: {
      categoryName: editedProduct ? true : false,
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false
    },
    formIsValid: editedProduct ? true : false
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  //Add or edit a product
  const submitHandler = useCallback(async () => {
    // Only submit if we have valid form field inputs
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [
        { text: 'Okay' }
      ]);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      //if editedProduct is true we are editing, else we are adding
      if (editedProduct) {
        await dispatch(
          productsActions.updateProduct(
            prodId,
            formState.inputValues.categoryName,
            formState.inputValues.title,
            formState.inputValues.description,
            +formState.inputValues.price,
            formState.inputValues.imageUrl
          )
        );
      } else {
        await dispatch(
          productsActions.createProduct(
            formState.inputValues.categoryName,
            formState.inputValues.title,
            formState.inputValues.description,
            +formState.inputValues.price,
            formState.inputValues.imageUrl
          )
        );
      }
      props.navigation.goBack(); //Goes back to the previous screen after the above action has been performed
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  }, [dispatch, prodId, formState]);

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

  if (isLoading) {
    return <Loader />;
  }

  return (
    //KeyboardAvoidingView makes sure we can always reach our inputs, so they don't get covered by the keyboard
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          <ImagePicker
            onImageTaken={textChangeHandler.bind(this, 'imageUrl')}
            passedImage={formState.inputValues.imageUrl}
          />
          <View style={styles.formControl}>
            <Text style={styles.label}>Category</Text>
            <Picker
              selectedValue={formState.inputValues.categoryName}
              onValueChange={textChangeHandler.bind(this, 'categoryName')}
            >
              {categories.map(category => (
                <Picker.Item
                  key={category.categoryName}
                  label={category.categoryName}
                  value={category.categoryName.toLowerCase()}
                />
              ))}
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
              autoCorrect={false}
              returnKeyType="next"
            />
            {!formState.inputValues.title ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Please enter a title</Text>
              </View>
            ) : null}
          </View>
          {/* <View style={styles.formControl}>
            <Text style={styles.label}>Image URL</Text>
            <TextInput
              style={styles.input}
              value={formState.inputValues.imageUrl}
              onChangeText={textChangeHandler.bind(this, 'imageUrl')}
              autoCorrect={false}
              selectTextOnFocus
              returnKeyType="next"
            />
            {!formState.inputValues.imageUrl ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Please enter an image url</Text>
              </View>
            ) : null}
          </View> */}
          <View style={styles.formControl}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={formState.inputValues.price}
              onChangeText={textChangeHandler.bind(this, 'price')}
              keyboardType="number-pad"
              autoCorrect={false}
              returnKeyType="next"
            />
            {!formState.inputValues.price ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Please enter a price</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.formControl}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              value={formState.inputValues.description}
              onChangeText={textChangeHandler.bind(this, 'description')}
              autoCorrect={false}
              returnKeyType="done"
            />
            {!formState.inputValues.description ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Please enter a description</Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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

export default EditProductScreen;

//FROM COURSE
// import React, { useState, useEffect, useCallback, useReducer } from 'react';
// import {
//   View,
//   ScrollView,
//   StyleSheet,
//   Platform,
//   Alert,
//   KeyboardAvoidingView,
//   ActivityIndicator
// } from 'react-native';
// import { HeaderButtons, Item } from 'react-navigation-header-buttons';
// import { useSelector, useDispatch } from 'react-redux';

// import HeaderButton from '../../components/UI/HeaderButton';
// import * as productsActions from '../../store/actions/products';
// import Input from '../../components/UI/Input';
// import Colors from '../../constants/Colors';

// const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

// const formReducer = (state, action) => {
//   if (action.type === FORM_INPUT_UPDATE) {
//     const updatedValues = {
//       ...state.inputValues,
//       [action.input]: action.value
//     };
//     const updatedValidities = {
//       ...state.inputValidities,
//       [action.input]: action.isValid
//     };
//     let updatedFormIsValid = true;
//     for (const key in updatedValidities) {
//       updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
//     }
//     return {
//       formIsValid: updatedFormIsValid,
//       inputValidities: updatedValidities,
//       inputValues: updatedValues
//     };
//   }
//   return state;
// };

// const EditProductScreen = props => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState();

//   const prodId = props.navigation.getParam('productId');
//   const editedProduct = useSelector(state =>
//     state.products.userProducts.find(prod => prod.id === prodId)
//   );
//   const dispatch = useDispatch();

//   const [formState, dispatchFormState] = useReducer(formReducer, {
//     inputValues: {
//       title: editedProduct ? editedProduct.title : '',
//       imageUrl: editedProduct ? editedProduct.imageUrl : '',
//       description: editedProduct ? editedProduct.description : '',
//       price: ''
//     },
//     inputValidities: {
//       title: editedProduct ? true : false,
//       imageUrl: editedProduct ? true : false,
//       description: editedProduct ? true : false,
//       price: editedProduct ? true : false
//     },
//     formIsValid: editedProduct ? true : false
//   });

//   useEffect(() => {
//     if (error) {
//       Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
//     }
//   }, [error]);

//   const submitHandler = useCallback(async () => {
//     if (!formState.formIsValid) {
//       Alert.alert('Wrong input!', 'Please check the errors in the form.', [
//         { text: 'Okay' }
//       ]);
//       return;
//     }
//     setError(null);
//     setIsLoading(true);
//     try {
//       if (editedProduct) {
//         await dispatch(
//           productsActions.updateProduct(
//             prodId,
//             formState.inputValues.title,
//             formState.inputValues.description,
//             formState.inputValues.imageUrl
//           )
//         );
//       } else {
//         await dispatch(
//           productsActions.createProduct(
//             formState.inputValues.title,
//             formState.inputValues.description,
//             formState.inputValues.imageUrl,
//             +formState.inputValues.price
//           )
//         );
//       }
//       props.navigation.goBack();
//     } catch (err) {
//       setError(err.message);
//     }

//     setIsLoading(false);

//   }, [dispatch, prodId, formState]);

//   useEffect(() => {
//     props.navigation.setParams({ submit: submitHandler });
//   }, [submitHandler]);

//   const inputChangeHandler = useCallback(
//     (inputIdentifier, inputValue, inputValidity) => {
//       dispatchFormState({
//         type: FORM_INPUT_UPDATE,
//         value: inputValue,
//         isValid: inputValidity,
//         input: inputIdentifier
//       });
//     },
//     [dispatchFormState]
//   );

//   if (isLoading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior="padding"
//       keyboardVerticalOffset={100}
//     >
//       <ScrollView>
//         <View style={styles.form}>
//           <Input
//             id="title"
//             label="Title"
//             errorText="Please enter a valid title!"
//             keyboardType="default"
//             autoCapitalize="sentences"
//             autoCorrect
//             returnKeyType="next"
//             onInputChange={inputChangeHandler}
//             initialValue={editedProduct ? editedProduct.title : ''}
//             initiallyValid={!!editedProduct}
//             required
//           />
//           <Input
//             id="imageUrl"
//             label="Image Url"
//             errorText="Please enter a valid image url!"
//             keyboardType="default"
//             returnKeyType="next"
//             onInputChange={inputChangeHandler}
//             initialValue={editedProduct ? editedProduct.imageUrl : ''}
//             initiallyValid={!!editedProduct}
//             required
//           />
//           {editedProduct ? null : (
//             <Input
//               id="price"
//               label="Price"
//               errorText="Please enter a valid price!"
//               keyboardType="decimal-pad"
//               returnKeyType="next"
//               onInputChange={inputChangeHandler}
//               required
//               min={0.1}
//             />
//           )}
//           <Input
//             id="description"
//             label="Description"
//             errorText="Please enter a valid description!"
//             keyboardType="default"
//             autoCapitalize="sentences"
//             autoCorrect
//             multiline
//             numberOfLines={3}
//             onInputChange={inputChangeHandler}
//             initialValue={editedProduct ? editedProduct.description : ''}
//             initiallyValid={!!editedProduct}
//             required
//             minLength={5}
//           />
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// EditProductScreen.navigationOptions = navData => {
//   const submitFn = navData.navigation.getParam('submit');
//   return {
//     headerTitle: navData.navigation.getParam('productId')
//       ? 'Edit Product'
//       : 'Add Product',
//     headerRight: (
//       <HeaderButtons HeaderButtonComponent={HeaderButton}>
//         <Item
//           title="Save"
//           iconName={
//             Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
//           }
//           onPress={submitFn}
//         />
//       </HeaderButtons>
//     )
//   };
// };

// const styles = StyleSheet.create({
//   form: {
//     margin: 20
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   }
// });

// export default EditProductScreen;
