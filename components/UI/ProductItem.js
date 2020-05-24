import React from 'react';
//Components
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';
import Card from './Card';
import { Ionicons } from '@expo/vector-icons';
import CachedImage from '../../components/UI/CachedImage';
import moment from 'moment/min/moment-with-locales';
import StatusBadge from '../../components/UI/StatusBadge';

//Constants
import Colors from './../../constants/Colors';

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
        {props.itemData.collectingDate ? (
          <StatusBadge
            style={{
              padding: 0,
              margin: 0,
              position: 'absolute',
              zIndex: 100,
            }}
            textStyle={{
              textTransform: 'uppercase',
              fontSize: 10,
              padding: 4,
              color: '#fff',
            }}
            text={moment(props.itemData.collectingDate).locale('sv').calendar()}
            icon={Platform.OS === 'android' ? 'md-clock' : 'ios-clock'}
            backgroundColor={Colors.subtleBlue}
          />
        ) : null}
        {props.itemData.status === 'reserverad' && (
          <>
            {props.itemData.suggestedDate ? (
              <StatusBadge
                style={{
                  padding: 0,
                  marginTop: 0,
                  position: 'absolute',
                  zIndex: 100,
                }}
                textStyle={{
                  textTransform: 'uppercase',
                  fontSize: 10,
                  padding: 4,
                  color: '#fff',
                }}
                text={`Förslag: ${moment(props.itemData.suggestedDate)
                  .locale('sv')
                  .calendar()}`}
                icon={
                  Platform.OS === 'android' ? 'md-calendar' : 'ios-calendar'
                }
                backgroundColor={Colors.subtlePurple}
              />
            ) : null}
            <StatusBadge
              style={{
                padding: 0,
                marginTop: props.itemData.suggestedDate ? 23 : 0,
                position: 'absolute',
                zIndex: 100,
              }}
              textStyle={{
                textTransform: 'uppercase',
                fontSize: 10,
                padding: 4,
                color: '#fff',
              }}
              text={moment(props.itemData.reservedUntil)
                .locale('sv')
                .calendar()}
              icon={
                Platform.OS === 'android' ? 'md-return-left' : 'ios-return-left'
              }
              backgroundColor={Colors.primary}
            />
          </>
        )}

        {props.itemData.status === 'hämtad' && (
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
        )}
        <View style={styles.touchable}>
          <TouchableCmp onPress={props.onSelect} useForeground>
            {/* This extra View is needed to make sure it fulfills the criteria of child nesting on Android */}
            <View>
              <View style={styles.imageContainer}>
                <CachedImage style={styles.image} uri={props.itemData.image} />
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
