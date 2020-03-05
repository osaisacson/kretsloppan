import React, { useState } from 'react';
import { View, Button, Image, Text, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import Colors from '../../constants/Colors';

const ImgPicker = props => {
  const [pickedImage, setPickedImage] = useState(props.passedImage); //Set state to be a previously taken picture if we have one. Passed from wherever we use this component.

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

    setPickedImage(image.uri ? image.uri : props.passedImage); //show image from local storage
    props.onImageTaken(image.base64); //Forwards the taken picture to the function 'onImageTaken' passed as a props wherever we use the ImgPicker component
  };

  return (
    <View style={styles.imagePicker}>
      <View style={styles.imagePreview}>
        {!pickedImage ? (
          <Text>Ingen bild vald än</Text>
        ) : (
          <Image style={styles.image} source={{ uri: pickedImage }} /> //Originally uses the locally stored image as a placeholder
        )}
      </View>
      <Button
        title={props.imagePrompt ? props.imagePrompt : 'Välj en bild'}
        color={Colors.primary}
        onPress={takeImageHandler}
      />
    </View>
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

export default ImgPicker;
