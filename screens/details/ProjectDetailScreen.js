import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, Alert, FlatList } from 'react-native';
import { Divider, Paragraph } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';

import ButtonIcon from '../../components/UI/ButtonIcon';
import CachedImage from '../../components/UI/CachedImage';
import EmptyState from '../../components/UI/EmptyState';
import HeaderTwo from '../../components/UI/HeaderTwo';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import ProductItem from '../../components/UI/ProductItem';
import SaferArea from '../../components/UI/SaferArea';
import SectionCard from '../../components/UI/SectionCard';
import UserLine from '../../components/UI/UserLine';
import Colors from '../../constants/Colors';
import * as projectsActions from '../../store/actions/projects';

const ProjectDetailScreen = (props) => {
  const projectId = props.route.params.detailId;
  const ownerId = props.route.params.ownerId;

  const currentProfile = useSelector((state) => state.profiles.userProfile || {});
  const loggedInUserId = currentProfile.profileId;

  const selectedProject = useSelector((state) => {
    return projectId
      ? state.projects.availableProjects.find((proj) => proj.id === projectId)
      : state.projects.lastProjectAdded;
  }); //gets a slice of the current state from combined reducers, then checks that slice for the item that has a matching id to the one we extract from the navigation above

  const associatedProducts = useSelector((state) =>
    state.products.availableProducts.filter((prod) => prod.projectId === projectId)
  );

  const associatedProposals = useSelector((state) =>
    state.proposals.availableProposals.filter(
      (proposal) => proposal.projectId === projectId && proposal.status !== 'löst'
    )
  );

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const hasEditPermission = ownerId === loggedInUserId;

  const editProjectHandler = (projectId) => {
    navigation.navigate('EditProject', { detailId: projectId });
  };

  const selectItemHandler = (id, ownerId, title) => {
    props.navigation.navigate('ProductDetail', {
      detailId: id,
      ownerId,
      detailTitle: title,
    });
  };

  const deleteHandler = (projectId) => {
    Alert.alert(
      'Är du säker?',
      'Vill du verkligen radera den här projektet? Det går inte att gå ändra sig sen.',
      [
        { text: 'Nej', style: 'default' },
        {
          text: 'Ja, radera',
          style: 'destructive',
          onPress: () => {
            dispatch(projectsActions.deleteProject(projectId));
            navigation.goBack();
          },
        },
      ]
    );
  };

  const projectHeader = selectedProject ? (
    <View>
      <SectionCard>
        <Text style={styles.title}>{selectedProject.title}</Text>
        {selectedProject.location ? (
          <Text style={styles.subTitle}>{selectedProject.location}</Text>
        ) : null}
        <Divider style={{ marginBottom: 8 }} />
        <UserLine
          profileId={selectedProject.ownerId}
          style={{ marginBottom: -50, marginLeft: 5 }}
        />
        <CachedImage
          style={styles.image}
          uri={selectedProject.image ? selectedProject.image : ''}
        />

        {/* Buttons to show if the user has edit permissions */}
        {hasEditPermission ? (
          <View style={styles.actions}>
            {/* Delete button */}
            <ButtonIcon
              icon="delete"
              color={Colors.warning}
              onSelect={() => {
                deleteHandler(selectedProject.id);
              }}
            />
            <ButtonIcon
              icon="pen"
              color={Colors.neutral}
              onSelect={() => {
                editProjectHandler(selectedProject.id);
              }}
            />
          </View>
        ) : null}
        <Text style={styles.slogan}>{selectedProject.slogan}</Text>
      </SectionCard>
      {selectedProject.description ? (
        <SectionCard>
          <Paragraph style={{ padding: 5 }}>{selectedProject.description}</Paragraph>
        </SectionCard>
      ) : null}
      {associatedProposals.length ? (
        <>
          <View style={{ marginTop: 10 }}>
            <HeaderTwo
              title="Efterlysningar till projektet"
              simpleCount={associatedProposals.length}
            />
          </View>
          <HorizontalScroll
            textItem
            detailPath="ProposalDetail"
            scrollHeight={40}
            scrollData={associatedProposals}
            navigation={props.navigation}
          />
        </>
      ) : null}
      {associatedProducts.length ? (
        <View style={{ marginTop: 10 }}>
          <HeaderTwo title="Återbruk i projektet" simpleCount={associatedProducts.length} />
        </View>
      ) : (
        <EmptyState style={{ marginVertical: 30 }}>Inget återbruk i projektet ännu</EmptyState>
      )}
    </View>
  ) : null;

  if (!selectedProject) {
    return null;
  }

  return (
    <SaferArea>
      <FlatList
        initialNumToRender={8}
        horizontal={false}
        numColumns={1}
        data={associatedProducts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={projectHeader}
        renderItem={(itemData) => (
          <ProductItem
            showBackgroundText
            navigation={props.navigation}
            showSmallStatusIcons
            itemData={itemData.item}
            onSelect={() => {
              selectItemHandler(itemData.item.id, itemData.item.ownerId, itemData.item.title);
            }}
          />
        )}
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

export default ProjectDetailScreen;
