import React from 'react';
import { Button } from 'react-native-paper';

const ButtonNormal = props => {
  return (
    <Button
      loading={props.isLoading}
      disabled={props.disabled ? props.disabled : false}
      mode="contained"
      style={{
        marginTop: 10,
        marginBottom: 20,
        width: '60%',
        alignSelf: 'center'
      }}
      labelStyle={{
        paddingTop: 2,
        fontFamily: 'bebas-neue-bold',
        fontSize: 14
      }}
      compact={true}
      onPress={props.actionOnPress}
    >
      {props.text}
    </Button>
  );
};

export default ButtonNormal;
