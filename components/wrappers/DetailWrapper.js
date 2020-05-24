import React from 'react';
import { View, StyleSheet } from 'react-native';

//Components
import SaferArea from '../UI/SaferArea';
import ScrollViewToTop from './ScrollViewToTop';
//Constants

export const DetailWrapper = (props) => {
  return (
    <SaferArea>
      <ScrollViewToTop>
        <View style={detailStyles.mainDetailWrap}>{props.children}</View>
      </ScrollViewToTop>
    </SaferArea>
  );
};

export const detailStyles = StyleSheet.create({
  mainDetailWrap: {
    flex: 1,
    marginBottom: 50,
    marginHorizontal: 8,
  },
});
