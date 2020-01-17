import React from 'react';
import { Button, View, StyleSheet, Text } from 'react-native';
import Colors from '../../constants/Colors';

const Loader = props => {
  return (
    <View style={styles.centered}>
      <Text>Oj oj oj oj oj, något gick fel.</Text>
      <Button
        title="Försök igen"
        onPress={props.actionOnPress}
        color={Colors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default Loader;
