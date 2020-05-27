import React from 'react';
//Imports
import { ScrollView, View } from 'react-native';

import HeaderTwo from './HeaderTwo';

const HorizontalScrollContainer = (props) => {
  //Change scrollHeight according to which component we are rendering
  const scrollHeight = props.scrollHeight ? props.scrollHeight : 200;

  return (
    <ScrollView scrollEventThrottle={16}>
      {props.title ? (
        <HeaderTwo
          title={props.title}
          subTitle={props.subTitle}
          extraSubTitle={props.extraSubTitle}
          questionText={props.questionText}
          icon={props.icon}
          showNotificationBadge={props.showNotificationBadge}
        />
      ) : null}
      <View
        style={{
          height: scrollHeight,
          marginTop: 20,
        }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {props.children}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default HorizontalScrollContainer;
