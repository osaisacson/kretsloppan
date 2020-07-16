import React from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import Colors from '../../constants/Colors';

const Loader = ({ upload }) => {
  return (
    <View style={styles.centered}>
      {upload ? <Text>Laddar upp...</Text> : null}
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default Loader;
