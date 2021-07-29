import { useNavigation } from '@react-navigation/native';
import React from 'react';
import firebase from 'firebase';

import useGetProject from '../hooks/useGetProject';

import { View, Text, StyleSheet, Alert, FlatList } from 'react-native';
import { Divider, Paragraph } from 'react-native-paper';

import SpotlightOrders from './SpotlightOrders';
import SpotlightProposals from './SpotlightProposals';

import ButtonIcon from '../components/UI/ButtonIcon';
import CachedImage from '../components/UI/CachedImage';
import SectionCard from '../components/UI/SectionCard';
import UserLine from '../components/UI/UserLine';
import SaferArea from '../components/wrappers/SaferArea';
import Colors from '../constants/Colors';
import * as projectsActions from '../store/actions/projects';

const ProjectDetail = (props) => {
  //Get project id from route through props
  const selectedProjectId = props.route.params.itemData.id;

  const { isLoading, isError, data, error } = useGetProject(selectedProjectId);

  if (isError) {
    console.log('ERROR: ', error.message);
    return <Text>Error: {error.message}</Text>;
  }

  if (isLoading) {
    console.log(
      `Loading project with id ${selectedProjectId} in SpotlightProjects via the useGetProject hook...`
    );
    return <Loader />;
  }

  const navigation = useNavigation();

  const currentUserId = firebase.auth().currentUser.uid;

  //TODO
  //    const { isLoading, isError, data, error } = useGetProfile(currentUser.id);

  //TO DELETE
  // const projectId = selectedProject.id;

  // const { ownerId } = selectedProject;

  // const associatedProducts = useSelector((state) =>
  //   state.orders.availableOrders.filter((order) => order.projectId === projectId)
  // );

  // const associatedProposals = useSelector((state) =>
  //   state.proposals.availableProposals.filter(
  //     (proposal) => proposal.projectId === projectId && proposal.status !== 'löst'
  //   )
  // );

  // const dispatch = useDispatch();

  // const currentProfile = useSelector((state) => state.profiles.userProfile || {});

  const hasEditPermission = ownerId === currentUserId; //TODO: this should not be currentUserId from firebase but the profileId from the currentProfile:   // const loggedInUserId = currentProfile.profileId;

  const editProjectHandler = (id) => {
    navigation.navigate('EditProject', { detailId: id });
  };

  const deleteHandler = (id) => {
    Alert.alert(
      'Är du säker?',
      'Vill du verkligen radera den här projektet? Det går inte att gå ändra sig sen.',
      [
        { text: 'Nej', style: 'default' },
        {
          text: 'Ja, radera',
          style: 'destructive',
          onPress: () => {
            dispatch(projectsActions.deleteProject(id));
            navigation.goBack();
          },
        },
      ]
    );
  };

  console.log('data: ', data);

  const { title, location, ownerId, image, id, slogan, description } = data;

  const ListHeaderComponent = (
    <View>
      <SectionCard>
        <Text style={styles.title}>{title}</Text>
        {location ? <Text style={styles.subTitle}>{location}</Text> : null}
        <Divider style={{ marginBottom: 8 }} />
        <UserLine profileId={ownerId} style={{ marginBottom: -50, marginLeft: 5 }} />
        <CachedImage style={styles.image} uri={image ? image : ''} />

        {/* Buttons to show if the user has edit permissions */}
        {hasEditPermission ? (
          <View style={styles.actions}>
            {/* Delete button */}
            <ButtonIcon
              icon="delete"
              color={Colors.warning}
              onSelect={() => {
                deleteHandler(id);
              }}
            />
            <ButtonIcon
              icon="pen"
              color={Colors.neutral}
              onSelect={() => {
                editProjectHandler(id);
              }}
            />
          </View>
        ) : null}
        <Text style={styles.slogan}>{slogan}</Text>
      </SectionCard>
      {description ? (
        <SectionCard>
          <Paragraph style={{ padding: 5 }}>{description}</Paragraph>
        </SectionCard>
      ) : null}
    </View>
  );

  const ListFooterComponent = (
    <>
      {/* Associated products */}
      <SpotlightOrders rowsToShow={3} projectId={id} title={'Återbruk använt i projektet'} />
      <Divider style={{ marginTop: 25, marginBottom: 20 }} />
      <SpotlightProposals title={'Efterlysningar till projektet'} projectId={id} />
    </>
  );

  return (
    <SaferArea>
      <FlatList
        listKey="spotlightFlatlist"
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
      />
    </SaferArea>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 300,
    width: '100%',
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -30,
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'bebas-neue-book',
    fontSize: 26,
    textAlign: 'center',
    paddingVertical: 8,
  },
  subTitle: {
    fontFamily: 'roboto-light-italic',
    fontSize: 14,
    textAlign: 'center',
    paddingBottom: 10,
  },
  slogan: {
    fontFamily: 'roboto-light-italic',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 10,
  },
});

export const screenOptions = () => {
  return {
    headerTitle: '',
  };
};

export default ProjectDetail;
