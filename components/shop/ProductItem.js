import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform
} from 'react-native';

import Card from '../UI/Card';

const ProductItem = props => {
  let TouchableCmp = TouchableOpacity; //By default sets the wrapping component to be TouchableOpacity
  //If platform is android and the version is the one which supports the ripple effect
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
    //Set TouchableCmp to instead be TouchableNativeFeedback
  }
  return (
    //TouchableOpacity lets us press the whole item to trigger an action. The buttons still work independently.
    //'useForeground' has no effect on iOS but on Android it lets the ripple effect on touch spread throughout the whole element instead of just part of it
    <Card style={styles.product}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          {/* This extra View is needed to make sure it fulfills the criteria of child nesting on Android */}
          <View>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: props.image }} />
            </View>
            <View style={styles.details}>
              <Text style={styles.title}>{props.title}</Text>
              <Text style={styles.price}>{props.price.toFixed(2)} Kr</Text>
            </View>
            <View style={styles.actions}>
              {props.children}
              {/* props.children refers to whatever we pass between the opening
              and closing tag of our ProductItem component in the screen wherw we use it */}
            </View>
          </View>
        </TouchableCmp>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  product: {
    height: 300,
    margin: 20
  },
  touchable: {
    borderRadius: 10,
    overflow: 'hidden'
  },
  imageContainer: {
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden' //To make sure any child (in this case the image) cannot overlap what we set in the image container
  },
  image: {
    width: '100%',
    height: '100%'
  },
  details: {
    alignItems: 'center',
    height: '17%',
    padding: 10
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 18,
    marginVertical: 2
  },
  price: {
    fontFamily: 'open-sans',
    fontSize: 14,
    color: '#888'
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '23%',
    paddingHorizontal: 20
  }
});

export default ProductItem;
