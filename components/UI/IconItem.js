import React from 'react';
//Components
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform
} from 'react-native';

const IconItem = props => {
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
        <TouchableCmp
          onPress={props.onSelect}
          style={{
            backgroundColor: props.isSelected ? '#000' : props.itemData.color
          }}
          useForeground
        >
          <View style={styles.textContainer}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'bebas-neue'
              }}
            >
              {props.itemData.title}
            </Text>
          </View>
        </TouchableCmp>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginTop: 5,
    fontFamily: 'roboto-bold-italic',
    fontSize: 13,
    textAlign: 'center',
    alignSelf: 'center'
  },
  project: {
    height: 60,
    width: 60,
    marginLeft: 10,
    borderRadius: 100 / 2
  },
  touchable: {
    height: 60,
    width: 60,
    borderRadius: 100 / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#000'
  },
  textContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100 / 2,
    overflow: 'hidden'
  },
  details: {
    color: '#000'
  }
});

export default IconItem;
