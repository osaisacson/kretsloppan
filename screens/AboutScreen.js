import React from 'react';
import { View, Text, StyleSheet, Linking, Image, SafeAreaView, ScrollView } from 'react-native';
import { Paragraph } from 'react-native-paper';

import SectionCard from '../components/UI/SectionCard';
import Colors from '../constants/Colors';

const AboutScreen = (props) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Image
          resizeMode="contain"
          style={styles.logoLarge}
          source={require('./../assets/icon.png')}
        />
        <Paragraph style={styles.paragraph}>
          Kretsloppan är skapad 2020 av Egnahemsfabriken och Orust Kretsloppsakademi med stöd av
          Vinnova - Sveriges Innovationsmyndighet.
        </Paragraph>
        <Paragraph style={styles.paragraph}>
          Målet är att synliggöra och främja användandet av återbruk, och att skapa en mötesplats
          där vi som bygger hållbart lätt kan dela resurser.
        </Paragraph>
        <SectionCard style={styles.sectionContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Egnahemsfabriken</Text>
            <Image
              resizeMode="contain"
              style={styles.logoSmall}
              source={require('./../assets/egnahemsfabriken.png')}
            />
          </View>
          <View>
            <Paragraph style={styles.paragraph}>
              Egnahemsfabriken Tjörn (grundat 2018) är ett innovationsprojekt och en stödstruktur
              för dig som vill bygga ditt eget hus eller hjälpa andra att bygga sina egna hus.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              Målet är att öppna fler vägar till egna hem åt fler och att etablera en
              gränsöverskridande mötesplats runt byggande och design på Tjörn.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              Projektet har initierats av civilsamhället med stöd av Tjörns kommun och byggs upp av
              oss som bor här, tillsammans. Egnahemsfabriken är öppen för alla och tillhör alla. En
              möjlighet att hjälpa andra eller att hjälpa sig själv till en bostad.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              <Text
                style={styles.link}
                onPress={() => Linking.openURL('https://www.egnahemsfabriken.se/')}>
                egnahemsfabriken.se
              </Text>
            </Paragraph>
          </View>
        </SectionCard>
        <SectionCard>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Orust kretsloppsakademi</Text>
            <Image
              resizeMode="contain"
              style={styles.logoSmall}
              source={require('./../assets/orustkretsloppsakademi.jpg')}
            />
          </View>
          <View>
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
        </SectionCard>
        <SectionCard>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Vinnova</Text>
            <Image
              resizeMode="contain"
              style={styles.logoSmall}
              source={require('./../assets/vinnova.png')}
            />
          </View>
          <View>
            <Paragraph style={styles.paragraph}>
              Vinnova är Sveriges innovationsmyndighet med uppdraget är att stärka Sveriges
              innovationsförmåga och bidra till hållbar tillväxt. De arbetar för att Sverige ska
              vara en innovativ kraft i en hållbar värld, baserat på de mål för hållbar utveckling
              som FN antagit i Agenda 2030.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              Kretsloppan är ett resultat av Vinnovas arbete med att identifiera utvecklingsområden
              där deras satsning gör skillnad och skapar samarbeten där kunskap och kompetens från
              olika håll möts, och där organisationer lär av varandra och arbetar tillsammans för
              att möta viktiga samhällsutmaningar.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              <Text
                style={styles.link}
                onPress={() => Linking.openURL('https://www.orustkretsloppsakademi.se/')}>
                orustkretsloppsakademi.se
              </Text>
            </Paragraph>
          </View>
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    marginHorizontal: 15,
  },
  sectionContainer: { marginTop: 80 },
  largeHeader: {
    marginHorizontal: 15,
    fontFamily: 'bebas-neue-bold',
    fontSize: 35,
    marginVertical: 15,
  },
  header: {
    fontFamily: 'bebas-neue-bold',
    fontSize: 22,
  },
  headerContainer: {
    marginHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paragraph: {
    marginHorizontal: 15,
    marginVertical: 10,
  },
  link: { color: Colors.primary, fontFamily: 'roboto-bold' },
  logoLarge: { width: 200, height: 130, alignSelf: 'center' },
  logoSmall: { width: 80, height: 100 },
});

export default AboutScreen;
