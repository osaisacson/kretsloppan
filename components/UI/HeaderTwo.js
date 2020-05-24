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
// eslint-disable-next-line import/no-unresolved
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
            icon={props.buttonIcon}
            labelStyle={{
              marginLeft: 4,
              marginRight: props.buttonIcon ? 11 : 4,
              paddingLeft: 0,
              paddingRight: 0,
              fontSize: 10,
            }}
            mode="contained"
            onPress={props.buttonOnPress}
            style={{ marginRight: 5, paddingHorizontal: 0 }}>
            {props.buttonText}
          </Button>
        ) : null}
        {props.questionText ? (
          <TouchableCmp style={styles.questionMarkSection} useForeground>
            <Tooltip
              backgroundColor="#c0c0c0"
              containerStyle={{ flexWrap: 'wrap' }}
              popover={<Text>{props.questionText}</Text>}
              width={250}>
              <FontAwesome color="#fff" name="question" size={15} />
            </Tooltip>
          </TouchableCmp>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentHeader: {
    fontFamily: 'bebas-neue-bold',
    fontSize: 25,
    marginRight: 6,
  },
  extraSubTitle: {
    fontFamily: 'roboto-bold-italic',
    fontSize: 16,
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  indicatorSection: {
    flexGrow: 1,
    marginRight: 5,
  },
  questionMarkSection: {
    alignItems: 'center',
    backgroundColor: Colors.neutral,
    borderRadius: 100 / 2,
    height: 20,
    justifyContent: 'center',
    marginRight: 10,
    width: 20,
  },
  subTitle: {
    fontFamily: 'roboto-light-italic',
    fontSize: 16,
  },
  textAndBadge: {
    alignItems: 'baseline',
    flexDirection: 'row',
  },
  textSection: {
    flexGrow: 3,
    maxWidth: '80%',
    paddingBottom: 2,
    paddingLeft: 15,
    paddingRight: 10,
    paddingTop: 20,
  },
});

export default HeaderTwo;
