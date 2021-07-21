import React from 'react';
import { Text } from 'react-native';

const CardBottomInfo = ({ title, description }) => {
  return (
    <>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{
          marginTop: 5,
          fontFamily: 'roboto-bold',
          fontSize: 17,
        }}>
        {title}
      </Text>
      {description ? (
        <Text numberOfLines={5} ellipsizeMode="tail">
          {description}
        </Text>
      ) : null}
    </>
  );
};

export default CardBottomInfo;
