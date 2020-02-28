import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

//Components
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Avatar, Title, Caption, Paragraph, Button } from 'react-native-paper';
import EmptyState from '../../components/UI/EmptyState';
import Loader from '../../components/UI/Loader';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import ProjectsScroll from '../../components/UI/ProjectsScroll';

//Actions
import * as productsActions from '../../store/actions/products';

//Constants
import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';

const UserSpotlightScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const userProducts = useSelector(state => state.products.userProducts);

  //Get profiles, return only the one which matches the logged in id
  const loggedInUserId = useSelector(state => state.auth.userId);
  const profilesArray = useSelector(state => state.profiles.allProfiles).filter(
    profile => profile.profileId === loggedInUserId
  );

  //Get projects, return only the one which matches the logged in id
  const userProjects = useSelector(
    state => state.projects.availableProjects
  ).filter(proj => proj.ownerId === loggedInUserId);

  //Current profile and sorted products
  const currentProfile = profilesArray[0];
  const userProductsSorted = userProducts.sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  //Gets all ready products
  const readyUserProducts = userProductsSorted.filter(
    product => product.status === 'redo'
  );

  //Gets all booked products
  const bookedUserProducts = userProductsSorted.filter(
    product => product.status === 'reserverad'
  );

  //Gets all currently being worked on products
  const inProgressUserProducts = userProductsSorted.filter(
    product => product.status === 'bearbetas'
  );

  //Gets all wanted products
  const wantedUserProducts = userProductsSorted.filter(
    product => product.status === 'efterlyst'
  );

  //Gets all done (given) products
  const doneUserProducts = userProductsSorted.filter(
    product => product.status === 'hämtad'
  );

  const added = inProgressUserProducts.length + readyUserProducts.length;
  const collected = doneUserProducts.length;
  const nrOfProjects = userProjects.length;

  //Navigate to the edit screen and forward the product id
  const editProfileHandler = id => {
    props.navigation.navigate('EditProfile');
  };

  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setError(null);
    try {
      await dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', loadProducts);
    return () => {
      unsubscribe();
    };
  }, [loadProducts]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Något gick fel</Text>
        <Button
          title="Prova igen"
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && userProducts.length === 0) {
    return <EmptyState text="Inga produkter ännu, prova lägga till några." />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && userProducts.length === 0) {
    return <EmptyState>Inga produkter ännu. Lägg till några!</EmptyState>;
  }

  return (
    <View>
      <ScrollView>
        <View style={styles.userInfoSection}>
          <Button mode="text" onPress={editProfileHandler}>
            <Avatar.Image
              style={{
                color: '#fff',
                backgroundColor: '#fff',
                borderWidth: '0.3',
                borderColor: '#000'
              }}
              source={{ uri: currentProfile.image }}
              size={50}
            />
          </Button>
          <Title style={styles.title}>{currentProfile.profileName}</Title>
          <View style={styles.row}>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                {added ? added : 0}
              </Paragraph>
              <Caption style={styles.caption}>Upplagda</Caption>
            </View>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                {collected ? collected : 0}
              </Paragraph>
              <Caption style={styles.caption}>Hämtade</Caption>
            </View>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                {nrOfProjects ? nrOfProjects : 0}
              </Paragraph>
              <Caption style={styles.caption}>Projekt</Caption>
            </View>
          </View>
        </View>
        <ProjectsScroll
          userProject={true}
          navigation={props.navigation}
          title="Projekt du bygger på"
        />
        <HorizontalScroll
          title={'Reserverade av mig'}
          subTitle={'Väntas på att hämtas upp av dig - se kort för detaljer'}
          extraSubTitle={'Notera att reservationen upphör gälla efter en vecka'}
          scrollData={bookedUserProducts}
          showNotificationBadge={true}
          navigation={props.navigation}
        />
        <HorizontalScroll
          title={'Under bearbetning'}
          subTitle={
            "Material som håller på att fixas. När det är redo för hämtning öppna kortet och klicka 'Redo'"
          }
          scrollData={inProgressUserProducts}
          showNotificationBadge={true}
          navigation={props.navigation}
        />
        <HorizontalScroll
          title={'Efterlysta produkter'}
          subTitle={'Mina efterlysningar'}
          scrollData={wantedUserProducts}
          navigation={props.navigation}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  userInfoSection: {
    marginTop: -6,
    paddingLeft: Styles.leftRight
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -6
  },
  row: {
    marginTop: 0,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Styles.leftRight
  },
  paragraph: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 3
  }
});

export default UserSpotlightScreen;
