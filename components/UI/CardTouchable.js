import React from 'react';
import { View, StyleSheet } from 'react-native';
import { pure } from 'recompose';

import CachedImage from './CachedImage';
import TouchableCmp from './TouchableCmp';

const CardTouchable = ({ onSelect, cardHeight, children, image, overlayBadge, underCardInfo }) => {
  return (
    <View
      style={{
        ...styles.card,
        height: cardHeight,
      }}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={onSelect} useForeground>
          {children}
          {/* Badge as an overlay on the card */}
          {overlayBadge}
          {/* Image */}
          {image ? (
            <View style={styles.imageContainer}>
              <CachedImage style={styles.image} uri={image} />
            </View>
          ) : null}
        </TouchableCmp>
      </View>
      {/* Information underneath the card */}
      {underCardInfo}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowColor: 'black',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2, //Because shadow only work on iOS, elevation is same thing but for android.
    backgroundColor: 'rgba(255,255,255,0.7)',
    width: '100%',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#ddd',
    marginTop: 5,
  },
  touchable: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: 'hidden', //To make sure any child (in this case the image) cannot overlap what we set in the image container
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default pure(CardTouchable);
