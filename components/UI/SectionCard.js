import React from 'react';
import { Card } from 'react-native-paper';

const SectionCard = (props) => {
  return (
    <Card
      style={{
        paddingHorizontal: 6,
        paddingVertical: 10,

        marginVertical: 5,
      }}>
      {props.children}
    </Card>
  );
};

export default SectionCard;
