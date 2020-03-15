import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform
} from 'react-native';
import { Badge } from 'react-native-paper';
import { Tooltip, Text } from 'react-native-elements';
import Colors from './../../constants/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const HeaderTwo = props => {
  let TouchableCmp = TouchableOpacity; //By default sets the wrapping component to be TouchableOpacity
  //If platform is android and the version is the one which supports the ripple effect
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
    //Set TouchableCmp to instead be TouchableNativeFeedback
  }
  return (
    <View style={styles.headerContainer}>
      <View>
        <View style={styles.textAndBadge}>
          {props.icon ? props.icon : null}
          <Text style={styles.contentHeader}>{props.title}</Text>
          {props.showNotificationBadge ? (
            <Badge style={{ marginBottom: 5, fontWeight: 'bold' }}>
              {props.indicator}
            </Badge>
          ) : null}
        </View>
        <Text style={styles.subTitle}>{props.subTitle}</Text>
        {props.extraSubTitle ? (
          <Text style={styles.extraSubTitle}>{props.extraSubTitle}</Text>
        ) : null}
      </View>
      {props.questionText ? (
        <TouchableCmp style={styles.questionMarkSection} useForeground>
          <Tooltip
            width={250}
            containerStyle={{ flexWrap: 'wrap' }}
            backgroundColor={'#c0c0c0'}
            popover={<Text>{props.questionText}</Text>}
          >
            <FontAwesome
              name={'question'}
              size={15}
              color={'#fff'}
            ></FontAwesome>
          </Tooltip>
        </TouchableCmp>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  textAndBadge: {
    flexDirection: 'row',
    paddingLeft: 15,
    paddingTop: 20,
    alignItems: 'baseline'
  },
  contentHeader: {
    fontFamily: 'bebas-neue-bold',
    fontSize: 25,
    marginRight: 6
  },
  indicator: {
    fontFamily: 'roboto-regular',
    fontSize: 16,
    paddingBottom: 2
  },
  subTitle: {
    fontFamily: 'roboto-light-italic',
    fontSize: 16,
    paddingLeft: 15,
    paddingBottom: 2
  },
  extraSubTitle: {
    fontFamily: 'roboto-bold-italic',
    fontSize: 16,
    paddingLeft: 15,
    paddingBottom: 2
  },
  questionMarkSection: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
    width: 20,
    marginRight: 10,
    backgroundColor: Colors.neutral,
    borderRadius: 100 / 2
  },
  questionMark: {
    color: '#fff'
  }
});

export default HeaderTwo;
