import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../../constants/Colors';

import TouchableCmp from './TouchableCmp';

const ButtonConfirm = ({
  style,
  disabled,
  onSelect,
  icon,
  title,
}) => {
  return (
    <>
      {disabled ? (
        <Button
          disabled
          buttonStyle={{ ...styles.button, ...styles.disabledButton }}
          titleStyle={[styles.label, styles.disabledLabel]}
          icon={icon}
          title={title}
          />
      ) : (
        <TouchableCmp>
          <Button
            raised
            buttonStyle={{ ...styles.button}}
            titleStyle={[styles.label]}
            onPress={onSelect}
            title={title}
            icon={icon}/>
        </TouchableCmp>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    borderRadius: 0
  },
  label: {
      color: "#fff",
    fontFamily: 'bebas-neue-bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: Colors.neutral
  },
  disabledLabel: {
    color: Colors.lightGrey
  },
});

export default ButtonConfirm;
