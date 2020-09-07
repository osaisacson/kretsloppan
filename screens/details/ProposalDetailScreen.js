import { useNavigation } from '@react-navigation/native';
import Moment from 'moment/min/moment-with-locales';
import React from 'react';
import { View, Text, Alert, Platform } from 'react-native';
import { Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import ButtonAction from '../../components/UI/ButtonAction';
import ButtonIcon from '../../components/UI/ButtonIcon';
import ContactDetails from '../../components/UI/ContactDetails';
import HeaderThree from '../../components/UI/HeaderThree';
import HorizontalScroll from '../../components/UI/HorizontalScroll';
import SectionCard from '../../components/UI/SectionCard';
import StatusBadge from '../../components/UI/StatusBadge';
import UserLine from '../../components/UI/UserLine';
import { DetailWrapper, detailStyles } from '../../components/wrappers/DetailWrapper';
import Colors from '../../constants/Colors';
import * as proposalsActions from '../../store/actions/proposals';

const ProposalDetailScreen = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  //Get proposal and owner id from navigation params (from parent screen) and current user id from state
  const proposalId = props.route.params.detailId;
  const currentProfile = useSelector((state) => state.profiles.userProfile || {});
  const loggedInUserId = currentProfile.profileId;

  //Find us the proposal that matches the current proposalId
  const selectedProposal = useSelector((state) =>
    state.proposals.availableProposals.find((proposal) => proposal.id === proposalId)
  );

  //Get all projects from state, and then return the ones that matches the id of the current proposal
  const availableProjects = useSelector((state) => state.projects.availableProjects || {});

  if (!selectedProposal) {
    return null;
  }

  const { projectId, ownerId, id, status, title, description, price } = selectedProposal;

  //Return the projects that matches the id of the current proposal
  const projectForProposal = availableProjects.filter((proj) => proj.id === projectId || null);

  const hasEditPermission = ownerId === loggedInUserId;
  const isResolved = selectedProposal ? status === 'löst' : null;

  const editProposalHandler = (proposalId) => {
    navigation.navigate('EditProposal', { detailId: proposalId });
  };

  const deleteHandler = () => {
    Alert.alert(
      'Är du säker?',
      'Vill du verkligen radera den här efterlysningen? Det går inte att gå ändra sig när det väl är gjort.',
      [
        { text: 'Nej', style: 'default' },
        {
          text: 'Ja, radera',
          style: 'destructive',
          onPress: () => {
            navigation.goBack();
            dispatch(proposalsActions.deleteProposal(id));
          },
        },
      ]
    );
  };

  const collectHandler = (proposalId) => {
    Alert.alert(
      'Är efterlysningen löst?',
      'Genom att klicka här bekräftar du att efterlysningen är avklarad.',
      [
        { text: 'Avbryt', style: 'default' },
        {
          text: 'Ja, flytta den',
          style: 'destructive',
          onPress: () => {
            dispatch(proposalsActions.changeProposalStatus(proposalId, 'löst'));
          },
        },
      ]
    );
  };

  return (
    <DetailWrapper>
      {isResolved ? (
        <StatusBadge
          style={{ alignSelf: 'flex-start', marginTop: 5 }}
          text="Löst!"
          icon={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
          backgroundColor={Colors.completed}
        />
      ) : null}

      <SectionCard>
        <UserLine profileId={ownerId} style={{ marginBottom: 10 }} showLine />

        <Divider style={{ marginBottom: 10 }} />

        <View style={detailStyles.textCard}>
          <Text style={detailStyles.proposalText}>{title}</Text>
        </View>
        <View style={detailStyles.textCard}>
          <Text style={detailStyles.boundaryText}>{description}</Text>
        </View>

        {price ? (
          <>
            <Divider style={{ marginTop: 40 }} />
            <Text style={detailStyles.price}>{`Ersättning: ${price} kr`}</Text>
          </>
        ) : null}

        <ContactDetails profileId={ownerId} proposalId={id} />
      </SectionCard>

      {projectId && projectForProposal.length ? (
        <SectionCard>
          <View style={detailStyles.centered}>
            <HeaderThree text="Relaterar till projektet" style={detailStyles.centeredHeader} />

            <HorizontalScroll
              scrollHeight={200}
              largeImageItem
              detailPath="ProjectDetail"
              scrollData={projectForProposal}
              navigation={props.navigation}
            />
          </View>
        </SectionCard>
      ) : null}

      {/* Buttons to show if the user has edit permissions and the proposal is not yet resolved */}
      {hasEditPermission ? (
        <View style={{ marginTop: 10 }}>
          <View style={detailStyles.spaceBetweenRow}>
            {/* Delete button */}
            <ButtonIcon
              icon="delete"
              color={Colors.warning}
              onSelect={() => {
                deleteHandler();
              }}
            />
            {!isResolved ? (
              <ButtonAction
                disabled={isResolved} //disable/enable base on true/false of these params
                onSelect={() => {
                  collectHandler(selectedProposal.id);
                }}
                title="Avaktivera och markera som löst"
              />
            ) : null}

            <ButtonIcon
              icon="pen"
              color={Colors.neutral}
              onSelect={() => {
                editProposalHandler(selectedProposal.id);
              }}
            />
          </View>
        </View>
      ) : null}

      <Text style={{ textAlign: 'center', color: '#666', marginTop: 20 }}>
        Upplagt {Moment(selectedProposal.date).locale('sv').startOf('hour').fromNow()}
      </Text>
    </DetailWrapper>
  );
};

export const screenOptions = (navData) => {
  return {
    headerTitle: '',
  };
};

export default ProposalDetailScreen;
