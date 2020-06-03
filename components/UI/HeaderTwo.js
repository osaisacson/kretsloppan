import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Badge, Button } from 'react-native-paper';

import Colors from './../../constants/Colors';
import ButtonIcon from './ButtonIcon';

const HeaderTwo = (props) => {
  const {
    icon,
    title,
    subTitle,
    extraSubTitle,
    indicator,
    buttonText,
    buttonIcon,
    buttonOnPress,
    showNotificationBadge,
    isNavigationButton,
  } = props;
  const extraStyle = buttonText ? { maxWidth: '80%' } : { maxWidth: '99%' };
  return (
    <View style={styles.headerContainer}>
      <View style={[styles.textSection, extraStyle]}>
        <View style={styles.textAndBadge}>
          {icon ? icon : null}
          <Text style={styles.contentHeader}>{title}</Text>
          {showNotificationBadge ? (
            <Badge style={{ fontWeight: 'bold', marginBottom: 5 }}>{indicator}</Badge>
          ) : null}
        </View>
        <Text style={styles.subTitle}>{subTitle}</Text>
        {extraSubTitle ? <Text style={styles.extraSubTitle}>{extraSubTitle}</Text> : null}
      </View>
      <View style={styles.indicatorSection}>
        {!buttonText && buttonIcon && (
          <View style={{ alignSelf: 'flex-end' }}>
            <ButtonIcon
              icon="dots-horizontal"
              onSelect={buttonOnPress}
              color={Colors.darkPrimary}
            />
          </View>
        )}
        {buttonText ? (
          <Button
            color={isNavigationButton ? Colors.darkPrimary : null}
            style={{ marginRight: 5, paddingHorizontal: 0 }}
            labelStyle={{
              marginLeft: 4,
              marginRight: buttonIcon ? 11 : 4,
              paddingLeft: 0,
              paddingRight: 0,
              fontSize: 10,
            }}
            icon={buttonIcon}
            mode="contained"
            onPress={buttonOnPress}>
            {buttonText}
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
