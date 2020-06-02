import React from 'react';
import { View, Text, StyleSheet, Linking, Image, Dimensions } from 'react-native';
import { Paragraph } from 'react-native-paper';

import HeaderTwo from '../components/UI/HeaderTwo';
import Colors from '../constants/Colors';

const { width } = Dimensions.get('window');

const AboutScreen = (props) => {
  return (
    <View style={styles.screen}>
      <Image
        resizeMode="contain"
        style={styles.logo}
        source={require('./../assets/orustkretsloppsakademi.png')}
      />

      <HeaderTwo title="Orust kretsloppsakademi" />
      <Paragraph style={styles.paragraph}>
        Orust Kretsloppsakademi (grundat 2012) bidrar till Sveriges åtagande med de 16 miljömålen
        genom att stödja Orust som en föregångare mot ett sunt och hållbart samhälle.
      </Paragraph>
      <Paragraph style={styles.paragraph}>
        Visionen är att vara ett kunskapscentrum där förutsättningar skapas för Orust att bli ett
        hållbart kretsloppssamhälle, både miljömässigt (biologiskt – ekologiskt), socialt och
        ekonomiskt.
      </Paragraph>
      <Paragraph style={styles.paragraph}>
        Idag ser vi att det pågår många aktiviteteter för ett hållbart samhälle inom
        internationella, nationella, regionala och vissa kommunala verksamheter. Vi känner dock att
        det går för trögt med reella positiva förändringar i människors vardag. Föreningen vill
        därför vara en resurs som kan nå alla inom vårt geografiska område och skapa en positiv
        kraft som får hjulen att rulla snabbare.
      </Paragraph>
      <Paragraph style={styles.paragraph}>
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://www.orustkretsloppsakademi.se/')}>
          orustkretsloppsakademi.se
        </Text>
      </Paragraph>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
  },
  paragraph: {
    padding: 15,
  },
  link: { color: Colors.primary, fontFamily: 'roboto-bold' },
  logo: { position: 'absolute', bottom: 15, right: 15, width: 180, overflow: 'visible' },
});

export default AboutScreen;
