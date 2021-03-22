import React from 'react';
import { ScrollView, View } from 'react-native';

import HeaderTwo from './HeaderTwo';

const HorizontalScrollContainer = ({
  scrollHeight,
  title,
  subTitle,
  extraSubTitle,
  icon,
  showNotificationBadge,
  children,
}) => {
  //Change scrollHeight according to which component we are rendering
  const scrollHeightLocal = scrollHeight ? scrollHeight : 200;

  return (
    <ScrollView scrollEventThrottle={16}>
      {title ? (
        <HeaderTwo title={title} icon={icon} showNotificationBadge={showNotificationBadge} />
      ) : null}
      <View
        style={{
          height: scrollHeightLocal,
          marginTop: 20,
        }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {children}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default HorizontalScrollContainer;
