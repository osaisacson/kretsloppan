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
  image: {
    borderRadius: 100 / 2,
    height: '100%',
    width: '100%',
  },
  imageContainer: {
    borderRadius: 100 / 2,
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  project: {
    borderRadius: 100 / 2,
    height: 100,
    marginLeft: 10,
    marginRight: 10,
    width: 100,
  },
  selectedTouchable: {
    borderColor: Colors.primary,
    borderRadius: 100 / 2,
    borderWidth: 1,
    height: 100,
    overflow: 'hidden',
    width: 100,
  },
  title: {
    alignSelf: 'center',
    fontFamily: 'roboto-bold-italic',
    fontSize: 13,
    marginTop: 5,
    textAlign: 'center',
  },
  touchable: {
    borderColor: '#000',
    borderRadius: 100 / 2,
    borderWidth: 0.1,
    height: 100,
    overflow: 'hidden',
    width: 100,
  },
});

export default RoundItem;
