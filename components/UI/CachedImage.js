import React, { useState, useEffect, useCallback } from 'react';
import { Image } from 'react-native';
import shorthash from 'shorthash';
import * as FileSystem from 'expo-file-system';

const CachedImage = (props) => {
  const [source, setSource] = useState(null);
  const [error, setError] = useState('');

  const { uri } = props;

  let image;
  let newImage;

  const checkImage = useCallback(async () => {
    try {
      image = await FileSystem.getInfoAsync(path);

      if (image.exists) {
        console.log('read image from cache');
        return {
          uri: image.uri,
        };
      } else {
        console.log('downloading image to cache');
        try {
          newImage = await FileSystem.downloadAsync(uri, path);
          return {
            uri: newImage.uri,
          };
        } catch (err) {
          console.log('Error in loadImage from CachedImage', err.message);
        }
      }
    } catch (err) {
      console.log('Error in checkImage from CachedImage', err.message);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    const name = shorthash.unique(uri);
    path = `${FileSystem.cacheDirectory}${name}.jpg`;
    checkImage()
      .then((source) => (isSubscribed ? setSource(source) : null))
      .catch((error) => (isSubscribed ? setError(error.toString()) : null));

    return () => (isSubscribed = false);
  }, []);

  return <Image style={props.style} source={source} />;
};

export default CachedImage;
