import React from 'react';
//Components
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform
} from 'react-native';
import Card from './Card';
import { Ionicons } from '@expo/vector-icons';
//Constants
import Styles from '../../constants/Styles';

const ProjectItem = props => {
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
              <Image
                style={styles.image}
                source={{ uri: props.itemData.image }}
              />
            </View>
          </TouchableCmp>
        </View>
      </Card>
      <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.title}>
        {props.itemData.title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  product: {
    height: 250,
    width: '93%',
    margin: '1.5%',
    borderWidth: 0.5,
    borderColor: '#ddd',
    marginTop: 15
  },
  touchable: {
    borderRadius: Styles.borderRadius,
    overflow: 'hidden'
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderTopLeftRadius: Styles.borderRadius,
    borderTopRightRadius: Styles.borderRadius,
    overflow: 'hidden' //To make sure any child (in this case the image) cannot overlap what we set in the image container
  },
  icon: {
    position: 'absolute',
    padding: 5,
    zIndex: 99,
    shadowColor: 'black',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2 //Because shadow only work on iOS, elevation is same thing but for android.
  },
  image: {
    width: '100%',
    height: '100%'
  },
  title: {
    paddingLeft: 4,
    width: '90%',
    fontFamily: 'roboto-light-italic',
    fontSize: 16,
    marginLeft: 8
  }
});

export default ProjectItem;
