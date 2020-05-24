import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Banner } from 'react-native-paper';

import CachedImage from '../../components/UI/CachedImage';

const Introduction = (props) => {
  const [visibleBanner, setVisibleBanner] = useState(true);

  return (
    <View style={styles.container}>
      {visibleBanner ? <CachedImage style={styles.cachedImage} uri={props.pic} /> : null}
      <Banner
        actions={[
          {
            label: 'Stäng',
            onPress: () => setVisibleBanner(false),
          },
        ]}
        visible={visibleBanner}>
        <Text style={styles.bannerText}>{props.text}</Text>
      </Banner>
    </View>
  );
};

export default Introduction;

const styles = StyleSheet.create({
  bannerText: {
    fontFamily: 'roboto-light-italic',
    paddingVertical: 10,
  },
  cachedImage: {
    backgroundColor: 'white',
    borderRadius: 6,
    height: 150,
    margin: 5,
    width: 'auto',
  },
  container: { backgroundColor: 'white' },
});
