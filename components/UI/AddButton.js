import React from 'react';
import { Animated, TouchableHighlight, View } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Entypo
} from '@expo/vector-icons';

//Constants
import Colors from '../../constants/Colors';

const AddButton = props => {
  const SIZE = 80;

  const mode = new Animated.Value(0);

  const toggleView = () => {
    Animated.timing(mode, {
      toValue: mode._value === 0 ? 1 : 0,
      duration: 300
    }).start();
  };

  const firstX = mode.interpolate({
    inputRange: [0, 1],
    outputRange: [20, -40]
  });
  const firstY = mode.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30]
  });
  const secondX = mode.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 20]
  });
  const secondY = mode.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -55]
  });
  const thirdX = mode.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 80]
  });
  const thirdY = mode.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30]
  });
  const opacity = mode.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });
  const rotation = mode.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg']
  });
  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 99,
        bottom: 5,
        alignSelf: 'center',
        shadowColor: 'black',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 3 //Because shadow only work on iOS, elevation is same thing but for android.
      }}
    >
      <Animated.View
        style={{
          position: 'absolute',
          left: firstX,
          top: firstY,
          opacity
        }}
      >
        <TouchableHighlight
          onPress={() => {
            props.navigation.navigate('EditProduct');
          }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: SIZE / 2,
            height: SIZE / 2,
            borderRadius: SIZE / 4,
            backgroundColor: Colors.primary
          }}
        >
          <MaterialIcons
            name="file-upload"
            size={25}
            color={Colors.lightPrimary}
          />
        </TouchableHighlight>
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          left: secondX,
          top: secondY,
          opacity
        }}
      >
        <TouchableHighlight
          onPress={() => {
            props.navigation.navigate('EditProject');
          }}
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            width: SIZE / 2,
            height: SIZE / 2,
            borderRadius: SIZE / 4,
            backgroundColor: Colors.primary
          }}
        >
          <Entypo name="address" size={20} color={Colors.lightPrimary} />
        </TouchableHighlight>
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          left: thirdX,
          top: thirdY,
          opacity
        }}
      >
        <TouchableHighlight
          onPress={() => {
            props.navigation.navigate('EditProposal');
          }}
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            width: SIZE / 2,
            height: SIZE / 2,
            borderRadius: SIZE / 4,
            backgroundColor: Colors.primary
          }}
        >
          <MaterialCommunityIcons
            name="comment-plus"
            size={21}
            color={Colors.lightPrimary}
          />
        </TouchableHighlight>
      </Animated.View>
      <TouchableHighlight
        onPress={toggleView}
        underlayColor={Colors.darkPrimary}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: SIZE,
          height: SIZE,
          borderRadius: SIZE / 2,
          backgroundColor: Colors.primary
        }}
      >
        <Animated.View
          style={{
            transform: [{ rotate: rotation }]
          }}
        >
          <Icon name="plus" size={24} color={Colors.lightPrimary} />
        </Animated.View>
      </TouchableHighlight>
    </View>
  );
};
export default AddButton;
