import React from 'react';
//Components
import { ScrollView, View } from 'react-native';

import HeaderTwo from './HeaderTwo';

const HorizontalScrollContainer = (props) => {
  //Change scrollHeight according to which component we are rendering
  const scrollHeight = props.scrollHeight ? props.scrollHeight : 160;

  return (
    <ScrollView scrollEventThrottle={16}>
      {props.title ? (
        <HeaderTwo
          extraSubTitle={props.extraSubTitle}
          icon={props.icon}
          questionText={props.questionText}
          showNotificationBadge={props.showNotificationBadge}
          subTitle={props.subTitle}
          title={props.title}
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
