import * as ImageManipulator from 'expo-image-manipulator';
import React, { useState, useEffect, useCallback } from 'react';
import { Image, CacheManager } from 'react-native-expo-image-cache';

const CachedImage = (props) => {
  const [source, setSource] = useState(null);
  const [error, setError] = useState('');

  const { uri } = props;

  useEffect(() => {
    let isSubscribed = true;
    base64Image()
      .then((source) =>
        isSubscribed
          ? setSource(`data:image/jpeg;base64,${source.base64 || ''}`)
          : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      )
      .catch((error) => (isSubscribed ? setError(error.toString()) : null));
    return () => (isSubscribed = false);
  }, []);

  const base64Image = useCallback(async () => {
    await CacheManager.get(uri).getPath();
    await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 5, height: 5 } }], {
      base64: true,
      format: 'jpeg',
    });
  }, []);

  return <Image style={props.style} {...{ preview: source, uri }} />;
};

export default CachedImage;
