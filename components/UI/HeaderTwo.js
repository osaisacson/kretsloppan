import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Badge, Button } from 'react-native-paper';

import Colors from './../../constants/Colors';

const HeaderTwo = (props) => {
  const extraStyle = props.buttonText ? { maxWidth: '80%' } : { maxWidth: '99%' };
  return (
    <View style={styles.headerContainer}>
      <View style={[styles.textSection, extraStyle]}>
        <View style={styles.textAndBadge}>
          {props.icon ? props.icon : null}
          <Text style={styles.contentHeader}>{props.title}</Text>
          {props.showNotificationBadge ? (
            <Badge style={{ fontWeight: 'bold', marginBottom: 5 }}>{props.indicator}</Badge>
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
    flexGrow: 3,
  },
  indicatorSection: {
    flexGrow: 1,
    marginRight: 5,
  },
  textAndBadge: {
    flexDirection: 'row',
    alignItems: 'center',
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
});

export default HeaderTwo;
