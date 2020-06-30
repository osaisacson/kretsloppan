import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Badge } from 'react-native-paper';

import Colors from './../../constants/Colors';
import ButtonAdd from './ButtonAdd';
import ButtonIcon from './ButtonIcon';

const HeaderTwo = (props) => {
  const {
    icon,
    title,
    subTitle,
    extraSubTitle,
    indicator,
    buttonText,
    buttonOnPress,
    simpleCount,
    showAddLink,
    showNotificationBadge,
  } = props;
  const extraStyle = buttonText ? { maxWidth: '80%' } : { maxWidth: '99%' };
  return (
    <View style={styles.headerContainer}>
      <View style={[styles.textSection, extraStyle]}>
        <View style={styles.textAndBadge}>
          {icon ? icon : null}
          <Text style={styles.contentHeader}>{title}</Text>
          {simpleCount ? (
            <Text style={props.isSearch ? styles.simpleCountForSearch : styles.simpleCount}>
              {props.isSearch ? `${simpleCount} Hittade` : `(${simpleCount})`}
            </Text>
          ) : null}
          {showNotificationBadge ? (
            <Badge style={{ fontWeight: 'bold', marginBottom: 5 }}>{indicator}</Badge>
          ) : null}
        </View>
        {subTitle ? <Text style={styles.subTitle}>{subTitle}</Text> : null}
        {extraSubTitle ? <Text style={styles.extraSubTitle}>{extraSubTitle}</Text> : null}
      </View>
      <View style={styles.indicatorSection}>
        {showAddLink ? (
          <View style={{ alignSelf: 'flex-end' }}>
            <ButtonIcon icon="plus" onSelect={showAddLink} color={Colors.darkPrimary} />
          </View>
        ) : null}
        {buttonText ? <ButtonAdd title={buttonText} onPress={buttonOnPress} /> : null}
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
  simpleCount: {
    fontFamily: 'roboto-regular',
    fontSize: 18,
    marginBottom: 5,
  },
  simpleCountForSearch: {
    fontFamily: 'roboto-light-italic',
    fontSize: 16,
    marginBottom: 15,
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
