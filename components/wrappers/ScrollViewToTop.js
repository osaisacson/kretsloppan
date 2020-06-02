import { useScrollToTop } from '@react-navigation/native';
import React from 'react';
import { ScrollView } from 'react-native';

const ScrollViewToTop = (props) => {
  const ref = React.useRef(null);
  useScrollToTop(ref);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      ref={ref}>
      {props.children}
    </ScrollView>
  );
};

export default ScrollViewToTop;
