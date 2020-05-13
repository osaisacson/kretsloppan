import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import { View, Text, FlatList } from 'react-native';
import SaferArea from '../../components/UI/SaferArea';
import HeaderTwo from '../../components/UI/HeaderTwo';
import EmptyState from '../../components/UI/EmptyState';
import Error from '../../components/UI/Error';
import Loader from '../../components/UI/Loader';
import RoundItem from '../../components/UI/RoundItem';
import SearchBar from '../../components/UI/SearchBar';
import { FontAwesome } from '@expo/vector-icons';
import { Divider } from 'react-native-paper';

//Actions
import * as profilesActions from '../../store/actions/profiles';

const AllProfilesScreen = (props) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  //Get profiles from state
  const profiles = useSelector((state) => state.profiles.allProfiles);

  //Prepare for changing the rendered profiles on search
  const [renderedProfiles, setRenderedProfiles] = useState(profiles);
  const [searchQuery, setSearchQuery] = useState('');

  //Sort profiles by name
  const profilesSorted = renderedProfiles.sort(function (a, b) {
    return b.profileName - a.profileName;
  });

  const loadProfiles = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      dispatch(profilesActions.fetchProfiles());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  const searchHandler = (text) => {
    const newData = renderedProfiles.filter((item) => {
      const itemData = item.profileName
        ? item.profileName.toUpperCase()
        : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setRenderedProfiles(text.length ? newData : profiles);
    setSearchQuery(text.length ? text : '');
  };

  const selectItemHandler = (profileId, profileName) => {
    props.navigation.navigate('Användare', {
      detailId: profileId,
      detailTitle: profileName,
    });
  };

  if (error) {
    return <Error actionOnPress={loadProfiles} />;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && profiles.length === 0) {
    return <EmptyState text="Inga användare ännu" />;
  }

  return (
    <SaferArea>
      <SearchBar
        actionOnChangeText={(text) => searchHandler(text)}
        searchQuery={searchQuery}
        placeholder="Leta bland användare"
      />
      <FlatList
        initialNumToRender={8}
        horizontal={false}
        numColumns={1}
        onRefresh={loadProfiles}
        refreshing={isRefreshing}
        data={profilesSorted}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                padding: 10,
                borderBottom: 0.2,
                borderColor: '#666',
              }}
            >
              <RoundItem
                key={itemData.item.profileId}
                itemData={itemData.item}
                onSelect={() => {
                  selectItemHandler(
                    itemData.item.profileId,
                    itemData.item.profileName
                  );
                }}
              ></RoundItem>
              <Text style={{ alignSelf: 'center', paddingLeft: 10 }}>
                {itemData.item.profileName}
              </Text>
            </View>
            <Divider />
          </View>
        )}
        ListHeaderComponent={
          <HeaderTwo
            title={'Användare'}
            subTitle={'Alla som har skapat sig en profil'}
            questionText={'Här hittar du alla användare på plattformen'}
            icon={
              <FontAwesome
                name="users"
                size={18}
                style={{ marginRight: 5, paddingBottom: 2 }}
              />
            }
            indicator={profilesSorted.length ? profilesSorted.length : 0}
          />
        }
      />
    </SaferArea>
  );
};

export default AllProfilesScreen;
