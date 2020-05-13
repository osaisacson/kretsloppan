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
import { Divider } from 'react-native-paper';
import ResolvedBadge from '../../components/UI/ResolvedBadge';
//Constants
import Colors from '../../constants/Colors';

const TextItem = (props) => {
  let TouchableCmp = TouchableOpacity; //By default sets the wrapping component to be TouchableOpacity
  //If platform is android and the version is the one which supports the ripple effect
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
    //Set TouchableCmp to instead be TouchableNativeFeedback
  }
  console.log(props.itemData);

  return (
    //TouchableOpacity lets us press the whole item to trigger an action. The buttons still work independently.
    //'useForeground' has no effect on iOS but on Android it lets the ripple effect on touch spread throughout the whole element instead of just part of it
    <>
      <Divider />
      <View style={styles.container}>
        <View style={styles.touchable}>
          <TouchableCmp onPress={props.onSelect} useForeground>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.title}>
              {props.itemData.title}
            </Text>
            <Text
              numberOfLines={2}
              ellipsizeMode={'tail'}
              style={styles.subTitle}
            >
              {props.itemData.description}
            </Text>
            {props.itemData.status === 'löst' && <ResolvedBadge />}
          </TouchableCmp>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 15,
  },
  touchable: {
    overflow: 'hidden',
    marginRight: 25,
  },
  title: {
    color: Colors.primary,
    paddingTop: 25,
    width: 280,
    fontFamily: 'roboto-bold',
    fontSize: 18,
  },
  subTitle: {
    color: Colors.primary,
    paddingBottom: 25,
    width: 280,
    fontFamily: 'roboto-light-italic',
    fontSize: 16,
  },
});

export default TextItem;
