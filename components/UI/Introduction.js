import React, { useState } from 'react';
import CachedImage from '../../components/UI/CachedImage';
import { Text } from 'react-native';
import { Banner } from 'react-native-paper';

const Introduction = (props) => {
  const [visibleBanner, setVisibleBanner] = useState(true);

  return (
    <Banner
      visible={visibleBanner}
      actions={[
        {
          label: 'Stäng introduktionen',
          onPress: () => setVisibleBanner(false),
        },
      ]}
    >
      <CachedImage
        style={{
          width: 380,
          height: 150,
          borderRadius: 6,
        }}
        uri={props.pic}
      />
      <Text
        style={{
          fontFamily: 'roboto-light-italic',
          paddingVertical: 10,
        }}
      >
        {props.text}
      </Text>
    </Banner>
  );
};

export default Introduction;
