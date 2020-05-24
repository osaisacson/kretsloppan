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
import Card from './Card';

const ProjectItem = (props) => {
  let TouchableCmp = TouchableOpacity; //By default sets the wrapping component to be TouchableOpacity
  //If platform is android and the version is the one which supports the ripple effect
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
    //Set TouchableCmp to instead be TouchableNativeFeedback
  }

  return (
    //TouchableOpacity lets us press the whole item to trigger an action. The buttons still work independently.
    //'useForeground' has no effect on iOS but on Android it lets the ripple effect on touch spread throughout the whole element instead of just part of it
    <View style={styles.container}>
      <Card style={styles.product}>
        <View style={styles.touchable}>
          <TouchableCmp onPress={props.onSelect} useForeground>
            <View style={styles.imageContainer}>
              <CachedImage style={styles.image} uri={props.itemData.image} />
            </View>
          </TouchableCmp>
        </View>
      </Card>
      <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>
        {props.itemData.title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  imageContainer: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    width: '100%', //To make sure any child (in this case the image) cannot overlap what we set in the image container
  },
  product: {
    borderColor: '#ddd',
    borderWidth: 0.5,
    height: 250,
    margin: '1.5%',
    marginTop: 15,
    width: '93%',
  },
  title: {
    fontFamily: 'roboto-light-italic',
    fontSize: 16,
    marginLeft: 8,
    paddingLeft: 4,
    width: '90%',
  },
  touchable: {
    borderRadius: 5,
    overflow: 'hidden',
  },
});

export default ProjectItem;
