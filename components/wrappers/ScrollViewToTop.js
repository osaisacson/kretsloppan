import React from 'react';
import { ScrollView } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';

const ScrollViewToTop = props => {
  const ref = React.useRef(null);
  useScrollToTop(ref);
  return <ScrollView ref={ref}>{props.children}</ScrollView>;
};

export default ScrollViewToTop;
