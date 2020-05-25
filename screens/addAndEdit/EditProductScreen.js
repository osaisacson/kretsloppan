import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { Alert, TextInput, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import HorizontalScrollContainer from '../../components/UI/HorizontalScrollContainer';
import ImagePicker from '../../components/UI/ImgPicker';
//Imports
import Loader from '../../components/UI/Loader';
import PickerItem from '../../components/UI/PickerItem';
import { FormFieldWrapper, formStyles } from '../../components/wrappers/FormFieldWrapper';
import FormWrapper from '../../components/wrappers/FormWrapper';
//Actions
import * as productsActions from '../../store/actions/products';
//Data
import { PART, CONDITION, STYLE, MATERIAL, COLOR } from './../../data/filters';

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

  const dispatch = useDispatch();

  const defaultAddress = currentUser.address ? currentUser.address : '';
  const defaultPhone = currentUser.phone ? currentUser.phone : '';

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : '',
      description: editedProduct ? editedProduct.description : '',
      internalComments: editedProduct ? editedProduct.internalComments : '',
      length: editedProduct ? editedProduct.length : '',
      height: editedProduct ? editedProduct.height : '',
      width: editedProduct ? editedProduct.width : '',
      price: editedProduct ? editedProduct.price : '',
      address: editedProduct ? editedProduct.address : defaultAddress, //set current address as default if have one
      phone: editedProduct ? editedProduct.phone : defaultPhone, //set current phone as default if have one
      image: editedProduct ? editedProduct.image : '',
      category: editedProduct ? editedProduct.category : 'Ingen',
      condition: editedProduct ? editedProduct.condition : 'Inget',
      style: editedProduct ? editedProduct.style : 'Ingen',
      material: editedProduct ? editedProduct.material : 'Inget',
      color: editedProduct ? editedProduct.color : 'Ingen',
    },
    inputValidities: {
      title: !!editedProduct,
      description: !!editedProduct,
      internalComments: true,
      length: true,
      height: true,
      width: true,
      price: !!editedProduct,
      address: true,
      phone: true,
      image: !!editedProduct,
      category: !!editedProduct,
      condition: !!editedProduct,
      style: !!editedProduct,
      material: !!editedProduct,
      color: !!editedProduct,
    },
    formIsValid: !!editedProduct,
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
        'Det verkar som något saknas i formuläret, kolla så du fyllt i alla fält.',
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
            formState.inputValues.category,
            formState.inputValues.condition,
            formState.inputValues.style,
            formState.inputValues.material,
            formState.inputValues.color,
            formState.inputValues.title,
            formState.inputValues.image,
            formState.inputValues.address,
            +formState.inputValues.phone,
            formState.inputValues.description,
            formState.inputValues.length,
            formState.inputValues.height,
            formState.inputValues.width,
            +formState.inputValues.price,
            formState.inputValues.internalComments
          )
        );
      } else {
        dispatch(
          productsActions.createProduct(
            formState.inputValues.category,
            formState.inputValues.condition,
            formState.inputValues.style,
            formState.inputValues.material,
            formState.inputValues.color,
            formState.inputValues.title,
            formState.inputValues.image,
            formState.inputValues.address,
            +formState.inputValues.phone,
            formState.inputValues.description,
            formState.inputValues.length,
            formState.inputValues.height,
            formState.inputValues.width,
            +formState.inputValues.price,
            formState.inputValues.internalComments
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
      isValid,
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
      isLoading={isLoading}>
      <FormFieldWrapper prompt="Välj en bild av återbruket">
        <ImagePicker
          onImageTaken={textChangeHandler.bind(this, 'image')}
          passedImage={formState.inputValues.image}
        />
      </FormFieldWrapper>
      <FormFieldWrapper prompt="Skriv in en titel">
        <TextInput
          placeholder="Titel (max 30 bokstäver)"
          maxLength={30}
          style={formStyles.input}
          value={formState.inputValues.title}
          onChangeText={textChangeHandler.bind(this, 'title')}
          keyboardType="default"
          autoCapitalize="sentences"
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper
        prompt="Lägg in ett pris (det kan vara 0)"
        highlightedSubLabel="Notera att betalning hanteras utanför appen. "
        subLabel="Kan anges antingen i formatet direkt pris, 'förhandlingsbart' eller 'ett tjog ägg', om man så vill. För företag: ange pris inklusive moms">
        <TextInput
          placeholder="Styckpris"
          style={formStyles.input}
          value={formState.inputValues.price.toString()}
          onChangeText={textChangeHandler.bind(this, 'price')}
          keyboardType="default"
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
      <FormFieldWrapper prompt="Skriv in interna kommentarer, som ID -nummer ">
        <TextInput
          placeholder="Intern listning (om tillämpligt)"
          style={formStyles.input}
          value={formState.inputValues.internalComments}
          onChangeText={textChangeHandler.bind(this, 'internalComments')}
          keyboardType="default"
          autoCapitalize="sentences"
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper prompt="Skriv in en längd, höjd och/eller bredd">
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TextInput
            placeholder="Längd"
            style={formStyles.input}
            value={formState.inputValues.length}
            onChangeText={textChangeHandler.bind(this, 'length')}
            returnKeyType="next"
          />
          <TextInput
            placeholder="Höjd"
            style={formStyles.input}
            value={formState.inputValues.height}
            onChangeText={textChangeHandler.bind(this, 'height')}
            returnKeyType="next"
          />
          <TextInput
            placeholder="Bredd"
            style={formStyles.input}
            value={formState.inputValues.width}
            onChangeText={textChangeHandler.bind(this, 'width')}
            returnKeyType="next"
          />
        </View>
      </FormFieldWrapper>
      <FormFieldWrapper label="Upphämtningsdetaljer" prompt="Den address återbruket kan hämtas på">
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
      {/* Category */}
      <FormFieldWrapper label="Kategori" prompt="Välj en kategori">
        <HorizontalScrollContainer scrollHeight={75}>
          {PART.map((item) => (
            <PickerItem
              title={item.title}
              color={item.color}
              key={item.id}
              isSelected={formState.inputValues.category === item.title}
              onSelect={textChangeHandler.bind(this, 'category', item.title)}
            />
          ))}
        </HorizontalScrollContainer>
      </FormFieldWrapper>
      {/* Condition */}
      <FormFieldWrapper label="Skick" prompt="Välj skick på ditt upplagda återbruk">
        <HorizontalScrollContainer scrollHeight={75}>
          {CONDITION.map((item) => (
            <PickerItem
              title={item.title}
              color={item.color}
              key={item.id}
              isSelected={formState.inputValues.condition === item.title}
              onSelect={textChangeHandler.bind(this, 'condition', item.title)}
            />
          ))}
        </HorizontalScrollContainer>
      </FormFieldWrapper>
      {/* Style */}
      <FormFieldWrapper label="Stil" prompt="Välj en stil">
        <HorizontalScrollContainer scrollHeight={75}>
          {STYLE.map((item) => (
            <PickerItem
              title={item.title}
              color={item.color}
              key={item.id}
              isSelected={formState.inputValues.style === item.title}
              onSelect={textChangeHandler.bind(this, 'style', item.title)}
            />
          ))}
        </HorizontalScrollContainer>
      </FormFieldWrapper>
      {/* Material */}
      <FormFieldWrapper label="Material" prompt="Välj ett material">
        <HorizontalScrollContainer scrollHeight={75}>
          {MATERIAL.map((item) => (
            <PickerItem
              title={item.title}
              color={item.color}
              key={item.id}
              isSelected={formState.inputValues.material === item.title}
              onSelect={textChangeHandler.bind(this, 'material', item.title)}
            />
          ))}
        </HorizontalScrollContainer>
      </FormFieldWrapper>
      {/* Color */}
      <FormFieldWrapper label="Färg" prompt="Välj en stil">
        <HorizontalScrollContainer scrollHeight={75}>
          {COLOR.map((item) => (
            <PickerItem
              title={item.title}
              color={item.color}
              key={item.id}
              isSelected={formState.inputValues.color === item.id}
              onSelect={textChangeHandler.bind(this, 'color', item.id)} //Special case, since we don't have a title on colors
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
    headerTitle: routeParams.detailId ? 'Redigera återbruk' : 'Lägg till återbruk',
  };
};

export default EditProductScreen;
