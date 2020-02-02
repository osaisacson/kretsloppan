import React, { useState } from 'react';
//Components
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../UI/Card';
import CartItem from './CartItem';
//Constants
import Colors from '../../constants/Colors';

const OrderItem = props => {
  const [showDetails, setShowDetails] = useState(false); //Initially don't show the details of the card

  return (
    <Card style={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.date}>{props.date}</Text>
        <Text style={styles.date}>{props.items.length}</Text>
      </View>
      {showDetails ? (
        <Ionicons
          name={
            Platform.OS === 'android'
              ? 'md-arrow-dropup-circle'
              : 'ios-arrow-dropup-circle'
          }
          size={25}
          color={'grey'}
          onPress={() => {
            setShowDetails(prevState => !prevState); //prevState is originally false for showDetail. This syntax toggles it between being false and true, so if it was false on press make it true, and vice versa.
          }}
        />
      ) : (
        <Ionicons
          name={
            Platform.OS === 'android'
              ? 'md-arrow-dropdown-circle'
              : 'ios-arrow-dropdown-circle'
          }
          size={25}
          color={'grey'}
          onPress={() => {
            setShowDetails(prevState => !prevState); //prevState is originally false for showDetail. This syntax toggles it between being false and true, so if it was false on press make it true, and vice versa.
          }}
        />
      )}

      {showDetails && ( //Show the full card if showDetails is true
        <View style={styles.detailItems}>
          {props.items.map(cartItem => (
            <CartItem
              key={cartItem.productId}
              quantity={cartItem.quantity}
              title={cartItem.productTitle}
              imageUrl={cartItem.imageUrl}
            />
          ))}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    margin: 20,
    padding: 10,
    alignItems: 'center'
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15
  },
  date: {
    fontSize: 16,
    fontFamily: 'open-sans',
    color: '#888'
  },
  detailItems: {
    width: '100%'
  }
});

export default OrderItem;
