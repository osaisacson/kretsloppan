import React from 'react';

//Components
import { Chip } from 'react-native-paper';

//Constants
import Colors from '../../constants/Colors';

const FilterLine = (props) => {
  const { filter } = props;

  return filter ? (
    <Chip
      textStyle={{
        fontSize: 11,
        color: '#fff',
      }}
      style={{
        backgroundColor: '#a2a2a2',
        marginHorizontal: 2,
        marginVertical: 8,
      }}
    >
      {filter}
    </Chip>
  ) : null;
};

export default FilterLine;
