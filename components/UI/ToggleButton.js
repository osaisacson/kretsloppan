import React from 'react';
//Components
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const ToggleButton = props => {
  return (
    <Button
      mode="contained"
      style={{
        width: '60%',
        alignSelf: 'center'
      }}
      labelStyle={{
        paddingTop: 2,
        fontFamily: 'bebas-neue-bold',
        fontSize: 12
      }}
      compact={true}
      onPress={props.onSelect}
    >
      {props.title}
    </Button>
  );
};

const styles = StyleSheet.create({});

export default ToggleButton;

// import React, { useState } from 'react';
// //Components
// import { StyleSheet } from 'react-native';
// import Colors from '../../constants/Colors';
// import { Button } from 'react-native-paper';

// const ToggleButton = props => {
//   // const [isToggled, setIsToggled] = useState(false);

//   return (
//     <Button
//       color={props.color}
//       mode="contained"
//       disabled={props.disabled}
//       style={{
//         width: '60%',
//         alignSelf: 'center'
//       }}
//       labelStyle={{
//         paddingTop: 2,
//         fontFamily: 'bebas-neue-bold',
//         fontSize: 12
//       }}
//       compact={true}
//       onPress={props.onSelect}
//     >
//       {props.title}
//     </Button>
//   );
// };

// const styles = StyleSheet.create({});

// export default ToggleButton;
