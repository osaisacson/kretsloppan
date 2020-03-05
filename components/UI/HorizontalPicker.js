import React, { useRef } from 'react';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import {
  View,
  Dimensions,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const HorizontalPicker = props => {
  const carouselRef = useRef(null);

  const goForward = () => {
    carouselRef.current.snapToNext();
  };

  const itemToRender = ({ item, index }, parallaxProps) => {
    return (
      <View style={styles.item}>
        <ParallaxImage
          source={{ uri: item.image }}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.4}
          {...parallaxProps}
        />
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        sliderWidth={screenWidth}
        sliderHeight={screenWidth}
        itemWidth={screenWidth - 60}
        data={props.pickerData}
        renderItem={itemToRender}
        hasParallaxImages={true}
      />
    </View>
  );
};

export default HorizontalPicker;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    width: screenWidth - 60,
    height: screenWidth - 180
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 5
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover'
  }
});
