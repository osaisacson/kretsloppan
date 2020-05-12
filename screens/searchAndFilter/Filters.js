import React from 'react';
//Components
import { ScrollView, View } from 'react-native';
import HeaderTwo from './../../components/UI/HeaderTwo';

const Filters = (props) => {
  //Change scrollHeight according to which component we are rendering
  let scrollHeight = props.scrollHeight ? props.scrollHeight : 160;

  return (
    <ScrollView scrollEventThrottle={16}>
      {props.title ? (
        <HeaderTwo
          title={props.title}
          subTitle={props.subTitle}
          extraSubTitle={props.extraSubTitle}
          questionText={'Filter för återbruk'}
          icon={props.icon}
          showNotificationBadge={props.showNotificationBadge}
        />
      ) : null}
      <View
        style={{
          height: scrollHeight,
          marginTop: 20,
        }}
      >
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {props.children}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default Filters;
