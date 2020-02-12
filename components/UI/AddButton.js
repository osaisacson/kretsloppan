import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Alert
} from 'react-native';
//Constants
import Colors from '../../constants/Colors';

const AddButton = props => {
  let TouchableCmp = TouchableOpacity; //By default sets the wrapping component to be TouchableOpacity
  //If platform is android and the version is the one which supports the ripple effect
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
    //Set TouchableCmp to instead be TouchableNativeFeedback
  }

  return (
    <TouchableCmp>
      <View style={styles.buttonStyle}>
        <Text
          onPress={() => {
            console.log('--------clicked addButton------');
            Alert.alert('Clicked addButton');
          }}
          style={styles.buttonTextStyle}
        >
          +
        </Text>
      </View>
    </TouchableCmp>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: Colors.primary,
    shadowColor: 'black',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2, //Because shadow only work on iOS, elevation is same thing but for android.
    width: 66,
    height: 66,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20
  },
  buttonTextStyle: {
    color: 'white',
    fontSize: 45,
    marginBottom: 6
  }
});

export default AddButton;
