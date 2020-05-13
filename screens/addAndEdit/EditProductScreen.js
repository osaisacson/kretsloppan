import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ImagePicker from '../../components/UI/ImgPicker';

//Components
import { Alert, TextInput, StyleSheet } from 'react-native';
import FormWrapper from '../../components/wrappers/FormWrapper';
import {
  FormFieldWrapper,
  formStyles,
} from '../../components/wrappers/FormFieldWrapper';
import PickerItem from '../../components/UI/PickerItem';
import Loader from '../../components/UI/Loader';
import HorizontalScrollContainer from '../../components/UI/HorizontalScrollContainer';

//Actions
import * as productsActions from '../../store/actions/products';

//Data
import { PART, CONDITION } from './../../data/categories';

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

const EditProductScreen = (props) => {
  const prodId = props.route.params ? props.route.params.detailId : null; //Get the id of the currently edited product, passed from previous screen
  const loggedInUserId = useSelector((state) => state.auth.userId);

  //Find the profile that matches the id of the currently logged in User
  const currentUser = useSelector((state) =>
    state.profiles.allProfiles.find((prof) => prof.profileId === loggedInUserId)
  );

  //Find product
  const editedProduct = useSelector((state) =>
    state.products.userProducts.find((prod) => prod.id === prodId)
  );

  //Set states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedCondition, setSelectedCondition] = useState();

  const dispatch = useDispatch();

  const defaultAddress = currentUser.address ? currentUser.address : '';
  const defaultPhone = currentUser.phone ? currentUser.phone : '';

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : '',
      description: editedProduct ? editedProduct.description : '',
      price: editedProduct ? editedProduct.price : '',
      address: editedProduct ? editedProduct.address : defaultAddress, //set current address as default if have one
      phone: editedProduct ? editedProduct.phone : defaultPhone, //set current phone as default if have one
      image: editedProduct ? editedProduct.image : '',
    },
    inputValidities: {
      title: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
      address: true,
      phone: true,
      image: editedProduct ? true : false,
    },
    formIsValid: editedProduct ? true : false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert('Oj! Något gick fel, försök igen.', error, [{ text: 'OK' }]);
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
        dispatch(
          productsActions.updateProduct(
            prodId,
            selectedCategory,
            selectedCondition,
            formState.inputValues.title,
            formState.inputValues.image,
            formState.inputValues.address,
            +formState.inputValues.phone,
            formState.inputValues.description,
            +formState.inputValues.price
          )
        );
      } else {
        dispatch(
          productsActions.createProduct(
            selectedCategory,
            selectedCondition,
            formState.inputValues.title,
            formState.inputValues.image,
            formState.inputValues.address,
            +formState.inputValues.phone,
            formState.inputValues.description,
            +formState.inputValues.price
          )
        );
      }
    } catch (err) {
      setError(err.message);
    }
    props.navigation.navigate('Min Sida');
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
      input: inputIdentifier,
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <FormWrapper
      submitButtonText="Spara Återbruk"
      handlerForButtonSubmit={submitHandler}
      isLoading={isLoading}
    >
      <FormFieldWrapper prompt="Välj en bild av återbruket">
        <ImagePicker
          onImageTaken={textChangeHandler.bind(this, 'image')}
          passedImage={formState.inputValues.image}
        />
      </FormFieldWrapper>
      <FormFieldWrapper prompt="Skriv in en titel">
        <TextInput
          placeholder="Titel"
          style={formStyles.input}
          value={formState.inputValues.title}
          onChangeText={textChangeHandler.bind(this, 'title')}
          keyboardType="default"
          autoCapitalize="sentences"
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper prompt="Lägg in ett pris (det kan vara 0)">
        <TextInput
          placeholder="Pris - Om du lägger upp som företag, ange pris inklusive moms"
          style={formStyles.input}
          value={formState.inputValues.price.toString()}
          onChangeText={textChangeHandler.bind(this, 'price')}
          keyboardType="number-pad"
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper prompt="Skriv in en kort beskrivning">
        <TextInput
          placeholder="Beskrivning"
          style={formStyles.multilineInput}
          value={formState.inputValues.description}
          multiline
          numberOfLines={4}
          onChangeText={textChangeHandler.bind(this, 'description')}
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper
        label="Upphämtningsdetaljer"
        prompt="Den address återbruket kan hämtas på"
      >
        <TextInput
          placeholder="Address"
          style={formStyles.input}
          value={formState.inputValues.address}
          onChangeText={textChangeHandler.bind(this, 'address')}
          keyboardType="default"
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper prompt="Det telefonnummer man bäst kan kontakta dig på ">
        <TextInput
          placeholder="Telefon"
          style={formStyles.input}
          value={formState.inputValues.phone.toString()}
          onChangeText={textChangeHandler.bind(this, 'phone')}
          keyboardType="number-pad"
          returnKeyType="done"
        />
      </FormFieldWrapper>
      {/* Part of the building */}
      <FormFieldWrapper label="Kategori" prompt="Välj en kategori">
        <HorizontalScrollContainer scrollHeight={90}>
          {PART.map((item) => (
            <PickerItem
              itemData={item}
              key={item.id}
              isHorizontal={true}
              isSelected={selectedCategory === item.title}
              onSelect={() => {
                setSelectedCategory(item.title);
              }}
            />
          ))}
        </HorizontalScrollContainer>
      </FormFieldWrapper>

      {/* Condition of the item */}
      <FormFieldWrapper
        label="Skick"
        prompt="Välj skick på ditt upplagda återbruk"
      >
        <HorizontalScrollContainer scrollHeight={90}>
          {CONDITION.map((item) => (
            <PickerItem
              itemData={item}
              key={item.id}
              isHorizontal={true}
              isSelected={selectedCondition === item.title}
              onSelect={() => {
                setSelectedCondition(item.title);
              }}
            />
          ))}
        </HorizontalScrollContainer>
      </FormFieldWrapper>
    </FormWrapper>
  );
};

export const screenOptions = (navData) => {
  const routeParams = navData.route.params ? navData.route.params : {};
  return {
    headerTitle: routeParams.detailId
      ? 'Redigera återbruk'
      : 'Lägg till återbruk',
  };
};

export default EditProductScreen;
