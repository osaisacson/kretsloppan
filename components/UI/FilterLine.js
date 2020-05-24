import React from 'react';
//Components
import { View, Text } from 'react-native';

const FilterLine = (props) => {
  const { filter } = props;

  return filter ? (
    <View
      style={{
        borderRadius: 20,
        backgroundColor: '#a2a2a2',
        marginHorizontal: 2,
        marginVertical: 8,
      }}>
      <Text
        style={{
          paddingVertical: 5,
          paddingHorizontal: 8,
          textTransform: 'uppercase',
          fontSize: 11,
          color: '#fff',
        }}>
        {filter}
      </Text>
    </View>
  ) : null;
};

export default FilterLine;
