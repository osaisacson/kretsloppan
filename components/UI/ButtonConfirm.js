import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../../constants/Colors';

import TouchableCmp from './TouchableCmp';

const ButtonConfirm = ({ style, disabled, onSelect, icon, title, titleStyle }) => {
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
            buttonStyle={{ ...styles.button, ...style }}
            titleStyle={{ ...styles.label, ...titleStyle }}
            onPress={onSelect}
            title={title}
            icon={icon}
          />
        </TouchableCmp>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.completed,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  label: {
    color: '#fff',
    fontFamily: 'bebas-neue-bold',
    marginTop: 3,
  },
  disabledButton: {
    backgroundColor: Colors.neutral,
  },
  disabledLabel: {
    color: Colors.lightGrey,
  },
});

export default ButtonConfirm;
