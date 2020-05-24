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
//Components

import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';
//Actions
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
      image: '',
    },
    inputValidities: {
      email: false,
      password: false,
      profileName: !isSignup,
      profileDescription: true,
      phone: !isSignup,
      address: !isSignup,
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
    <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.screen}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={false}
        style={{ backgroundColor: '#000' }}>
        <ImageBackground
          resizeMode="cover"
          source={{
            uri:
              'https://images.unsplash.com/photo-1496439653932-606caa506e0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2011&q=80',
          }}
          style={styles.backgroundImage}>
          <Card style={isSignup ? styles.authContainerLarge : styles.authContainer}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {isSignup ? (
                <>
                  <View style={styles.imagePicker}>
                    <View style={styles.imagePreview}>
                      {!placeholderPic ? (
                        <Button
                          contentStyle={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 80,
                            height: 80,
                            width: 80,
                            borderRadius: 100 / 2,
                            borderColor: '#a9a9a9',
                            borderWidth: 0.5,
                          }}
                          mode="outlined"
                          onPress={takeImageHandler}
                          style={{
                            backgroundColor: 'transparent',
                            borderRadius: 100 / 2,
                          }}>
                          <Icon color="#666" name="camera" size={24} />
                        </Button>
                      ) : (
                        <TouchableOpacity onPress={takeImageHandler}>
                          <Avatar.Image
                            size={80}
                            source={
                              placeholderPic
                                ? { uri: placeholderPic }
                                : require('./../../assets/avatar-placeholder-image.png')
                            }
                            style={{
                              padding: 0,
                              margin: 0,
                              color: '#fff',
                              backgroundColor: '#fff',
                            }}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  <Input
                    autoCapitalize="none"
                    errorText="Skriv in ett användarnamn"
                    id="profileName"
                    initialValue=""
                    keyboardType="default"
                    onInputChange={inputChangeHandler}
                    placeholder="Användarnamn"
                    required
                  />
                  <Input
                    autoCapitalize="none"
                    errorText="Skriv in en kort beskrivning"
                    id="profileDescription"
                    initialValue=""
                    keyboardType="default"
                    onInputChange={inputChangeHandler}
                    placeholder="Beskrivning"
                  />
                  <Input
                    autoCapitalize="none"
                    errorText="Lägg in ett kontaktnummer"
                    id="phone"
                    initialValue=""
                    keyboardType="number-pad"
                    onInputChange={inputChangeHandler}
                    placeholder="Telefonnummer"
                    required
                  />

                  <Input
                    autoCapitalize="none"
                    errorText="Skriv in addressen återbruket vanligtvis kan hämtas på"
                    id="address"
                    initialValue=""
                    keyboardType="default"
                    onInputChange={inputChangeHandler}
                    placeholder="Address"
                    required
                  />
                </>
              ) : null}
              <Input
                autoCapitalize="none"
                email
                errorText="Skriv in en giltig e-post, den kommer också vara ditt inloggningsnamn"
                id="email"
                initialValue=""
                keyboardType="email-address"
                onInputChange={inputChangeHandler}
                placeholder="E-Mail"
                required
              />
              <Input
                autoCapitalize="none"
                errorText="Skriv in ett giltigt lösenord"
                id="password"
                initialValue=""
                keyboardType="default"
                minLength={5}
                onInputChange={inputChangeHandler}
                placeholder="Password"
                required
                secureTextEntry
              />
              <View style={styles.buttonContainer}>
                {isLoading ? (
                  <ActivityIndicator color={Colors.primary} size="small" />
                ) : (
                  <Button
                    color="#000"
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
                    mode="outlined"
                    onPress={authHandler}>
                    {isSignup ? 'Gå med' : 'Logga in'}
                  </Button>
                )}
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  color={isSignup ? Colors.darkPrimary : Colors.primary}
                  compact
                  labelStyle={{
                    paddingTop: 2,
                    fontFamily: 'bebas-neue-bold',
                    fontSize: 12,
                  }}
                  mode="contained"
                  onPress={() => {
                    setIsSignup((prevState) => !prevState);
                  }}
                  style={{
                    width: '60%',
                    alignSelf: 'center',
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

export const screenOptions = {
  headerTitle: '',
};

const d = Dimensions.get('window');

const styles = StyleSheet.create({
  authContainer: {
    maxHeight: 400,
    maxWidth: 400,
    padding: 20,
    width: '80%',
  },
  authContainerLarge: {
    maxHeight: 800,
    maxWidth: 400,
    padding: 20,
    width: '80%',
  },
  backgroundImage: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    flex: 1,
    height: d.height,
    justifyContent: 'center',
    position: 'absolute',
    width: d.width,
  },
  buttonContainer: {
    marginTop: 10,
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 15,
  },

  screen: {
    flex: 1,
  },
});

export default AuthScreen;
