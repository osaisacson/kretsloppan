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

const PickerItem = (props) => {
  let TouchableCmp = TouchableOpacity; //By default sets the wrapping component to be TouchableOpacity
  //If platform is android and the version is the one which supports the ripple effect
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
    //Set TouchableCmp to instead be TouchableNativeFeedback
  }

  return (
    //TouchableOpacity lets us press the whole item to trigger an action. The buttons still work independently.
    //'useForeground' has no effect on iOS but on Android it lets the ripple effect on touch spread throughout the whole element instead of just part of it
    <View style={styles.item}>
      <View style={styles.touchable}>
        <TouchableCmp
          onPress={props.onSelect}
          style={{
            backgroundColor: props.color,
            height: props.isSelected ? 45 : 35,
          }}
          useForeground>
          <View style={styles.textContainer}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: props.isSelected ? 'bebas-neue' : 'bebas-neue-light',
                color: '#000',
              }}>
              {props.title}
            </Text>
          </View>
        </TouchableCmp>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    marginLeft: 14,
    minWidth: 100,
  },
  textContainer: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingTop: 3,
    position: 'relative',
    textAlign: 'center',
    width: '100%',
  },
  touchable: {
    borderRadius: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
});

export default PickerItem;
