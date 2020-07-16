import React from 'react';
import { View, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';

const TouchableCmp = ({ onPress, children }) => {
  let TouchableCmp = TouchableOpacity; //By default sets the wrapping component to be TouchableOpacity
  //If platform is android and the version is the one which supports the ripple effect
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
    //Set TouchableCmp to instead be TouchableNativeFeedback
  }

  return (
    //TouchableOpacity lets us press the whole item to trigger an action. The buttons still work independently.
    //'useForeground' has no effect on iOS but on Android it lets the ripple effect on touch spread throughout the whole element instead of just part of it
    <TouchableCmp onPress={onPress} useForeground>
      {/* This extra View is needed to make sure it fulfills the criteria of child nesting on Android */}
      <View>{children}</View>
    </TouchableCmp>
  );
};

export default TouchableCmp;
