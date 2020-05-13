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

  return (
    //TouchableOpacity lets us press the whole item to trigger an action. The buttons still work independently.
    //'useForeground' has no effect on iOS but on Android it lets the ripple effect on touch spread throughout the whole element instead of just part of it
    <>
      <Divider />
      <View style={styles.container}>
        <View style={styles.touchable}>
          <TouchableCmp onPress={props.onSelect} useForeground>
            {props.itemData.status === 'löst' ? (
              <ResolvedBadge badgeText={'Löst!'} />
            ) : (
              <View style={styles.spacer}></View>
            )}
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
    paddingBottom: 15,
  },
  spacer: {
    height: 30,
  },
  title: {
    color: Colors.primary,
    width: 300,
    fontFamily: 'roboto-bold',
    fontSize: 18,
    marginLeft: 4,
  },
  subTitle: {
    color: Colors.primary,
    paddingBottom: 25,
    width: 300,
    fontFamily: 'roboto-light-italic',
    fontSize: 16,
    marginLeft: 4,
  },
});

export default TextItem;
