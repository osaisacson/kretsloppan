import React from 'react';
//Components
import { Badge } from 'react-native-paper';

import Colors from '../../constants/Colors';

const ResolvedBadge = (props) => {
  return (
    <Badge
      style={{
        color: '#fff',
        transform: [{ rotate: '-2deg' }],
        alignSelf: 'flex-start',
        backgroundColor: Colors.completed,
        width: 40,
        marginTop: 11,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
      {props.badgeText}
    </Badge>
  );
};

export default ResolvedBadge;
