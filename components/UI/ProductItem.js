//Components
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment/min/moment-with-locales';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';

import CachedImage from '../../components/UI/CachedImage';
import StatusBadge from '../../components/UI/StatusBadge';
//Constants
import Colors from './../../constants/Colors';
import Card from './Card';

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
      <Card style={props.isHorizontal ? styles.horizontalProduct : styles.product}>
        {props.itemData.collectingDate ? (
          <StatusBadge
            backgroundColor={Colors.subtleBlue}
            icon={Platform.OS === 'android' ? 'md-clock' : 'ios-clock'}
            style={{
              padding: 0,
              margin: 0,
              position: 'absolute',
              zIndex: 100,
            }}
            text={moment(props.itemData.collectingDate).locale('sv').calendar()}
            textStyle={{
              textTransform: 'uppercase',
              fontSize: 10,
              padding: 4,
              color: '#fff',
            }}
          />
        ) : null}
        {props.itemData.status === 'reserverad' && (
          <>
            {props.itemData.suggestedDate ? (
              <StatusBadge
                backgroundColor={Colors.subtlePurple}
                icon={Platform.OS === 'android' ? 'md-calendar' : 'ios-calendar'}
                style={{
                  padding: 0,
                  marginTop: 0,
                  position: 'absolute',
                  zIndex: 100,
                }}
                text={`Förslag: ${moment(props.itemData.suggestedDate).locale('sv').calendar()}`}
                textStyle={{
                  textTransform: 'uppercase',
                  fontSize: 10,
                  padding: 4,
                  color: '#fff',
                }}
              />
            ) : null}
            <StatusBadge
              backgroundColor={Colors.primary}
              icon={Platform.OS === 'android' ? 'md-return-left' : 'ios-return-left'}
              style={{
                padding: 0,
                marginTop: props.itemData.suggestedDate ? 22 : 0,
                position: 'absolute',
                zIndex: 100,
              }}
              text={moment(props.itemData.reservedUntil).locale('sv').calendar()}
              textStyle={{
                textTransform: 'uppercase',
                fontSize: 10,
                padding: 4,
                color: '#fff',
              }}
            />
          </>
        )}

        {props.itemData.status === 'hämtad' && (
          <Ionicons
            color={props.itemData.color}
            name={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
            size={23}
            style={{
              ...styles.icon,
              backgroundColor: Colors.completed,
              color: '#fff',
              paddingLeft: 10,
              paddingRight: 10,
              paddingBottom: 0,
              fontSize: 25,
            }}
          />
        )}
        <View style={styles.touchable}>
          <TouchableCmp onPress={props.onSelect} useForeground>
            {/* This extra View is needed to make sure it fulfills the criteria of child nesting on Android */}
            <View>
              <View style={styles.imageContainer}>
                <CachedImage style={styles.image} uri={props.itemData.image} />
              </View>
              <Text style={styles.price}>{props.itemData.price ? props.itemData.price : 0} kr</Text>
            </View>
          </TouchableCmp>
        </View>
      </Card>
      <Text ellipsizeMode="tail" numberOfLines={2} style={styles.title}>
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
  horizontalProduct: {
    borderColor: '#ddd',
    borderWidth: 0.5,
    height: 150,
    marginLeft: 10,
    width: 185,
  },
  icon: {
    elevation: 2,
    padding: 5,
    position: 'absolute',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    zIndex: 99, //Because shadow only work on iOS, elevation is same thing but for android.
  },
  image: {
    height: '100%',
    width: '100%',
  },
  imageContainer: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    width: '100%', //To make sure any child (in this case the image) cannot overlap what we set in the image container
  },
  price: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    bottom: 0,
    fontFamily: 'roboto-bold',
    fontSize: 15,
    marginRight: 8,
    padding: 5,
    position: 'absolute',
    right: -9,
    textAlign: 'right',
    zIndex: 99,
  },

  product: {
    borderColor: '#ddd',
    borderWidth: 0.5,
    height: 150,
    margin: '1.5%',
    marginTop: 15,
    width: '93%',
  },
  title: {
    fontFamily: 'roboto-light-italic',
    fontSize: 16,
    marginLeft: 8,
    paddingLeft: 4,
    width: '90%',
  },
  touchable: {
    borderRadius: 5,
    overflow: 'hidden',
  },
});

export default ProductItem;
