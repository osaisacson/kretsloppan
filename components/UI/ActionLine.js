import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';

import Colors from '../../constants/Colors';

const ActionLine = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
        backgroundColor: Colors.lightPrimary,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
      }}>
      <Text
        style={{
          color: Colors.darkPrimary,
          fontSize: 16,
        }}>
        {props.isActive ? 'Dölj' : 'Visa'}{' '}
      </Text>
      <Animatable.View
        animation="pulse"
        easing="ease-out"
        duration={500}
        iterationCount="infinite"
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: 30,
          height: 30,
          backgroundColor: Colors.indicator,
          borderRadius: 50,
        }}>
        <Text style={{ color: '#fff' }}>{props.badgeNr}</Text>
      </Animatable.View>
      <Text
        style={{
          color: Colors.darkPrimary,
          fontSize: 16,
        }}>
        {' '}
        återbruk som väntar på din aktion
      </Text>
    </TouchableOpacity>
  );
};

export default ActionLine;
