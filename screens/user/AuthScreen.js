import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { useDispatch } from 'react-redux';
//Components
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import { Avatar, Button } from 'react-native-paper';
import Icon from '@expo/vector-icons/FontAwesome';

import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

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
      phone: '',
      address: '',
      image: '',
    },
    inputValidities: {
      email: false,
      password: false,
      profileName: isSignup ? false : true,
      phone: isSignup ? false : true,
      address: isSignup ? false : true,
      image: !isSignup && selectedImage ? true : false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert('Oj, något gick åt pipsvängen!', error, [{ text: 'OK' }]);
    }
  }, [error]);

  const authHandler = async () => {
    let action;
    if (isSignup && !selectedImage) {
      Alert.alert('Å Nej!', 'Du måste välja en profilbild först', [
        { text: 'Ok' },
      ]);
      return;
    }
    if (isSignup) {
      console.log('passed data from AuthScreen');
      console.log('formState.inputValues', formState.inputValues);
      console.log('selectedImage.length', selectedImage.length);

      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password,
        formState.inputValues.profileName,
        formState.inputValues.phone,
        formState.inputValues.address,
        selectedImage
      );
    } else {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
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
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <ImageBackground
        source={{
          uri:
            'https://images.unsplash.com/photo-1496439653932-606caa506e0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2011&q=80',
        }}
        style={styles.centeredContent}
      >
        <Card
          style={isSignup ? styles.authContainerLarge : styles.authContainer}
        >
          <ScrollView>
            {isSignup ? (
              <>
                <View style={styles.imagePicker}>
                  <View style={styles.imagePreview}>
                    {!placeholderPic ? (
                      <Button
                        mode="contained"
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
                        }}
                      >
                        <Icon name="camera" size={24} color="#666" />
                      </Button>
                    ) : (
                      <Button
                        mode="contained"
                        onPress={takeImageHandler}
                        style={{
                          backgroundColor: 'transparent',
                          borderRadius: 100 / 2,
                        }}
                      >
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
                      </Button>
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
              </>
            ) : null}
            <Input
              id="email"
              placeholder="E-Mail"
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
                  color={'#000'}
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
                  onPress={authHandler}
                >
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
                compact={true}
                onPress={() => {
                  setIsSignup((prevState) => !prevState);
                }}
              >
                {`Byt till ${isSignup ? 'logga in' : 'skapa konto'}`}
              </Button>
            </View>
          </ScrollView>
        </Card>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export const screenOptions = {
  headerTitle: '',
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredContent: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
