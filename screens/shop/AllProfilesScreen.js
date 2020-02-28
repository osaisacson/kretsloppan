import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import HeaderTwo from '../../components/UI/HeaderTwo';
import EmptyState from '../../components/UI/EmptyState';
import Loader from '../../components/UI/Loader';
import ProductItem from '../../components/UI/ProductItem';
//Actions
import * as profilesActions from '../../store/actions/profiles';
//Constants
import Colors from '../../constants/Colors';

const AllProfilesScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const profiles = useSelector(state => state.profiles.allProfiles);

  const profilesSorted = profiles.sort(function(a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  const dispatch = useDispatch();

  const loadProfiles = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(profilesActions.fetchProfiles());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', loadProfiles);
    return () => {
      unsubscribe();
    };
  }, [loadProfiles]);

  useEffect(() => {
    setIsLoading(true);
    loadProfiles().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProfiles]);

  const selectItemHandler = (id, profileId, title) => {
    props.navigation.navigate('ProductDetail', {
      detailId: id,
      ownerId: profileId,
      detailTitle: title
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Något gick fel</Text>
        <Button
          title="Prova igen"
          onPress={loadProfiles}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && profiles.length === 0) {
    return <EmptyState text="Inga användare ännu" />;
  }

  return (
    <View>
      <View>
        <HeaderTwo
          title={'Användare'}
          subTitle={'Allt som har skapat sig en profil'}
          indicator={profilesSorted.length ? profilesSorted.length : 0}
        />
        <FlatList
          horizontal={false}
          numColumns={3}
          onRefresh={loadProfiles}
          refreshing={isRefreshing}
          data={profilesSorted}
          keyExtractor={item => item.id}
          renderItem={itemData => (
            <ProductItem
              itemData={itemData.item}
              onSelect={() => {
                selectItemHandler(
                  itemData.item.id,
                  itemData.item.profileId,
                  itemData.item.title
                );
              }}
            ></ProductItem>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default AllProfilesScreen;
