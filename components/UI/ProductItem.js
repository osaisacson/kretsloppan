import React from 'react';
//Components
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform
} from 'react-native';
import Card from './Card';
import { Ionicons } from '@expo/vector-icons';
//Constants
import Colors from './../../constants/Colors';

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
    <Card
      style={props.isHorizontal ? styles.horizontalProduct : styles.product}
    >
      {props.status === 'bearbetas' ? (
        <Ionicons
          style={{
            ...styles.icon,
            backgroundColor: Colors.primary,
            color: '#fff',
            fontSize: 15
          }}
          name={Platform.OS === 'android' ? 'md-hammer' : 'ios-hammer'}
          size={23}
          color={props.color}
        />
      ) : null}
      {props.status === 'reserverad' ? (
        <Ionicons
          style={{
            ...styles.icon,
            color: Colors.primary,
            fontSize: 35,
            marginLeft: 3,
            marginTop: -10
          }}
          name={Platform.OS === 'android' ? 'md-bookmark' : 'ios-bookmark'}
          size={23}
          color={props.color}
        />
      ) : null}
      <View style={styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          {/* This extra View is needed to make sure it fulfills the criteria of child nesting on Android */}
          <View>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: props.image }} />
            </View>
            <View style={styles.details}>
              <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={styles.title}
              >
                {props.title}
              </Text>
              <Text style={styles.price}>
                {props.price ? props.price : 0} kr
              </Text>
            </View>
            {props.showButtons ? (
              <View style={styles.actions}>
                {props.children}
                {/* props.children refers to whatever we pass between the opening
              and closing tag of our ProductItem component in the screen wherw we use it */}
              </View>
            ) : null}
          </View>
        </TouchableCmp>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  product: {
    height: 150,
    width: '47%',
    margin: '1.5%',
    borderWidth: 0.5,
    borderColor: '#ddd'
  },
  horizontalProduct: {
    height: 150,
    width: 185,
    marginLeft: 10,
    borderWidth: 0.5,
    borderColor: '#ddd'
  },
  touchable: {
    borderRadius: 10,
    overflow: 'hidden'
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden' //To make sure any child (in this case the image) cannot overlap what we set in the image container
  },
  icon: {
    position: 'absolute',
    padding: 5,
    zIndex: 99,
    shadowColor: 'black',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2 //Because shadow only work on iOS, elevation is same thing but for android.
  },

  image: {
    width: '100%',
    height: '100%'
  },
  details: {
    color: '#000'
  },
  title: {
    width: '90%',
    fontFamily: 'roboto-regular',
    fontSize: 16,
    marginLeft: 8
  },
  price: {
    fontFamily: 'roboto-bold',
    fontSize: 20,
    textAlign: 'right',
    marginRight: 8
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
