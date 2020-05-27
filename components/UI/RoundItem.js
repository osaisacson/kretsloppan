import React from 'react';
//Imports
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';

import CachedImage from '../../components/UI/CachedImage';
import Colors from '../../constants/Colors';

const RoundItem = (props) => {
  let TouchableCmp = TouchableOpacity; //By default sets the wrapping component to be TouchableOpacity
  //If platform is android and the version is the one which supports the ripple effect
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
    //Set TouchableCmp to instead be TouchableNativeFeedback
  }

  return (
    //TouchableOpacity lets us press the whole item to trigger an action. The buttons still work independently.
    //'useForeground' has no effect on iOS but on Android it lets the ripple effect on touch spread throughout the whole element instead of just part of it
    <View style={styles.project}>
      <View style={props.isSelected ? styles.selectedTouchable : styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View style={styles.imageContainer}>
            <CachedImage style={styles.image} uri={props.itemData.image} />
          </View>
        </TouchableCmp>
      </View>
      <Text style={styles.title}>{props.itemData.title} </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginTop: 5,
    fontFamily: 'roboto-bold-italic',
    fontSize: 13,
    textAlign: 'center',
    alignSelf: 'center',
  },
  project: {
    height: 160,
    width: 160,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 100 / 2,
  },
  touchable: {
    height: 160,
    width: 160,
    borderRadius: 100 / 2,
    overflow: 'hidden',
    borderWidth: 0.1,
    borderColor: '#000',
  },
  selectedTouchable: {
    height: 160,
    width: 160,
    borderRadius: 100 / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: 100 / 2,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 100 / 2,
  },
  details: {
    color: '#000',
  },
});

export default RoundItem;
