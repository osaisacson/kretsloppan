import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import SaferArea from '../../components/UI/SaferArea';
import HeaderTwo from '../../components/UI/HeaderTwo';
import EmptyState from '../../components/UI/EmptyState';
import Loader from '../../components/UI/Loader';
import RoundItem from '../../components/UI/RoundItem';
import { FontAwesome } from '@expo/vector-icons';
import { Divider } from 'react-native-paper';

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
    props.navigation.navigate('ProfileDetail', {
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
    <SaferArea>
      <HeaderTwo
        title={'Användare'}
        subTitle={'Allt som har skapat sig en profil'}
        icon={
          <FontAwesome
            name="users"
            size={18}
            style={{ marginRight: 5, paddingBottom: 2 }}
          />
        }
        indicator={profilesSorted.length ? profilesSorted.length : 0}
      />
      <FlatList
        horizontal={false}
        numColumns={1}
        onRefresh={loadProfiles}
        refreshing={isRefreshing}
        data={profilesSorted}
        keyExtractor={item => item.id}
        renderItem={itemData => (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              padding: 10,
              borderBottom: 0.2,
              borderColor: '#666'
            }}
          >
            <RoundItem
              itemData={itemData.item}
              onSelect={() => {
                selectItemHandler(
                  itemData.item.id,
                  itemData.item.profileId,
                  itemData.item.title
                );
              }}
            ></RoundItem>
            <Text style={{ alignSelf: 'center', paddingLeft: 10 }}>
              {itemData.item.profileName}
            </Text>
          </View>
        )}
      />
    </SaferArea>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default AllProfilesScreen;
