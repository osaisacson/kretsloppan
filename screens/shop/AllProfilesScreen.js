import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//Components
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TextInput
} from 'react-native';
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
  const isMountedRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const profiles = useSelector(state => state.profiles.allProfiles);
  //Prepare for changing the rendered profiles on search
  const [renderedProfiles, setRenderedProfiles] = useState(profiles);
  const [searchQuery, setSearchQuery] = useState('');

  const profilesSorted = renderedProfiles.sort(function(a, b) {
    return b.profileName - a.profileName;
  });

  const dispatch = useDispatch();

  const loadProfiles = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      console.log('AllProfilesScreen: fetching profiles');
      await dispatch(profilesActions.fetchProfiles());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener('focus', loadProfiles);
  //   return () => {
  //     unsubscribe();
  //   };
  // }, [loadProfiles]);

  useEffect(() => {
    isMountedRef.current = true;
    setIsLoading(true);
    if (isMountedRef.current) {
      loadProfiles().then(() => {
        setIsLoading(false);
      });
    }
    return () => (isMountedRef.current = false);
  }, [loadProfiles]);

  const searchHandler = text => {
    const newData = renderedProfiles.filter(item => {
      const itemData = item.profileName
        ? item.profileName.toUpperCase()
        : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setRenderedProfiles(text.length ? newData : profiles);
    setSearchQuery(text.length ? text : '');
  };

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
      <TextInput
        style={styles.textInputStyle}
        onChangeText={text => searchHandler(text)}
        value={searchQuery}
        underlineColorAndroid="transparent"
        placeholder="Leta bland användare"
      />
      <HeaderTwo
        title={'Användare'}
        subTitle={'Allt som har skapat sig en profil'}
        questionText={'Här ska det vara en förklaring'}
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
          <View>
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
                key={itemData.item.profileId}
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
            <Divider />
          </View>
        )}
      />
    </SaferArea>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textStyle: {
    padding: 10
  },
  textInputStyle: {
    textAlign: 'center',
    height: 40,
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: '#009688',
    backgroundColor: '#FFFFFF'
  }
});

export default AllProfilesScreen;
