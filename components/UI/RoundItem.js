import React from 'react';
//Components
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';
//Constants
import Styles from '../../constants/Styles';

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
      <View style={styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{ uri: props.itemData.image }}
            />
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
    height: 90,
    width: 90,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 100 / 2,
  },
  touchable: {
    height: 90,
    width: 90,
    borderRadius: 100 / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#000',
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
