import React from 'react';
import { Platform, TouchableOpacity, TouchableNativeFeedback, StyleSheet } from 'react-native';
//Components
import { IconButton, Badge } from 'react-native-paper';

const ButtonIcon = (props) => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <TouchableCmp style={{ ...styles.container, ...props.style }}>
      <>
        {props.badge ? <Badge style={styles.badge}>{props.badge}</Badge> : null}
        <IconButton
          animated
          color="#fff"
          icon={props.icon}
          onPress={props.onSelect}
          size={props.size ? props.size : 20}
          style={{
            borderColor: props.borderColor ? props.borderColor : '#fff',
            borderWidth: 0.5,
            backgroundColor: props.color,
          }}
        />
      </>
    </TouchableCmp>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderColor: '#fff',
    borderWidth: 0.7,
    position: 'absolute',
    zIndex: 100,
  },
  container: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default ButtonIcon;
