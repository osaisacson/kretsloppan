import React, { useState, useEffect, useCallback } from 'react';
import { Image } from 'react-native';
import shorthash from 'shorthash';
import * as FileSystem from 'expo-file-system';

const CachedImage = (props) => {
  const [source, setSource] = useState(null);
  const { uri } = props;

  let image;
  let newImage;

  const checkImage = useCallback(async () => {
    const name = shorthash.unique(uri);
    path = `${FileSystem.cacheDirectory}${name}.jpg`;
    try {
      image = await FileSystem.getInfoAsync(path);
    } catch (err) {
      console.log('Error in checkImage from CachedImage', err.message);
    }
  }, []);

  const loadImage = useCallback(async () => {
    const name = shorthash.unique(uri);
    path = `${FileSystem.cacheDirectory}${name}.jpg`;
    try {
      newImage = await FileSystem.downloadAsync(uri, path);
      setSource({
        uri: newImage.uri,
      });
    } catch (err) {
      console.log('Error in loadImage from CachedImage', err.message);
    }
  }, []);

  useEffect(() => {
    checkImage().then(() => {
      if (image.exists) {
        console.log('read image from cache');
        setSource({
          uri: image.uri,
        });
        return;
      } else {
        console.log('downloading image to cache');
        loadImage();
      }
    });
  }, [uri]);

  return <Image style={props.style} source={source} />;
};

export default CachedImage;
