import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  Text,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import { Button } from 'react-native-paper';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';
import HeaderButton from '../../components/UI/HeaderButton';
import ImagePicker from '../../components/UI/ImgPicker';
import Loader from '../../components/UI/Loader';
//Actions
import * as profilesActions from '../../store/actions/profiles';
//Constants
import Colors from '../../constants/Colors';

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

const EditProfileScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  //Get profiles, return only the one which matches the logged in id
  const loggedInUserId = useSelector(state => state.auth.userId);
  const profilesArray = useSelector(state => state.profiles.allProfiles).filter(
    profile => profile.profileId === loggedInUserId
  );

  //Currently edited profile
  const currentProfile = profilesArray[0];

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      profileName: currentProfile.profileName,
      email: currentProfile.email,
      phone: currentProfile.phone,
      image: currentProfile.image
    },
    inputValidities: {
      profileName: true,
      email: true,
      phone: true,
      image: true
    },
    formIsValid: true
  });

  useEffect(() => {
    if (error) {
      Alert.alert('Oj!', error, [{ text: 'OK' }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert(
        'Något är felskrivet!',
        'Kolla om det står någon text under något av fälten.',
        [{ text: 'Ok' }]
      );
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(
        profilesActions.updateProfile(
          currentProfile.id,
          formState.inputValues.profileName,
          formState.inputValues.email,
          formState.inputValues.phone,
          formState.inputValues.image
        )
      );
      props.navigation.navigate('ProductsOverview');
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
  }, [dispatch, currentProfile.id, formState]);

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Save"
            iconName={
              Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
            }
            onPress={submitHandler}
          />
        </HeaderButtons>
      )
    });
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
            <Text style={styles.label}>Användarnamn</Text>
            <TextInput
              style={styles.input}
              value={formState.inputValues.profileName}
              onChangeText={textChangeHandler.bind(this, 'profileName')}
              keyboardType="default"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
            {!formState.inputValues.profileName ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Skriv in ett användarnamn</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.formControl}>
            <Text style={styles.label}>Telefon</Text>

            <TextInput
              style={styles.input}
              value={formState.inputValues.phone.toString()}
              onChangeText={textChangeHandler.bind(this, 'phone')}
              keyboardType="number-pad"
              autoCorrect={false}
              returnKeyType="next"
            />
            {!formState.inputValues.phone ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Lägg in ett kontaktnummer</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.formControl}>
            <Text style={styles.label}>email</Text>
            <TextInput
              style={styles.input}
              value={formState.inputValues.email}
              onChangeText={textChangeHandler.bind(this, 'email')}
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
            />
            {!formState.inputValues.email ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Skriv in din email</Text>
              </View>
            ) : null}
          </View>
        </View>
        <Button
          color={'#666'}
          mode="contained"
          style={{
            marginTop: 50,
            marginBottom: 50,
            width: '60%',
            alignSelf: 'center'
          }}
          labelStyle={{
            paddingTop: 2,
            fontFamily: 'bebas-neue-bold',
            fontSize: 14
          }}
          compact={true}
          onPress={submitHandler}
        >
          Spara profil
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export const screenOptions = navData => {
  const routeParams = navData.route.params ? navData.route.params : {};
  return {
    headerTitle: routeParams.profileId ? 'Edit Profile' : 'Add Profile'
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20
  },
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

export default EditProfileScreen;
