import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { useDispatch } from 'react-redux';

import * as profilesActions from '../store/actions/profiles';

const WalkthroughScreen = ({ currentProfile }) => {
  const dispatch = useDispatch();

  console.log('WALKTHROUGHSCREEN --- ---- ---- currentProfile: ', currentProfile);

  const slides = [
    {
      key: 'k1',
      title: 'Välkommen!',
      text:
        'Mer återbruk åt folket! Kretsloppan är ett verktyg för att hjälpa till att synliggöra och sprida återbruk.',
      backgroundColor: '#583451',
    },
    {
      key: 'k2',
      title: 'Dela/Hitta',
      text: 'Lägg upp ditt eget återbruk och hitta det andra lagt upp',
      backgroundColor: '#713f51',
    },
    {
      key: 'k3',
      title: 'Hantera',
      text: 'När du hittat ett återbruk du vill ha, reservera och föreslå en tid för upphämtning.',
      subText:
        'När säljaren godkänt tiden får du en notifikation. Då är det bara att dyka upp på överenskommen tid och plats.',
      backgroundColor: '#644EE2',
    },
    {
      key: 'k4',
      title: 'Följ återbrukets resa',
      text:
        'Du kan se vad som händer med återbruket efter det blivit återanvänt - kolla in Projekten för att se dess nya liv.',
      backgroundColor: '#b08ca1',
    },
    {
      key: 'k5',
      title: 'Nu kör vi!',
      image: true,
      isDark: true,
      backgroundColor: '#f9ddbf',
    },
  ];

  const renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ionicons name="md-arrow-round-forward" color="rgba(255, 255, 255, .9)" size={24} />
      </View>
    );
  };
  const renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ionicons name="md-checkmark" color="rgba(255, 255, 255, .9)" size={24} />
      </View>
    );
  };

  const onDoneAllSlides = () => {
    dispatch(profilesActions.updateWalkthrough(currentProfile.id));
  };

  const renderItem = ({ item }) => {
    return (
      <View style={{ ...styles.slide, backgroundColor: item.backgroundColor }}>
        <Text style={item.isDark ? { ...styles.title, ...styles.darkText } : styles.title}>
          {item.title}
        </Text>
        {item.image ? (
          <Image style={styles.image} source={require('./../assets/kretsloppan.png')} />
        ) : null}
        <Text style={item.isDark ? { ...styles.text, ...styles.darkText } : styles.text}>
          {item.text}
        </Text>
        <Text style={item.isDark ? { ...styles.text, ...styles.darkText } : styles.text}>
          {item.subText}
        </Text>
      </View>
    );
  };
  return (
    <AppIntroSlider
      renderItem={renderItem}
      data={slides}
      onDone={onDoneAllSlides}
      renderDoneButton={renderDoneButton}
      renderNextButton={renderNextButton}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  text: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 15,
  },
  darkText: {
    color: '#000',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  buttonCircle: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 100 / 2,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WalkthroughScreen;
