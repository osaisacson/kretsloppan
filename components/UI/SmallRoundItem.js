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

import CachedImage from '../../components/UI/CachedImage';
import Colors from '../../constants/Colors';

const SmallRoundItem = (props) => {
  let TouchableCmp = TouchableOpacity; //By default sets the wrapping component to be TouchableOpacity
  //If platform is android and the version is the one which supports the ripple effect
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
    //Set TouchableCmp to instead be TouchableNativeFeedback
  }

  const selectItemHandler = (id, ownerId, title) => {
    props.navigation.navigate(props.detailPath, {
      detailId: id,
      ownerId,
      detailTitle: title,
    });
  };

  return (
    //TouchableOpacity lets us press the whole item to trigger an action. The buttons still work independently.
    //'useForeground' has no effect on iOS but on Android it lets the ripple effect on touch spread throughout the whole element instead of just part of it
    <View style={{ ...styles.project, ...props.style }}>
      <View style={styles.touchable}>
        <TouchableCmp
          onPress={() => {
            selectItemHandler(props.item.id, props.item.ownerId, props.item.title);
          }}
          useForeground>
          <View style={styles.imageContainer}>
            <CachedImage style={styles.image} uri={props.item.image} />
          </View>
        </TouchableCmp>
      </View>
      {props.showText ? (
        <Text
          style={{
            marginLeft: 10,
            textAlign: 'left',
            fontFamily: 'roboto-regular',
            fontSize: 14,
          }}>
          {props.item.title}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 100 / 2,
    height: '100%',
    width: '100%',
  },
  imageContainer: {
    borderRadius: 100 / 2,
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },

  project: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  touchable: {
    borderColor: '#000',
    borderRadius: 100 / 2,
    borderWidth: 0.1,
    height: 40,
    overflow: 'hidden',
    width: 40,
  },
});

export default SmallRoundItem;
