import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Badge } from 'react-native-paper';
import { pure } from 'recompose';

import Styles from './../../constants/Styles';
import Colors from './../../constants/Colors';

import { Button } from 'react-native-paper';

import ButtonSeeMore from './ButtonSeeMore';

const HeaderTwo = ({
  icon,
  title,
  indicator,
  simpleCount,
  showAddLink,
  showMoreLink,
  isSearch,
  nrToShow,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.textAndBadge}>
        <View>{icon ? icon : null}</View>
        <Text style={Styles.contentHeader}>{title}</Text>
        {simpleCount ? (
          <Text style={Styles.searchResults}>
            {isSearch ? `${simpleCount} Hittade` : `(${simpleCount})`}
          </Text>
        ) : null}
        {indicator ? (
          <Badge size={25} style={{ fontWeight: 'bold', marginBottom: 6 }}>
            {indicator}
          </Badge>
        ) : null}
      </View>

      <View style={styles.rightHandButtons}>
        {showMoreLink ? <ButtonSeeMore nrToShow={nrToShow} onSelect={showMoreLink} /> : null}
        {showAddLink ? (
          <Button
            icon="plus"
            mode="text"
            labelStyle={{
              fontFamily: 'roboto-bold',
              fontSize: 13,
            }}
            color={Colors.darkPrimary}
            onSelect={showAddLink}>
            Lägg till ny
          </Button>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    paddingLeft: 10,
    paddingBottom: 5,
    width: '100%',
  },
  textAndBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightHandButtons: {
    flexDirection: 'row',
  },
});

export default pure(HeaderTwo);
