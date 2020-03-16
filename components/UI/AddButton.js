import React from 'react';
import { Animated, TouchableHighlight, View, Text } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';

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
    outputRange: [0, 0]
  });
  const firstY = mode.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -210]
  });
  const secondX = mode.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2]
  });
  const secondY = mode.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -140]
  });
  const thirdX = mode.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -13]
  });
  const thirdY = mode.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -70]
  });
  const opacity = mode.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });
  const rotation = mode.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg']
  });

  const ClickedItem = props => {
    return (
      <TouchableHighlight
        onPress={props.actionOnPress}
        style={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 12,
          paddingVertical: 6,
          height: 30,
          borderRadius: SIZE / 4,
          backgroundColor: Colors.primary
        }}
      >
        <Text style={{ fontSize: 11, color: Colors.lightPrimary }}>
          {props.label}
        </Text>
        {/* <MaterialCommunityIcons
      name="comment-plus"
      size={21}
      color={Colors.lightPrimary}
    /> */}
      </TouchableHighlight>
    );
  };

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
        <ClickedItem
          actionOnPress={() => {
            props.navigation.navigate('EditProduct');
          }}
          label="ÅTERBRUK"
        />
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          left: secondX,
          top: secondY,
          opacity
        }}
      >
        <ClickedItem
          actionOnPress={() => {
            props.navigation.navigate('EditProject');
          }}
          label="PROJEKT"
        />
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          left: thirdX,
          top: thirdY,
          opacity
        }}
      >
        <ClickedItem
          actionOnPress={() => {
            props.navigation.navigate('EditProposal');
          }}
          label="EFTERLYSNING"
        />
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
