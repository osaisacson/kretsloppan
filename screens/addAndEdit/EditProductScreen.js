import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Button } from 'react-native-paper';

//Components
import { Alert, TextInput, Text, View, Image, StyleSheet } from 'react-native';
import FormWrapper from '../../components/wrappers/FormWrapper';
import {
  FormFieldWrapper,
  formStyles
} from '../../components/wrappers/FormFieldWrapper';
import IconItem from '../../components/UI/IconItem';
import HorizontalScrollContainer from '../../components/UI/HorizontalScrollContainer';

//Actions
import * as productsActions from '../../store/actions/products';

//Data
import { PART, CONDITION, OTHER } from './../../data/categories';

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
  const prodId = props.route.params ? props.route.params.detailId : null; //Get the id of the currently edited product, passed from previous screen
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
  const [selectedCategory, setSelectedCategory] = useState(
    editedProduct ? editedProduct.categoryName : 'Inget'
  );
  const [placeholderPic, setPlaceholderPic] = useState(
    editedProduct ? editedProduct.image : ''
  ); //Set placeholder to be a previously taken picture if we have one.
  const [selectedImage, setSelectedImage] = useState(
    editedProduct ? editedProduct.image : ''
  ); //Set state to be a previously taken picture if we have one.

  const dispatch = useDispatch();

  const defaultAddress = currentUser.address ? currentUser.address : '';
  const defaultPhone = currentUser.phone ? currentUser.phone : '';

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : '',
      description: editedProduct ? editedProduct.description : '',
      price: editedProduct ? editedProduct.price : '',
      address: editedProduct ? editedProduct.address : defaultAddress, //set current address as default if have one
      phone: editedProduct ? editedProduct.phone : defaultPhone //set current phone as default if have one
    },
    inputValidities: {
      title: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
      address: true,
      phone: true
    },
    formIsValid: editedProduct ? true : false
  });

  //Permissions for camera
  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(
      //Will open up a prompt (on iOS particularly) and wait until the user clicks ok
      Permissions.CAMERA_ROLL, //permissions for gallery
      Permissions.CAMERA //permissions for taking photo
    );
    if (result.status !== 'granted') {
      Alert.alert(
        'Å Nej!',
        'Du måste tillåta att öppna kameran för att kunna ta ett kort.',
        [{ text: 'Ok' }]
      );
      return false;
    }
    return true;
  };

  //Opens up the camera
  const takeImageHandler = async () => {
    const hasPermission = await verifyPermissions(); //Checks the permissions we define in verifyPermissions
    if (!hasPermission) {
      return;
    }
    const image = await ImagePicker.launchImageLibraryAsync({
      //We could also open the camera here instead of the gallery
      base64: true, //lets us get and use the base64 encoded image to pass to storage
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6
    });

    setPlaceholderPic(image.uri); //show image from local storage
    setSelectedImage(image.base64); //Forwards the taken picture as base64
  };

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
        console.log('--------EDIT PRODUCT: dispatch--------');
        console.log('prodId:', prodId);
        console.log('selectedCategory:', selectedCategory);
        console.log('title:', formState.inputValues.title);
        console.log('description:', formState.inputValues.description);
        console.log('price:', +formState.inputValues.price);
        console.log('image:', selectedImage);
        console.log('address:', formState.inputValues.address);
        console.log('phone:', +formState.inputValues.phone);
        console.log('---------------------------------------');
        await dispatch(
          productsActions.updateProduct(
            prodId,
            selectedCategory,
            formState.inputValues.title,
            formState.inputValues.description,
            +formState.inputValues.price,
            selectedImage,
            formState.inputValues.address,
            +formState.inputValues.phone
          )
        );
      } else {
        console.log('--------CREATE PRODUCT: dispatch--------');
        console.log('selectedCategory:', selectedCategory);
        console.log('title:', formState.inputValues.title);
        console.log('description:', formState.inputValues.description);
        console.log('price:', +formState.inputValues.price);
        console.log('image:', selectedImage);
        console.log('address:', formState.inputValues.address);
        console.log('phone:', +formState.inputValues.phone);
        console.log('---------------------------------------');
        await dispatch(
          productsActions.createProduct(
            selectedCategory,
            formState.inputValues.title,
            formState.inputValues.description,
            +formState.inputValues.price,
            selectedImage,
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
    console.log('-------TEXTCHANGEHANDLER, received values-------');
    console.log('inputIdentifier:', inputIdentifier);
    console.log('text:', text);
    console.log('------------------------------------------------');

    let isValid = true;

    // //If we haven't entered any value (its empty) set form validity to false
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
    <FormWrapper
      submitButtonText="Spara Återbruk"
      handlerForButtonSubmit={submitHandler}
      isLoading={isLoading}
    >
      <FormFieldWrapper
        showPromptIf={!formState.inputValues.image}
        prompt="Välj en bild av återbruket"
      >
        <View style={styles.imagePicker}>
          <View style={styles.imagePreview}>
            {!placeholderPic ? (
              <Text>Lägg upp en bild</Text>
            ) : (
              <Image style={styles.image} source={{ uri: placeholderPic }} /> //Originally uses the locally stored image as a placeholder
            )}
          </View>
          <Button icon="camera" mode="contained" onPress={takeImageHandler}>
            Välj en bild
          </Button>
        </View>
      </FormFieldWrapper>
      <FormFieldWrapper
        showPromptIf={!formState.inputValues.title}
        prompt="Skriv in en titel"
      >
        <TextInput
          placeholder="Titel"
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
        showPromptIf={!formState.inputValues.price}
        prompt="Lägg in ett pris (det kan vara 0)"
      >
        <TextInput
          placeholder="Pris - Om du lägger upp som företag, ange pris inklusive moms"
          style={formStyles.input}
          value={formState.inputValues.price.toString()}
          onChangeText={textChangeHandler.bind(this, 'price')}
          keyboardType="number-pad"
          autoCorrect={false}
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper
        showPromptIf={!formState.inputValues.description}
        prompt="Skriv in en kort beskrivning"
      >
        <TextInput
          placeholder="Beskrivning"
          style={formStyles.input}
          value={formState.inputValues.description}
          multiline
          numberOfLines={4}
          onChangeText={textChangeHandler.bind(this, 'description')}
          autoCorrect={false}
          returnKeyType="next"
        />
      </FormFieldWrapper>
      {/* Part of the building */}
      <FormFieldWrapper
        label="Kategori"
        showPromptIf={!selectedCategory}
        prompt="Välj en kategori"
      >
        <HorizontalScrollContainer scrollHeight={90}>
          {PART.map(item => (
            <IconItem
              itemData={item}
              key={item.id}
              isHorizontal={true}
              isSelected={selectedCategory === item.title}
              onSelect={
                () => {
                  setSelectedCategory(item.title);
                  console.log('selectedCategory', selectedCategory);
                  console.log('clicked category: ', item.title);
                }
                // (setSelectedCategory(item.title),
                // textChangeHandler.bind(item.title, 'categoryName')
                // console.log('selectedCategory: ', selectedCategory),
                // console.log('item clicked: ', item),
                // console.log(
                //   'formState.inputValues.categoryName: ',
                //   formState.inputValues.categoryName
                // ))
              }
            />
          ))}
        </HorizontalScrollContainer>
      </FormFieldWrapper>

      {/* Condition of the item */}
      <HorizontalScrollContainer scrollHeight={90}>
        {CONDITION.map(item => (
          <IconItem
            itemData={item}
            key={item.id}
            isHorizontal={true}
            onSelect={() => {}}
          />
        ))}
      </HorizontalScrollContainer>
      {/* Something else of the item */}
      <HorizontalScrollContainer scrollHeight={90}>
        {OTHER.map(item => (
          <IconItem
            itemData={item}
            key={item.id}
            isHorizontal={true}
            onSelect={() => {}}
          />
        ))}
      </HorizontalScrollContainer>
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
        showPromptIf={!formState.inputValues.address}
        prompt="Den address återbruket kan hämtas på"
      >
        <TextInput
          placeholder="Address"
          style={formStyles.input}
          value={formState.inputValues.address}
          onChangeText={textChangeHandler.bind(this, 'address')}
          keyboardType="default"
          autoCorrect={false}
          returnKeyType="next"
        />
      </FormFieldWrapper>
      <FormFieldWrapper
        showPromptIf={!formState.inputValues.phone}
        prompt="Det telefonnummer man bäst kan kontakta dig på "
      >
        <TextInput
          placeholder="Telefon"
          style={formStyles.input}
          value={formState.inputValues.phone.toString()}
          onChangeText={textChangeHandler.bind(this, 'phone')}
          keyboardType="number-pad"
          autoCorrect={false}
          returnKeyType="done"
        />
      </FormFieldWrapper>
    </FormWrapper>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: 'center',
    marginBottom: 15
  },
  imagePreview: {
    width: '100%',
    height: 300,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1
  },
  image: {
    width: '100%',
    height: '100%'
  }
});

export const screenOptions = navData => {
  const routeParams = navData.route.params ? navData.route.params : {};
  return {
    headerTitle: routeParams.detailId
      ? 'Redigera återbruk'
      : 'Lägg till återbruk'
  };
};

export default EditProductScreen;
