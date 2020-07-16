import React from 'react';
import { StyleSheet } from 'react-native';
import { IconButton, Badge } from 'react-native-paper';

import TouchableCmp from './TouchableCmp';

const ButtonIcon = ({ style, badge, icon, size, borderColor, color, onSelect }) => {
  return (
    <TouchableCmp style={{ ...styles.container, ...style }}>
      {badge ? <Badge style={styles.badge}>{badge}</Badge> : null}
      <IconButton
        icon={icon}
        size={size ? size : 20}
        animated
        color="#fff"
        style={{
          borderColor: borderColor ? borderColor : '#fff',
          borderWidth: 0.5,
          backgroundColor: color,
        }}
        onPress={onSelect}
      />
    </TouchableCmp>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  badge: {
    borderWidth: 0.7,
    borderColor: '#fff',
    position: 'absolute',
    zIndex: 100,
  },
});

export default ButtonIcon;
