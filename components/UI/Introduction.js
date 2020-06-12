import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Banner } from 'react-native-paper';

import CachedImage from '../../components/UI/CachedImage';
import Colors from '../../constants/Colors';

const Introduction = (props) => {
  const [visibleBanner, setVisibleBanner] = useState(true);

  return (
    <View style={styles.container}>
      {visibleBanner ? <CachedImage style={styles.cachedImage} uri={props.pic} /> : null}
      <Banner
        visible={visibleBanner}
        actions={[
          {
            label: 'Stäng',
            style: { backgroundColor: Colors.darkPrimary, color: '#fff' },
            labelStyle: { color: '#fff' },

            onPress: () => setVisibleBanner(false),
          },
        ]}>
        <Text style={styles.bannerText}>{props.text}</Text>
      </Banner>
    </View>
  );
};

export default Introduction;

const styles = StyleSheet.create({
  container: { backgroundColor: 'white' },
  cachedImage: {
    margin: 5,
    width: 'auto',
    height: 150,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  bannerText: {
    fontFamily: 'roboto-light-italic',
    paddingVertical: 10,
  },
});
