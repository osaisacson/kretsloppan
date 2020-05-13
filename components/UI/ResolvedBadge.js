import React from 'react';
//Components
import { Badge } from 'react-native-paper';
import Colors from '../../constants/Colors';

const ResolvedBadge = (props) => {
  return (
    <Badge
      style={{
        transform: [{ rotate: '-2deg' }],
        alignSelf: 'flex-start',
        backgroundColor: Colors.success,
        width: 40,
      }}
    >
      Löst!
    </Badge>
  );
};

export default ResolvedBadge;
