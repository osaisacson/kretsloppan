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
        'Nej.',
        'Du måste tillåta att öppna kameran för att kunna ta ett kort.',
        [{ text: 'Okay' }]
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
      //We could also open the gallery here instead of launchCameraAsync
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.6
    });

    setPickedImage(image.uri);
    console.log('image object:', image);
    console.log('image 64:', image.data);

    props.onImageTaken(image.uri); //Forwards the taken picture to the function 'onImageTaken' passed as a props wherever we use the ImgPicker component
  };

  return (
    <View style={styles.imagePicker}>
      <View style={styles.imagePreview}>
        {!pickedImage ? (
          <Text>Ingen bild vald än</Text>
        ) : (
          <Image style={styles.image} source={{ uri: pickedImage }} />
        )}
      </View>
      <Button
        title="Ta en bild"
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
    height: 200,
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
