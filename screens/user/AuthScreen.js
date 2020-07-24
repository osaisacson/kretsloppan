import Icon from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  ImageBackground,
  Keyboard,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Avatar, Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
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

const AuthScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSignup, setIsSignup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [placeholderPic, setPlaceholderPic] = useState('');
  //Permissions for camera
  const verifyPermissions = async () => {
    const result = await Permissions.askAsync(
      //Will open up a prompt (on iOS particularly) and wait until the user clicks ok
      Permissions.CAMERA_ROLL, //permissions for gallery
      Permissions.CAMERA //permissions for taking photo
    );
    if (result.status !== 'granted') {
      Alert.alert('Å Nej!', 'Du måste tillåta att öppna kameran för att kunna ta ett kort.', [
        { text: 'Ok' },
      ]);
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
      quality: 0.3,
    });

    setPlaceholderPic(image.uri); //show image from local storage
    setSelectedImage(image.base64); //Forwards the taken picture as base64
  };

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
      profileName: '',
      profileDescription: '',
      phone: '',
      address: '',
      defaultPickupDetails: '',
      image: '',
    },
    inputValidities: {
      email: false,
      password: false,
      profileName: !isSignup,
      profileDescription: true,
      phone: !isSignup,
      address: !isSignup,
      defaultPickupDetails: true,
      image: !!(!isSignup && selectedImage),
    },
    formIsValid: false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert('Oj, något gick åt pipsvängen!', error, [{ text: 'OK' }]);
      setIsLoading(false);
    }
  }, [error]);

  const authHandler = async () => {
    let action;
    if (isSignup && !selectedImage) {
      Alert.alert('Å Nej!', 'Du måste välja en profilbild först', [{ text: 'Ok' }]);
      setIsLoading(false);
      return;
    }
    if (isSignup) {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password,
        formState.inputValues.profileName,
        formState.inputValues.profileDescription,
        formState.inputValues.phone,
        formState.inputValues.address,
        formState.inputValues.defaultPickupDetails,
        selectedImage
      );
      setIsLoading(true);
    } else {
      action = authActions.login(formState.inputValues.email, formState.inputValues.password);
      setIsLoading(true);
    }
    setIsLoading(false);
    setError(null);
    try {
      dispatch(action);
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAwareScrollView
        style={{ backgroundColor: '#000' }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.screen}
        scrollEnabled={false}>
        <ImageBackground
          source={{
            uri:
              'https://images.unsplash.com/photo-1496439653932-606caa506e0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2011&q=80',
          }}
          resizeMode="cover"
          style={styles.backgroundImage}>
          <Card style={isSignup ? styles.authContainerLarge : styles.authContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled">
              {isSignup ? (
                <>
                  <View style={styles.imagePicker}>
                    <View style={styles.imagePreview}>
                      {!placeholderPic ? (
                        <Button
                          mode="outlined"
                          onPress={takeImageHandler}
                          style={{
                            backgroundColor: 'transparent',
                            borderRadius: 100 / 2,
                          }}
                          contentStyle={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 80,
                            height: 80,
                            width: 80,
                            borderRadius: 100 / 2,
                            borderColor: '#a9a9a9',
                            borderWidth: 0.5,
                          }}>
                          <Icon name="camera" size={24} color="#666" />
                        </Button>
                      ) : (
                        <TouchableOpacity onPress={takeImageHandler}>
                          <Avatar.Image
                            style={{
                              padding: 0,
                              margin: 0,
                              color: '#fff',
                              backgroundColor: '#fff',
                            }}
                            source={
                              placeholderPic
                                ? { uri: placeholderPic }
                                : require('./../../assets/avatar-placeholder-image.png')
                            }
                            size={80}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  <Input
                    id="profileName"
                    placeholder="Användarnamn"
                    keyboardType="default"
                    required
                    autoCapitalize="none"
                    errorText="Skriv in ett användarnamn"
                    onInputChange={inputChangeHandler}
                    initialValue=""
                  />
                  <Input
                    id="profileDescription"
                    placeholder="Beskrivning"
                    keyboardType="default"
                    autoCapitalize="none"
                    errorText="Skriv in en kort beskrivning"
                    onInputChange={inputChangeHandler}
                    initialValue=""
                  />
                  <Input
                    id="phone"
                    placeholder="Telefonnummer"
                    keyboardType="number-pad"
                    required
                    autoCapitalize="none"
                    errorText="Lägg in ett kontaktnummer"
                    onInputChange={inputChangeHandler}
                    initialValue=""
                  />

                  <Input
                    id="address"
                    placeholder="Address"
                    keyboardType="default"
                    required
                    autoCapitalize="none"
                    errorText="Skriv in addressen återbruket vanligtvis kan hämtas på"
                    onInputChange={inputChangeHandler}
                    initialValue=""
                  />
                  <Input
                    id="defaultPickupDetails"
                    placeholder="Tillgänglighet, öppettider (valfritt)"
                    keyboardType="default"
                    autoCapitalize="none"
                    errorText="Skriv in generella upphämtningsdetaljer"
                    onInputChange={inputChangeHandler}
                    initialValue=""
                  />
                </>
              ) : null}
              <Input
                id="email"
                placeholder="Email"
                keyboardType="email-address"
                required
                email
                autoCapitalize="none"
                errorText="Skriv in en giltig e-post, den kommer också vara ditt inloggningsnamn"
                onInputChange={inputChangeHandler}
                initialValue=""
              />
              <Input
                id="password"
                placeholder="Password"
                keyboardType="default"
                secureTextEntry
                required
                minLength={5}
                autoCapitalize="none"
                errorText="Skriv in ett giltigt lösenord"
                onInputChange={inputChangeHandler}
                initialValue=""
              />
              <View style={styles.buttonContainer}>
                {isLoading ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <Button
                    color="#000"
                    mode="outlined"
                    contentStyle={{
                      justifyContent: 'center',
                      borderWidth: 0.25,
                    }}
                    labelStyle={{
                      paddingTop: 13,
                      paddingBottom: 9,
                      fontFamily: 'bebas-neue-bold',
                      fontSize: 28,
                    }}
                    onPress={authHandler}>
                    {isSignup ? 'Gå med' : 'Logga in'}
                  </Button>
                )}
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  color={isSignup ? Colors.darkPrimary : Colors.primary}
                  mode="contained"
                  style={{
                    width: '60%',
                    alignSelf: 'center',
                  }}
                  labelStyle={{
                    paddingTop: 2,
                    fontFamily: 'bebas-neue-bold',
                    fontSize: 12,
                  }}
                  compact
                  onPress={() => {
                    setIsSignup((prevState) => !prevState);
                  }}>
                  {`Byt till ${isSignup ? 'logga in' : 'skapa konto'}`}
                </Button>
              </View>
            </ScrollView>
          </Card>
        </ImageBackground>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

const d = Dimensions.get('window');

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    width: d.width,
    height: d.height,
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  authContainerLarge: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 800,
    padding: 20,
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 15,
  },

  buttonContainer: {
    marginTop: 10,
  },
});

export default AuthScreen;
