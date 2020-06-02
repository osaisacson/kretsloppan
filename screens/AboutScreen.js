import React, { useState } from 'react';
import { View, Text, StyleSheet, Linking, Image } from 'react-native';
import { Paragraph } from 'react-native-paper';

import HeaderTwo from '../components/UI/HeaderTwo';
import Colors from '../constants/Colors';

const AboutScreen = (props) => {
  const [firstIsOpen, setFirstIsOpen] = useState(false);
  const [secondIsOpen, setSecondIsOpen] = useState(false);

  return (
    <View style={styles.screen}>
      <View style={styles.headerContainer} onPress={() => setFirstIsOpen(!!firstIsOpen)}>
        <Text style={styles.header}>Orust kretsloppsakademi</Text>
        <Text>{firstIsOpen ? 'close' : 'open'}</Text>
      </View>
      {firstIsOpen && (
        <View trigger={firstIsOpen}>
          <View>
            <Image
              resizeMode="contain"
              style={styles.logo}
              source={require('./../assets/orustkretsloppsakademi.png')}
            />
            <Paragraph style={styles.paragraph}>
              Orust Kretsloppsakademi (grundat 2012) bidrar till Sveriges åtagande med de 16
              miljömålen genom att stödja Orust som en föregångare mot ett sunt och hållbart
              samhälle.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              Visionen är att vara ett kunskapscentrum där förutsättningar skapas för Orust att bli
              ett hållbart kretsloppssamhälle, både miljömässigt (biologiskt – ekologiskt), socialt
              och ekonomiskt.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              Idag ser vi att det pågår många aktiviteteter för ett hållbart samhälle inom
              internationella, nationella, regionala och kommunala verksamheter. Vi känner dock att
              det går för trögt med reella positiva förändringar i människors vardag. Föreningen
              vill därför vara en resurs som kan nå alla inom vårt geografiska område och skapa en
              positiv kraft som får hjulen att rulla snabbare.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              <Text
                style={styles.link}
                onPress={() => Linking.openURL('https://www.orustkretsloppsakademi.se/')}>
                orustkretsloppsakademi.se
              </Text>
            </Paragraph>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    fontFamily: 'bebas-neue-bold',
    fontSize: 25,
  },
  paragraph: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  link: { color: Colors.primary, fontFamily: 'roboto-bold' },
  logo: { position: 'absolute', bottom: 25, right: 15, width: 180, overflow: 'visible' },
});

export default AboutScreen;
