import React from 'react';
import { Button, View, StyleSheet, Text } from 'react-native';

import Colors from '../../constants/Colors';

const Error = ({ actionOnPress }) => {
  return (
    <View style={styles.centered}>
      <Text>Oj oj oj oj oj, något gick fel.</Text>
      <Button title="Försök igen" onPress={actionOnPress} color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default Error;
