import React from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';

import Colors from '../../constants/Colors';

const Loader = (props) => {
  return (
    <View style={styles.centered}>
      {props.upload ? <Text>Laddar upp...</Text> : null}
      <ActivityIndicator color={Colors.primary} size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { alignItems: 'center', flex: 1, justifyContent: 'center' },
});

export default Loader;
