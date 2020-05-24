import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, Alert } from 'react-native';

import ButtonAction from '../../components/UI/ButtonAction';

const ImgPicker = (props) => {
  const [isUploading, setIsUploading] = useState(false);
  const [pickedImage, setPickedImage] = useState(props.passedImage); //Set state to be a previously taken picture if we have one. Passed from wherever we use this component.

  const verifyPermissions = async () => {
    const permissionGallery = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const permissionPhoto = await Permissions.askAsync(Permissions.CAMERA);
    if (permissionGallery.status !== 'granted' || permissionPhoto.status !== 'granted') {
      Alert.alert('Å Nej!', 'Du måste tillåta att använda kameran för att kunna välja ett kort.', [
        { text: 'Ok' },
      ]);
      return false;
    }
    return true;
  };

  //Opens up the camera
  const takePhoto = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const pickerResult = await ImagePicker.launchCameraAsync({
      base64: true, //lets us get and use the base64 encoded image to pass to storage
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });

    handleImagePicked(pickerResult);
  };

  const pickImage = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      base64: true, //lets us get and use the base64 encoded image to pass to storage
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });

    handleImagePicked(pickerResult);
  };

  const handleImagePicked = async (pickerResult) => {
    try {
      setIsUploading(true);
      if (!pickerResult.cancelled) {
        setPickedImage(pickerResult.uri ? pickerResult.uri : props.passedImage); //show image from local storage
        props.onImageTaken(pickerResult.base64); //Forwards the taken picture to the function 'onImageTaken' passed as a props wherever we use the ImgPicker component
      }
    } catch (e) {
      console.log(e);
      alert('Det gick inte att ladda upp bilden, försök igen :(');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.imagePicker}>
      <View style={styles.imagePreview}>
        {!pickedImage ? (
          <Text>Lägg upp en bild</Text>
        ) : (
          <Image source={{ uri: pickedImage }} style={styles.image} /> //Originally uses the locally stored image as a placeholder
        )}
      </View>
      <View style={styles.centered}>
        <ButtonAction
          icon="camera"
          onSelect={takePhoto}
          style={{ marginRight: 8 }}
          title="Kamera"
        />
        <ButtonAction icon="image" onSelect={pickImage} title="Galleri" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePreview: {
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    height: 350,
    justifyContent: 'center',
    marginBottom: 10,
    width: '100%',
  },
});

export default ImgPicker;
