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
    <View style={styles.project}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          {/* This extra View is needed to make sure it fulfills the criteria of child nesting on Android */}
          <View>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{ uri: props.itemData.image }}
              />
            </View>
          </View>
        </TouchableCmp>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  project: {
    height: 80,
    width: 80,
    marginLeft: 10,
    borderWidth: 0.5,
    borderRadius: 100 / 2,
    borderColor: '#ddd'
  },
  touchable: {
    height: 80,
    width: 80,
    borderRadius: 100 / 2,
    overflow: 'hidden'
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: 100 / 2,
    overflow: 'hidden' //To make sure any child (in this case the image) cannot overlap what we set in the image container
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 100 / 2
  },
  details: {
    color: '#000'
  },
  title: {
    width: '90%',
    fontFamily: 'roboto-regular',
    fontSize: 16,
    marginLeft: 8
  }
});

export default ProjectItem;
