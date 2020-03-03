import React from 'react';
//Components
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform
} from 'react-native';
//Constants
import Styles from '../../constants/Styles';

const LargeItem = props => {
  let TouchableCmp = TouchableOpacity; //By default sets the wrapping component to be TouchableOpacity
  //If platform is android and the version is the one which supports the ripple effect
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
    //Set TouchableCmp to instead be TouchableNativeFeedback
  }

  return (
    //TouchableOpacity lets us press the whole item to trigger an action. The buttons still work independently.
    //'useForeground' has no effect on iOS but on Android it lets the ripple effect on touch spread throughout the whole element instead of just part of it
    <View style={styles.largeProject}>
      <View style={styles.largeTouchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          {/* This extra View is needed to make sure it fulfills the criteria of child nesting on Android */}
          <View>
            <View style={styles.largeImageContainer}>
              <Image
                style={styles.largeImage}
                source={{ uri: props.itemData.image }}
              />
            </View>
          </View>
        </TouchableCmp>
      </View>
      <Text style={styles.title}>{props.itemData.title} </Text>
      <Text style={styles.slogan}>{props.itemData.slogan} </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  largeProject: {
    height: 250,
    width: 370,
    marginLeft: 10,
    borderWidth: 0.5,
    borderRadius: Styles.borderRadius,
    borderColor: '#ddd',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  largeTouchable: {
    height: 250,
    width: 370,
    borderRadius: Styles.borderRadius,
    overflow: 'hidden'
  },
  largeImageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: Styles.borderRadius,
    overflow: 'hidden' //To make sure any child (in this case the image) cannot overlap what we set in the image container
  },
  largeImage: {
    borderRadius: Styles.borderRadius,
    width: '100%',
    height: '100%'
  },
  slogan: {
    fontFamily: 'roboto-light-italic',
    fontSize: 13,
    textAlign: 'center'
  }
});

export default LargeItem;