import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import { Picker, Alert, TextInput } from 'react-native';
import FormWrapper from '../../components/wrappers/FormWrapper';
import {
  FormFieldWrapper,
  formStyles
} from '../../components/wrappers/FormFieldWrapper';
import Filters from './../searchAndFilter/Filters';
import ImagePicker from '../../components/UI/ImgPicker';
import ButtonNormal from '../../components/UI/ButtonNormal';
//Constants
import Colors from '../../constants/Colors';
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
  const prodId = props.route.params ? props.route.params.detailId : null;
  const loggedInUserId = useSelector(state => state.auth.userId);

  //Find the profile that matches the id of the currently logged in User
  const currentUser = useSelector(state =>
    state.profiles.allProfiles.find(prof => prof.profileId === loggedInUserId)
  );

  //Find product
  const editedProduct = useSelector(state =>
    state.products.userProducts.find(prod => prod.id === prodId)
  );

  //Set states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [usePreviousAddress, setUsePreviousAddress] = useState(true);
  const [usePreviousPhone, setUsePreviousPhone] = useState(true);

  const dispatch = useDispatch();

  const setNewAddress = editedProduct ? editedProduct.address : '';
  const setNewPhone = editedProduct ? editedProduct.phone : '';

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      categoryName: editedProduct ? editedProduct.categoryName : '',
      title: editedProduct ? editedProduct.title : '',
      image: editedProduct ? editedProduct.image : '',
      description: editedProduct ? editedProduct.description : '',
      price: editedProduct ? editedProduct.price : '',
      address: usePreviousAddress ? currentUser.address : setNewAddress,
      phone: usePreviousPhone ? currentUser.phone : setNewPhone
    },
    inputValidities: {
      categoryName: editedProduct ? true : false,
      title: editedProduct ? true : false,
      image: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
      address: editedProduct ? true : false,
      phone: editedProduct ? true : false
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
            formState.inputValues.image,
            formState.inputValues.address,
            +formState.inputValues.phone
          )
        );
      } else {
        await dispatch(
          productsActions.createProduct(
            formState.inputValues.categoryName,
            formState.inputValues.title,
            formState.inputValues.description,
            +formState.inputValues.price,
            formState.inputValues.image,
            formState.inputValues.address,
            +formState.inputValues.phone
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

  const toggleUseAddressButton = () => {
    console.log('usePreviousAddress: ', usePreviousAddress);
    setUsePreviousAddress(prevState => !prevState);
  };

  const toggleUsePhoneButton = () => {
    console.log('usePreviousPhone: ', usePreviousPhone);
    setUsePreviousPhone(prevState => !prevState);
  };

  return (
    <FormWrapper
      submitButtonText="Spara Återbruk"
      handlerForButtonSubmit={submitHandler}
      isLoading={isLoading}
    >
      <FormFieldWrapper
        label="Bild av återbruket"
        showPromptIf={!formState.inputValues.image}
        prompt="Välj en bild av återbruket"
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
        label="Pris"
        subLabel="Om du lägger upp som företag, ange pris inklusive moms"
        showPromptIf={!formState.inputValues.price}
        prompt="Lägg in ett pris (det kan vara 0)"
      >
        <TextInput
          style={formStyles.input}
          value={formState.inputValues.price.toString()}
          onChangeText={textChangeHandler.bind(this, 'price')}
          keyboardType="number-pad"
          autoCorrect={false}
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper
        label="Beskrivning"
        showPromptIf={!formState.inputValues.description}
        prompt="Skriv in en kort beskrivning"
      >
        <TextInput
          style={formStyles.input}
          value={formState.inputValues.description}
          onChangeText={textChangeHandler.bind(this, 'description')}
          autoCorrect={false}
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <Filters />

      {/* <FormFieldWrapper
        label="Kategori"
        showPromptIf={!formState.inputValues.categoryName}
        prompt="Välj en kategori"
      >
        <Picker
          selectedValue={formState.inputValues.categoryName}
          onValueChange={textChangeHandler.bind(this, 'categoryName')}
        >
          <Picker.Item key={'tak'} label={'tak'} value={'tak'.toLowerCase()} />
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
      </FormFieldWrapper> */}
      <FormFieldWrapper
        label="Address"
        showPromptIf={!formState.inputValues.address}
        prompt="Den address återbruket kan hämtas på"
      >
        <ButtonNormal
          color={Colors.primary}
          disabled={!currentUser.address}
          actionOnPress={toggleUseAddressButton}
          text={
            usePreviousAddress
              ? 'Byt till ny address'
              : `Använd ${currentUser.address}`
          }
        />
        {usePreviousAddress ? null : (
          <TextInput
            style={formStyles.input}
            value={formState.inputValues.address}
            onChangeText={textChangeHandler.bind(this, 'address')}
            keyboardType="default"
            autoCorrect={false}
            returnKeyType="next"
          />
        )}
      </FormFieldWrapper>
      <FormFieldWrapper
        label="phone"
        showPromptIf={!formState.inputValues.phone}
        prompt="Det telefonnummer man bäst kan kontakta dig på "
      >
        <ButtonNormal
          color={Colors.primary}
          disabled={!currentUser.phone}
          actionOnPress={toggleUsePhoneButton}
          text={
            usePreviousPhone
              ? 'Byt till nytt nummer'
              : `Använd ${currentUser.phone}`
          }
        />
        {usePreviousPhone ? null : (
          <TextInput
            style={formStyles.input}
            value={formState.inputValues.phone.toString()}
            onChangeText={textChangeHandler.bind(this, 'phone')}
            keyboardType="number-pad"
            autoCorrect={false}
            returnKeyType="done"
          />
        )}
      </FormFieldWrapper>
    </FormWrapper>
  );
};

export const screenOptions = navData => {
  const routeParams = navData.route.params ? navData.route.params : {};
  return {
    headerTitle: routeParams.detailId
      ? 'Redigera återbruk'
      : 'Lägg till återbruk'
  };
};

export default EditProductScreen;
