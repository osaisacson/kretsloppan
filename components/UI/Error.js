import React from 'react';
import { Button, View, StyleSheet, Text } from 'react-native';

import Colors from '../../constants/Colors';

const Error = (props) => {
  return (
    <View style={styles.centered}>
      <Text>Oj oj oj oj oj, något gick fel.</Text>
      <Button color={Colors.primary} onPress={props.actionOnPress} title="Försök igen" />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { alignItems: 'center', flex: 1, justifyContent: 'center' },
});

export default Error;
