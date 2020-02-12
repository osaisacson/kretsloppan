import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CartItem = props => {
  return (
    <View>
      <Image style={styles.image} source={{ uri: props.imageUrl }} />
      <View style={styles.cartItem}>
        <View style={styles.itemData}>
          <Text style={styles.quantity}>{props.quantity} </Text>
          <Text numberOfLines={1} style={styles.mainText}>
            {props.title}
          </Text>
        </View>
        <View style={styles.itemData}>
          {props.deletable && ( //Only show the delete button if the prop deletable is passed and set to true
            <TouchableOpacity
              onPress={props.onRemove}
              style={styles.deleteButton}
            >
              <Ionicons
                name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
                size={23}
                color="red"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    padding: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 15
  },
  image: {
    width: '100%',
    height: 100
  },
  itemData: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  quantity: {
    fontFamily: 'roboto-regular',
    color: '#888',
    fontSize: 16
  },
  mainText: {
    maxWidth: 240,
    fontFamily: 'roboto-bold',
    fontSize: 16
  },
  deleteButton: {
    marginLeft: 20
  }
});

export default CartItem;
