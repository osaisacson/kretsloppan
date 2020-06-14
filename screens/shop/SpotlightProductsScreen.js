import { MaterialCommunityIcons, Entypo, FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, Image } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { useSelector } from 'react-redux';

import HorizontalScroll from '../../components/UI/HorizontalScroll';
import Introduction from '../../components/UI/Introduction';
import SaferArea from '../../components/UI/SaferArea';

const SpotlightProductsScreen = (props) => {
  //Get products, projects and proposals from state
  const allProducts = useSelector((state) => state.products.availableProducts);
  const allProjects = useSelector((state) => state.projects.availableProjects);
  const allProposals = useSelector((state) => state.proposals.availableProposals);

  const [showWalkthrough, setShowWalkthrough] = useState(true);

  const slides = [
    {
      key: 'k1',
      title: 'Välkommen',
      text:
        'Mer återbruk åt folket! Kretsloppan är ett verktyg för att hjälpa till att synliggöra och sprida återbruk.',
      image: {
        uri: 'https://i.imgur.com/jr6pfzM.png',
      },
      titleStyle: styles.title,
      textStyle: styles.text,
      imageStyle: styles.image,
      backgroundColor: '#F7BB64',
    },
    {
      key: 'k2',
      title: 'Dela/Hitta',
      text: 'Lägg upp ditt eget återbruk och hitta det andra lagt upp',
      image: {
        uri: 'https://i.imgur.com/au4H7Vt.png',
      },
      titleStyle: styles.title,
      textStyle: styles.text,
      imageStyle: styles.image,
      backgroundColor: '#F4B1BA',
    },
    {
      key: 'k3',
      title: 'Hantera',
      text:
        'När du hittat ett återbruk du vill ha, reservera det och föreslå en tid för upphämtning. När säljaren godkänt tiden får nu en notifikation. Då är det bara att dyka upp på överenskommen tid och plats.',
      image: {
        uri: 'https://i.imgur.com/bXgn893.png',
      },
      titleStyle: styles.title,
      textStyle: styles.text,
      imageStyle: styles.image,
      backgroundColor: '#4093D2',
    },
    {
      key: 'k4',
      title: 'Följ återbrukets resa',
      text:
        'Du kan se vad som händer med återbruket efter det blivit återanvänt - kolla in fliken Projekt för att se dess nya liv.',
      image: {
        uri: 'https://i.imgur.com/mFKL47j.png',
      },
      titleStyle: styles.title,
      textStyle: styles.text,
      imageStyle: styles.image,
      backgroundColor: '#644EE2',
    },
    {
      key: 'k5',
      title: 'Nu kör vi!',

      image: {
        uri: 'https://i.imgur.com/mFKL47j.png',
      },
      titleStyle: styles.title,
      textStyle: styles.text,
      imageStyle: styles.image,
      backgroundColor: '#FF00FF',
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

  const onDoneAllSlides = () => {
    setShowWalkthrough(false);
  };
  const renderItem = ({ item }) => {
    return (
      <View style={{ ...styles.slide, backgroundColor: item.backgroundColor }}>
        <Text style={styles.title}>{item.title}</Text>
        <Image source={item.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };
  if (showWalkthrough) {
    return <AppIntroSlider renderItem={renderItem} data={slides} onDone={onDoneAllSlides} />;
  }
  return (
    <SaferArea>
      <Introduction
        pic="https://images.unsplash.com/photo-1541848756149-e3843fcbbde0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1663&q=80"
        text="NYHETER: Kretsloppan släppt, hurra! För feedback kontakta asaisacson@gmail.com, vi gör kontinuerliga uppdateringar. Version: 1.0-beta3"
      />
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <HorizontalScroll
          largeImageItem
          detailPath="ProjectDetail"
          title="Projekt"
          subTitle="Projekt som byggs med återbruk"
          showAddLink={() => props.navigation.navigate('EditProject')}
          showMoreLink={() => props.navigation.navigate('Projekt')}
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
          title="efterlysningar"
          subTitle="Kontakta efterlysaren om du sitter på svaret"
          showAddLink={() => props.navigation.navigate('EditProposal')}
          showMoreLink={() => props.navigation.navigate('Efterlysningar')}
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
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default SpotlightProductsScreen;
