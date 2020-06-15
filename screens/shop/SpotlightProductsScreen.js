import { MaterialCommunityIcons, Entypo, FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, Image } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Button } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';

import HorizontalScroll from '../../components/UI/HorizontalScroll';
import Introduction from '../../components/UI/Introduction';
import SaferArea from '../../components/UI/SaferArea';
import * as profilesActions from '../../store/actions/profiles';

const SpotlightProductsScreen = (props) => {
  const allProducts = useSelector((state) => state.products.availableProducts);
  const allProjects = useSelector((state) => state.projects.availableProjects);
  const allProposals = useSelector((state) => state.proposals.availableProposals);
  const currentProfile = useSelector((state) => state.profiles.userProfile);
  const [showWalkthrough, setShowWalkthrough] = useState(true);

  const dispatch = useDispatch();

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

  //Filters all products with the tag 'redo'
  const recentProductsRaw = allProducts.filter(
    (product) => product.status === 'redo' || product.status === ''
  );

  const recentProductsSorted = recentProductsRaw.sort(function (a, b) {
    a = new Date(a.readyDate);
    b = new Date(b.readyDate);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  const recentProjectsSorted = allProjects.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  const recentProposalsSorted = allProposals.sort(function (a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    return a > b ? -1 : a < b ? 1 : 0;
  });
  const recentProducts = recentProductsSorted.slice(0, 5);
  const recentProjects = recentProjectsSorted.slice(0, 5);
  const recentProposals = recentProposalsSorted.slice(0, 5);

  const renderDoneButton = () => {
    return <Button>Klar!</Button>;
  };

  const onDoneAllSlides = () => {
    dispatch(profilesActions.updateWalkthrough(currentProfile.id));
    setShowWalkthrough(false);
  };

  const renderItem = ({ item }) => {
    return (
      <View style={{ ...styles.slide, backgroundColor: item.backgroundColor }}>
        <Text style={item.isDark ? { ...styles.title, ...styles.darkText } : styles.title}>
          {item.title}
        </Text>
        {item.image ? (
          <Image style={styles.image} source={require('./../../assets/kretsloppan.png')} />
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
  if (showWalkthrough && !currentProfile.hasWalkedThrough) {
    return (
      <AppIntroSlider
        renderItem={renderItem}
        data={slides}
        onDone={onDoneAllSlides}
        renderDoneButton={renderDoneButton}
      />
    );
  }
  return (
    <SaferArea>
      {!currentProfile.hasReadNews ? (
        <Introduction
          currUserId={currentProfile.id}
          hasReadNews={currentProfile.hasReadNews}
          pic="https://images.unsplash.com/photo-1541848756149-e3843fcbbde0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1663&q=80"
          text="NYHETER: Kretsloppan släppt, hurra! För feedback kontakta asaisacson@gmail.com, vi gör kontinuerliga uppdateringar. Version: 1.0-beta3"
        />
      ) : null}
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <HorizontalScroll
          largeImageItem
          detailPath="ProjectDetail"
          title="Senaste Projekten"
          subTitle="Projekt som byggs med återbruk"
          showAddLink={() => props.navigation.navigate('EditProject')}
          showMoreLink={() => props.navigation.navigate('Projekt')}
          showMoreLinkName={`Se alla projekt (${allProjects.length})`}
          scrollData={recentProjects}
          navigation={props.navigation}
          icon={
            <Entypo
              name="tools"
              size={21}
              style={{
                marginRight: 5,
              }}
            />
          }
        />
        <HorizontalScroll
          title="Senaste Återbruket"
          subTitle="Senast tillgängliga återbruket"
          showAddLink={() => props.navigation.navigate('EditProduct')}
          showMoreLink={() => props.navigation.navigate('Återbruk')}
          showMoreLinkName={`Se allt återbruk (${allProducts.length})`}
          scrollData={recentProducts}
          navigation={props.navigation}
          icon={
            <FontAwesome5
              name="recycle"
              size={21}
              style={{
                marginRight: 5,
              }}
            />
          }
        />
        <HorizontalScroll
          textItem
          detailPath="ProposalDetail"
          title="Senaste efterlysningarna"
          subTitle="Kontakta efterlysaren om du sitter på svaret"
          showAddLink={() => props.navigation.navigate('EditProposal')}
          showMoreLink={() => props.navigation.navigate('Efterlysningar')}
          showMoreLinkName={`Se alla efterlysningar (${allProposals.length})`}
          scrollData={recentProposals}
          navigation={props.navigation}
          icon={
            <MaterialCommunityIcons
              name="alert-decagram-outline"
              size={24}
              style={{
                marginRight: 3,
              }}
            />
          }
        />
      </ScrollView>
    </SaferArea>
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
});

export default SpotlightProductsScreen;
