import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from 'react-native';
import { Tooltip } from 'react-native-elements';
import { Badge, Button } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Colors from './../../constants/Colors';

const HeaderTwo = (props) => {
  let TouchableCmp = TouchableOpacity; //By default sets the wrapping component to be TouchableOpacity
  //If platform is android and the version is the one which supports the ripple effect
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
    //Set TouchableCmp to instead be TouchableNativeFeedback
  }
  return (
    <View style={styles.headerContainer}>
      <View style={styles.textSection}>
        <View style={styles.textAndBadge}>
          {props.icon ? props.icon : null}
          <Text style={styles.contentHeader}>{props.title}</Text>
          {props.showNotificationBadge ? (
            <Badge style={{ marginBottom: 5, fontWeight: 'bold' }}>{props.indicator}</Badge>
          ) : null}
        </View>
        <Text style={styles.subTitle}>{props.subTitle}</Text>
        {props.extraSubTitle ? (
          <Text style={styles.extraSubTitle}>{props.extraSubTitle}</Text>
        ) : null}
      </View>
      <View style={styles.indicatorSection}>
        {props.buttonText ? (
          <Button
            color={props.isNavigationButton ? Colors.darkPrimary : null}
            style={{ marginRight: 5, paddingHorizontal: 0 }}
            labelStyle={{
              marginLeft: 4,
              marginRight: props.buttonIcon ? 11 : 4,
              paddingLeft: 0,
              paddingRight: 0,
              fontSize: 10,
            }}
            icon={props.buttonIcon}
            mode="contained"
            onPress={props.buttonOnPress}>
            {props.buttonText}
          </Button>
        ) : null}
        {props.questionText ? (
          <TouchableCmp style={styles.questionMarkSection} useForeground>
            <Tooltip
              width={250}
              containerStyle={{ flexWrap: 'wrap' }}
              backgroundColor="#c0c0c0"
              popover={<Text>{props.questionText}</Text>}>
              <FontAwesome name="question" size={15} color="#fff" />
            </Tooltip>
          </TouchableCmp>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  textSection: {
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 10,
    paddingBottom: 2,
    maxWidth: '80%',
    flexGrow: 3,
  },
  indicatorSection: {
    flexGrow: 1,
    marginRight: 5,
  },
  textAndBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  contentHeader: {
    fontFamily: 'bebas-neue-bold',
    fontSize: 25,
    marginRight: 6,
  },
  indicator: {
    fontFamily: 'roboto-regular',
    fontSize: 16,
    paddingBottom: 2,
  },
  subTitle: {
    fontFamily: 'roboto-light-italic',
    fontSize: 16,
  },
  extraSubTitle: {
    fontFamily: 'roboto-bold-italic',
    fontSize: 16,
  },
  questionMarkSection: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
    width: 20,
    marginRight: 10,
    backgroundColor: Colors.neutral,
    borderRadius: 100 / 2,
  },
  questionMark: {
    color: '#fff',
  },
});

export default HeaderTwo;
