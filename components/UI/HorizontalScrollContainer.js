import React from 'react';
//Components
import { ScrollView, View } from 'react-native';
import HeaderTwo from './HeaderTwo';

const HorizontalScrollContainer = props => {
  //Change scrollHeight according to which component we are rendering
  let scrollHeight = 180;

  return (
    <ScrollView scrollEventThrottle={16}>
      <HeaderTwo
        title={props.title}
        subTitle={props.subTitle}
        extraSubTitle={props.extraSubTitle}
        icon={props.icon}
        showNotificationBadge={props.showNotificationBadge}
      />
      <View
        style={{
          flex: 1,
          height: scrollHeight
        }}
      >
        <View
          style={{
            height: scrollHeight,
            marginTop: 20
          }}
        >
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {props.children}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

export default HorizontalScrollContainer;
