import React from 'react';
//Components
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';
import Card from './Card';
import { Ionicons } from '@expo/vector-icons';
//Constants
import Colors from './../../constants/Colors';
import Styles from '../../constants/Styles';

const ProductItem = (props) => {
  let TouchableCmp = TouchableOpacity; //By default sets the wrapping component to be TouchableOpacity
  //If platform is android and the version is the one which supports the ripple effect
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
    //Set TouchableCmp to instead be TouchableNativeFeedback
  }

  return (
    //TouchableOpacity lets us press the whole item to trigger an action. The buttons still work independently.
    //'useForeground' has no effect on iOS but on Android it lets the ripple effect on touch spread throughout the whole element instead of just part of it
    <View style={styles.container}>
      <Card
        style={props.isHorizontal ? styles.horizontalProduct : styles.product}
      >
        {props.itemData.status === 'bearbetas' ? (
          <Ionicons
            style={{
              ...styles.icon,
              backgroundColor: Colors.primary,
              color: '#fff',
              fontSize: 20,
              paddingLeft: 8,
              paddingRight: 8,
            }}
            name={Platform.OS === 'android' ? 'md-hammer' : 'ios-hammer'}
            size={23}
            color={props.itemData.color}
          />
        ) : null}
        {props.itemData.status === 'reserverad' ? (
          <Ionicons
            style={{
              ...styles.icon,
              color: Colors.primary,
              fontSize: 35,
              marginLeft: 3,
              marginTop: -10,
            }}
            name={Platform.OS === 'android' ? 'md-bookmark' : 'ios-bookmark'}
            size={23}
            color={props.itemData.color}
          />
        ) : null}
        {props.itemData.status === 'hämtad' ? (
          <Ionicons
            style={{
              ...styles.icon,
              backgroundColor: Colors.completed,
              color: '#fff',
              paddingLeft: 10,
              paddingRight: 10,
              paddingBottom: 0,

              fontSize: 25,
            }}
            name={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
            size={23}
            color={props.itemData.color}
          />
        ) : null}
        <View style={styles.touchable}>
          <TouchableCmp onPress={props.onSelect} useForeground>
            {/* This extra View is needed to make sure it fulfills the criteria of child nesting on Android */}
            <View>
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={{ uri: props.itemData.image }}
                />
              </View>
              <Text style={styles.price}>
                {props.itemData.price ? props.itemData.price : 0} kr
              </Text>
            </View>
          </TouchableCmp>
        </View>
      </Card>
      <Text numberOfLines={2} ellipsizeMode={'tail'} style={styles.title}>
        {props.itemData.title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  product: {
    height: 150,
    width: '93%',
    margin: '1.5%',
    borderWidth: 0.5,
    borderColor: '#ddd',
    marginTop: 15,
  },
  horizontalProduct: {
    height: 150,
    width: 185,
    marginLeft: 10,
    borderWidth: 0.5,
    borderColor: '#ddd',
  },
  touchable: {
    borderRadius: Styles.borderRadius,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderTopLeftRadius: Styles.borderRadius,
    borderTopRightRadius: Styles.borderRadius,
    overflow: 'hidden', //To make sure any child (in this case the image) cannot overlap what we set in the image container
  },
  icon: {
    position: 'absolute',
    padding: 5,
    zIndex: 99,
    shadowColor: 'black',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2, //Because shadow only work on iOS, elevation is same thing but for android.
  },

  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    color: '#000',
  },
  title: {
    paddingLeft: 4,
    width: '90%',
    fontFamily: 'roboto-light-italic',
    fontSize: 16,
    marginLeft: 8,
  },
  price: {
    position: 'absolute',
    right: -9,
    bottom: 0,
    padding: 5,
    zIndex: 99,
    backgroundColor: 'rgba(255,255,255,0.8)',
    fontFamily: 'roboto-bold',
    fontSize: 15,
    textAlign: 'right',
    marginRight: 8,
  },
});

export default ProductItem;
