import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { Alert, TextInput, View, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import HorizontalScrollContainer from '../../components/UI/HorizontalScrollContainer';
import ImagePicker from '../../components/UI/ImgPicker';
import Loader from '../../components/UI/Loader';
import PickerItem from '../../components/UI/PickerItem';
import { FormFieldWrapper, formStyles } from '../../components/wrappers/FormFieldWrapper';
import FormWrapper from '../../components/wrappers/FormWrapper';
import * as productsActions from '../../store/actions/products';
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

  //Find the profile that matches the id of the currently logged in User
  const currentProfile = useSelector((state) => state.profiles.userProfile || {});

  //Find product
  const loggedInUserId = currentProfile.profileId;
  const availableProducts = useSelector((state) => state.products.availableProducts);
  const userProducts = availableProducts.filter((prod) => prod.ownerId === loggedInUserId);
  const editedProduct = userProducts.find((prod) => prod.id === prodId);

  //Set states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const dispatch = useDispatch();

  const defaultAddress = currentProfile.address ? currentProfile.address : '';
  const defaultLocation = currentProfile.location ? currentProfile.location : '';
  const defaultPhone = currentProfile.phone ? currentProfile.phone : '';
  const defaultPickupDetails = currentProfile.defaultPickupDetails
    ? currentProfile.defaultPickupDetails
    : '';

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : '',
      amount: editedProduct ? editedProduct.amount : '',
      description: editedProduct ? editedProduct.description : '',
      background: editedProduct ? editedProduct.background : '',
      internalComments: editedProduct ? editedProduct.internalComments : '',
      length: editedProduct ? editedProduct.length : '',
      height: editedProduct ? editedProduct.height : '',
      width: editedProduct ? editedProduct.width : '',
      price: editedProduct ? editedProduct.price : '',
      priceText: editedProduct ? editedProduct.priceText : '',
      address: editedProduct ? editedProduct.address : defaultAddress, //set current address as default if have one
      location: editedProduct ? editedProduct.location : defaultLocation, //set current location as default if have one
      pickupDetails: editedProduct ? editedProduct.pickupDetails : defaultPickupDetails, //set pickup details the user entered in their profile as default if they have them
      phone: editedProduct ? editedProduct.phone : defaultPhone, //set current phone as default if have one
      image: editedProduct ? editedProduct.image : '',
      category: editedProduct ? editedProduct.category : 'Ingen',
      condition: editedProduct ? editedProduct.condition : 'Inget',
      style: editedProduct ? editedProduct.style : 'Ingen',
      material: editedProduct ? editedProduct.material : 'Blandade',
      color: editedProduct ? editedProduct.color : 'Omålad',
    },
    inputValidities: {
      title: !!editedProduct,
      amount: true,
      description: true,
      background: true,
      internalComments: true,
      length: true,
      height: true,
      width: true,
      price: true,
      priceText: true,
      address: true,
      location: true,
      pickupDetails: true,
      phone: true,
      image: !!editedProduct,
      category: true,
      condition: true,
      style: true,
      material: true,
      color: true,
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
        'Det verkar som något saknas i formuläret, kolla så du fyllt i titel och lagt upp en bild.',
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
            formState.inputValues.category,
            formState.inputValues.condition,
            formState.inputValues.style,
            formState.inputValues.material,
            formState.inputValues.color,
            formState.inputValues.title,
            +formState.inputValues.amount,
            formState.inputValues.image,
            formState.inputValues.address,
            formState.inputValues.location,
            formState.inputValues.pickupDetails,
            +formState.inputValues.phone,
            formState.inputValues.description,
            formState.inputValues.background,
            +formState.inputValues.length,
            +formState.inputValues.height,
            +formState.inputValues.width,
            +formState.inputValues.price,
            formState.inputValues.priceText,
            formState.inputValues.internalComments
          )
        );
        props.navigation.navigate('ProductDetail', { detailId: prodId });
        setIsLoading(false);
      } else {
        await dispatch(
          productsActions.createProduct(
            formState.inputValues.category,
            formState.inputValues.condition,
            formState.inputValues.style,
            formState.inputValues.material,
            formState.inputValues.color,
            formState.inputValues.title,
            +formState.inputValues.amount,
            formState.inputValues.image,
            formState.inputValues.address,
            formState.inputValues.location,
            formState.inputValues.pickupDetails,
            +formState.inputValues.phone,
            formState.inputValues.description,
            formState.inputValues.background,
            +formState.inputValues.length,
            +formState.inputValues.height,
            +formState.inputValues.width,
            +formState.inputValues.price,
            formState.inputValues.priceText,
            formState.inputValues.internalComments
          )
        );
        props.navigation.goBack();
        setIsLoading(false);
      }
    } catch (err) {
      setError(err.message);
    }
  }, [dispatch, prodId, formState]);

  //Manages validation of title input
  const textChangeHandler = (inputIdentifier, text) => {
    //inputIdentifier and text will act as key:value in the form reducer

    let isValid = true;

    //If we haven't entered any value (its empty) set form validity to false
    if (inputIdentifier === 'title' && text.trim().length === 0) {
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
          placeholder="Titel (max 40 bokstäver)"
          maxLength={40}
          style={formStyles.input}
          value={formState.inputValues.title}
          onChangeText={textChangeHandler.bind(this, 'title')}
          keyboardType="default"
          autoCapitalize="sentences"
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper prompt="Skriv in antal produkter">
        <TextInput
          placeholder="Antal"
          maxLength={40}
          style={formStyles.input}
          value={formState.inputValues.amount.toString()}
          onChangeText={textChangeHandler.bind(this, 'amount')}
          keyboardType="number-pad"
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <Text style={{ fontFamily: 'roboto-bold' }}>
        Notera att betalning hanteras utanför appen.
      </Text>
      <Text style={{ fontFamily: 'roboto-light-italic' }}>
        För företag: ange pris inklusive moms
      </Text>

      <View style={{ flex: 1, flexDirection: 'row' }}>
        <TextInput
          placeholder="Styckpris"
          style={{ ...formStyles.input, width: 100 }}
          value={formState.inputValues.price.toString()}
          onChangeText={textChangeHandler.bind(this, 'price')}
          keyboardType="number-pad"
          returnKeyType="next"
        />
        <Text style={{ marginTop: 20, fontFamily: 'roboto-light-italic', padding: 5 }}>Eller</Text>
        <TextInput
          placeholder="Alternativt pris - eg 'ett tjog ägg"
          style={formStyles.input}
          value={formState.inputValues.priceText}
          onChangeText={textChangeHandler.bind(this, 'priceText')}
          keyboardType="default"
          returnKeyType="next"
        />
      </View>
      <FormFieldWrapper prompt="Skriv in eventuella kommentarer">
        <TextInput
          placeholder="Kommentarer"
          style={formStyles.multilineInput}
          value={formState.inputValues.description}
          multiline
          numberOfLines={4}
          onChangeText={textChangeHandler.bind(this, 'description')}
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper
        prompt="Skriv in historik eller annan kuriosa om återbruket"
        subLabel="Det här kommer synas som en del av historien i det projekt återbruket sedan används i, så berätta gärna så mycket du kan om föremålets historia och annan kuriosa.">
        <TextInput
          placeholder="Kuriosa/Historik"
          style={formStyles.multilineInput}
          value={formState.inputValues.background}
          multiline
          numberOfLines={4}
          onChangeText={textChangeHandler.bind(this, 'background')}
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper prompt="Skriv in interna kommentarer, som ID -nummer ">
        <TextInput
          placeholder="Intern referens (om tillämpligt)"
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
            placeholder="Längd (mm)"
            style={formStyles.input}
            value={formState.inputValues.length}
            onChangeText={textChangeHandler.bind(this, 'length')}
            keyboardType="number-pad"
            returnKeyType="next"
          />
          <TextInput
            placeholder="Höjd (mm)"
            style={formStyles.input}
            value={formState.inputValues.height}
            onChangeText={textChangeHandler.bind(this, 'height')}
            keyboardType="number-pad"
            returnKeyType="next"
          />
          <TextInput
            placeholder="Bredd (mm)"
            style={formStyles.input}
            value={formState.inputValues.width}
            onChangeText={textChangeHandler.bind(this, 'width')}
            keyboardType="number-pad"
            returnKeyType="next"
          />
        </View>
      </FormFieldWrapper>
      <FormFieldWrapper label="Upphämtningsaddress" prompt="Den address återbruket kan hämtas på">
        <TextInput
          placeholder="Address"
          style={formStyles.input}
          value={formState.inputValues.address}
          onChangeText={textChangeHandler.bind(this, 'address')}
          keyboardType="default"
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper label="Upphämtningsort" prompt="Den ort återbruket kan hämtas på">
        <TextInput
          placeholder="Ort"
          style={formStyles.input}
          value={formState.inputValues.location}
          onChangeText={textChangeHandler.bind(this, 'location')}
          keyboardType="default"
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper label="Upphämtningsdetaljer" prompt="Detaljer om upphämtning">
        <TextInput
          placeholder="Detaljer runt upphämtning"
          style={formStyles.input}
          value={formState.inputValues.pickupDetails}
          onChangeText={textChangeHandler.bind(this, 'pickupDetails')}
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
        <HorizontalScrollContainer scrollHeight={100}>
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
        <HorizontalScrollContainer scrollHeight={100}>
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
        <HorizontalScrollContainer scrollHeight={100}>
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
        <HorizontalScrollContainer scrollHeight={100}>
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
        <HorizontalScrollContainer scrollHeight={100}>
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
