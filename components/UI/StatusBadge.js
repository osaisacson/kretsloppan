import React from 'react';
import { Badge } from 'react-native-paper';

const StatusBadge = ({ style, text }) => {
  return (
    <Badge size={35} style={[style, { borderRadius: 5 }]}>
      {text}
    </Badge>
  );
};

export default StatusBadge;
