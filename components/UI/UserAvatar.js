import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components

import {
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
  View
} from 'react-native';
import { Avatar, Badge } from 'react-native-paper';
import Loader from '../../components/UI/Loader';
//Actions
import * as productsActions from '../../store/actions/products';
import * as projectsActions from '../../store/actions/projects';
import * as proposalsActions from '../../store/actions/proposals';

const UserAvatar = props => {
  const isMountedRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  let TouchableCmp = TouchableOpacity; //By default sets the wrapping component to be TouchableOpacity
  //If platform is android and the version is the one which supports the ripple effect
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
    //Set TouchableCmp to instead be TouchableNativeFeedback
  }

  const loggedInUserId = useSelector(state => state.auth.userId);

  //Find the profile that matches the id of the currently logged in User
  const currentUser = useSelector(state =>
    state.profiles.allProfiles.find(prof => prof.profileId === loggedInUserId)
  );

  const userProducts = useSelector(state => state.products.userProducts);

  const dispatch = useDispatch();

  //Load products and projects
  const loadProductsAndProjects = useCallback(async () => {
    try {
      console.log('fetching data: loadProductsAndProjects');
      await dispatch(productsActions.fetchProducts());
      await dispatch(projectsActions.fetchProjects());
      await dispatch(proposalsActions.fetchProposals());
    } catch (err) {
      console.log(
        'Error when trying to loadProductsAndProjects: ',
        err.message
      );
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    setIsLoading(true);
    if (isMountedRef.current) {
      loadProductsAndProjects().then(() => {
        console.log('isMountedRef.current: ', isMountedRef.current);
        setIsLoading(false);
      });
    }
    return () => (isMountedRef.current = false);
  }, [loadProductsAndProjects]);

  //Gets nr of all booked products
  const bookedUserProducts = userProducts.filter(
    product => product.status === 'reserverad'
  );

  const bookedUserProductsNr =
    bookedUserProducts && bookedUserProducts.length > 0
      ? bookedUserProducts.length
      : 0;

  //Gets nr of all currently being worked on products
  const inProgressUserProducts = userProducts.filter(
    product => product.status === 'bearbetas'
  );

  const inProgressUserProductsNr =
    inProgressUserProducts && inProgressUserProducts.length > 0
      ? inProgressUserProducts.length
      : 0;

  //Gets nr of all wanted products
  const wantedUserProducts = userProducts.filter(
    product => product.status === 'efterlyst'
  );

  const wantedUserProductsNr =
    wantedUserProducts && wantedUserProducts.length > 0
      ? wantedUserProducts.length
      : 0;

  const activeBadgeNr =
    bookedUserProductsNr + inProgressUserProductsNr + wantedUserProductsNr;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <TouchableCmp
      activeOpacity={0.5}
      onPress={props.actionOnPress}
      style={{
        marginHorizontal: 10,
        marginTop: 40
      }}
    >
      <View>
        <Avatar.Image
          style={{
            color: '#fff',
            backgroundColor: '#fff',
            borderWidth: 0.3,
            borderColor: '#000'
          }}
          source={
            currentUser
              ? { uri: currentUser.image }
              : require('./../../assets/avatar-placeholder-image.png')
          }
          size={50}
        />
        {props.showBadge ? (
          <Badge
            style={{
              fontWeight: 'bold',
              position: 'relative',
              left: -35,
              bottom: 20
            }}
          >
            {activeBadgeNr}
          </Badge>
        ) : null}
      </View>
    </TouchableCmp>
  );
};

export default UserAvatar;
