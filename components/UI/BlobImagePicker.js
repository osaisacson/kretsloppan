import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { uploadImageAsync } from './../../store/helpers';
import React, { useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  Button,
  Clipboard,
  Image,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

//TODO: Replace current ImgPicker with below, use this component wherever we upload images (products, profiles, projects)
//Check the TODO in store/helpers for the second part of this - how to change the current approact to instead use uploadImageAsync
const ImgPicker = (props) => {
  const [isUploading, setIsUploading] = useState(false);
  const [pickedImage, setPickedImage] = useState(props.passedImage); //Set state to be a previously taken picture if we have one. Passed from wherever we use this component.

  const verifyPermissions = async () => {
    const permissionGallery = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    const permissionPhoto = await Permissions.askAsync(Permissions.CAMERA);
    if (
      permissionGallery.status !== 'granted' ||
      permissionPhoto.status !== 'granted'
    ) {
      Alert.alert(
        'Å Nej!',
        'Du måste tillåta att använda kameran för att kunna välja ett kort.',
        [{ text: 'Ok' }]
      );
      return false;
    }
    return true;
  };

  const maybeRenderUploadingOverlay = () => {
    if (isUploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0,0,0,0.4)',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  const maybeRenderImage = () => {
    let { image } = pickedImage;
    if (!image) {
      return;
    }

    return (
      <View
        style={{
          marginTop: 30,
          width: 250,
          borderRadius: 3,
          elevation: 2,
        }}
      >
        <View
          style={{
            borderTopRightRadius: 3,
            borderTopLeftRadius: 3,
            shadowColor: 'rgba(0,0,0,1)',
            shadowOpacity: 0.2,
            shadowOffset: { width: 4, height: 4 },
            shadowRadius: 5,
            overflow: 'hidden',
          }}
        >
          <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
        </View>
        <Text
          onPress={copyToClipboard}
          onLongPress={share}
          style={{ paddingVertical: 10, paddingHorizontal: 10 }}
        >
          {image}
        </Text>
      </View>
    );
  };

  const share = () => {
    Share.share({
      message: pickedImage,
      title: 'Check out this photo',
      url: pickedImage,
    });
  };

  const copyToClipboard = () => {
    Clipboard.setString(pickedImage);
    alert('Copied image URL to clipboard');
  };

  takePhoto = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    handleImagePicked(pickerResult);
  };

  const pickImage = async () => {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    handleImagePicked(pickerResult);
  };

  const handleImagePicked = async (pickerResult) => {
    try {
      setIsUploading(true);

      if (!pickerResult.cancelled) {
        uploadUrl = await uploadImageAsync(pickerResult.uri);
        setPickedImage(uploadUrl);
        props.onImageTaken(uploadUrl);
        console.log('returned image:', pickedImage);
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
      {!!image && <Text>Lägg upp en bild</Text>}

      <Button onPress={pickImage} title="Välj en bild från ditt galleri" />

      <Button onPress={takePhoto} title="Ta en bild" />

      {maybeRenderImage()}
      {maybeRenderUploadingOverlay()}

      <StatusBar barStyle="default" />
    </View>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePreview: {
    width: '100%',
    height: 300,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImgPicker;
