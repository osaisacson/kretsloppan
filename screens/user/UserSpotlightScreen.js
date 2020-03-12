import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

//Components
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Avatar, Title, Caption, Paragraph, Button } from 'react-native-paper';
import SaferArea from '../../components/UI/SaferArea';
import EmptyState from '../../components/UI/EmptyState';
import Loader from '../../components/UI/Loader';
import ButtonNormal from '../../components/UI/ButtonNormal';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import ButtonIcon from '../../components/UI/ButtonIcon';

//Actions
import * as productsActions from '../../store/actions/products';
import * as projectsActions from '../../store/actions/projects';
import * as proposalsActions from '../../store/actions/proposals';

//Constants
import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';

const UserSpotlightScreen = props => {
  const isMountedRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  //Get profiles, return only the one which matches the logged in id
  const loggedInUserId = useSelector(state => state.auth.userId);
  const profilesArray = useSelector(state => state.profiles.allProfiles).filter(
    profile => profile.profileId === loggedInUserId
  );
  const currentProfile = profilesArray[0];

  //Get projects, return only the one which matches the logged in id
  const userProjects = useSelector(
    state => state.projects.availableProjects
  ).filter(proj => proj.ownerId === loggedInUserId);

  //Get user products
  const userProducts = useSelector(state => state.products.userProducts);
  const userProductsSorted = userProducts.sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  //Get user proposals
  const userProposals = useSelector(state => state.proposals.userProposals);

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

  //Gets all done (given) products
  const doneUserProducts = userProductsSorted.filter(
    product => product.status === 'hämtad'
  );

  //Sets indicator numbers
  const added = inProgressUserProducts.length + readyUserProducts.length;
  const collected = doneUserProducts.length;
  const nrOfProjects = userProjects.length;

  //Navigate to the edit screen and forward the product id
  const editProfileHandler = () => {
    props.navigation.navigate('EditProfile', { detailId: currentProfile.id });
  };

  const dispatch = useDispatch();

  //Load products and projects
  const loadProductsProposalsProjects = useCallback(async () => {
    setError(null);
    try {
      await dispatch(productsActions.fetchProducts());
      await dispatch(projectsActions.fetchProjects());
      await dispatch(proposalsActions.fetchProposals());
    } catch (err) {
      setError(err.message);
    }
  }, [dispatch, setIsLoading, setError]);

  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener(
  //     'focus',
  //     loadProductsProposalsProjects
  //   );
  //   return () => {
  //     unsubscribe();
  //   };
  // }, [loadProductsProposalsProjects]);

  useEffect(() => {
    isMountedRef.current = true;
    setIsLoading(true);
    if (isMountedRef.current) {
      loadProductsProposalsProjects().then(() => {
        setIsLoading(false);
      });
    }
    return () => (isMountedRef.current = false);
  }, [dispatch, loadProductsProposalsProjects]);

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Något gick fel</Text>
        <ButtonNormal
          actionOnPress={loadProductsProposalsProjects}
          color={Colors.primary}
          text="Prova igen"
        />
      </View>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SaferArea>
      <ScrollView>
        <View style={styles.userInfoSection}>
          <Avatar.Image
            style={{
              color: '#fff',
              backgroundColor: '#fff',
              borderWidth: 0.3,
              borderColor: '#000'
            }}
            source={
              currentProfile.image
                ? { uri: currentProfile.image }
                : require('./../../assets/avatar-placeholder-image.png')
            }
            size={80}
          />
          <ButtonIcon
            style={{ marginTop: -20 }}
            icon="settings"
            color={Colors.neutral}
            onSelect={editProfileHandler}
          />
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

        {!isLoading && userProducts.length === 0 ? (
          <EmptyState text="Inga produkter ännu, prova lägga till några." />
        ) : (
          <>
            <HorizontalScroll
              title={'Reserverade av mig'}
              subTitle={
                'Väntas på att hämtas upp av dig - se kort för detaljer'
              }
              extraSubTitle={
                'Notera att reservationen upphör gälla efter en vecka'
              }
              bgColor={Colors.primaryLight}
              scrollData={bookedUserProducts}
              showNotificationBadge={true}
              navigation={props.navigation}
            />
            <HorizontalScroll
              largeItem={true}
              detailPath={'ProjectDetail'}
              title={'Mina projekt'}
              subTitle={'Projekt jag bygger med återbruk'}
              scrollData={userProjects}
              navigation={props.navigation}
            />
            <HorizontalScroll
              title={'Upplagt av mig'}
              subTitle={'Återbruk upplagt av dig'}
              scrollData={userProducts}
              navigation={props.navigation}
            />
            <HorizontalScroll
              textItem={true}
              detailPath="ProposalDetail"
              title={'Efterlysta produkter'}
              subTitle={'Mina efterlysningar'}
              scrollData={userProposals}
              navigation={props.navigation}
            />
            <HorizontalScroll
              title={'Gett Igen'}
              subTitle={'Återbruk använt av mig'}
              scrollData={doneUserProducts}
              navigation={props.navigation}
            />
          </>
        )}
      </ScrollView>
    </SaferArea>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  userInfoSection: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center'
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
