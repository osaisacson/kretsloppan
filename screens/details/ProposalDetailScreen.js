import { useNavigation } from '@react-navigation/native';
import Moment from 'moment/min/moment-with-locales';
import React from 'react';
//Imports
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
import { DetailWrapper, detailStyles } from '../../components/wrappers/DetailWrapper';
//Constants
import Colors from '../../constants/Colors';
//Actions
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

  if (!selectedProposal) {
    return null;
  }

  //Get all projects from state, and then return the ones that matches the id of the current proposal
  const userProjects = useSelector((state) => state.projects.userProjects);
  const projectForProposal = userProjects.filter((proj) => proj.id === selectedProposal.projectId);

  const ownerId = selectedProposal ? selectedProposal.ownerId : null;
  const hasEditPermission = ownerId === loggedInUserId;
  const isResolved = selectedProposal ? selectedProposal.status === 'löst' : null;

  const editProposalHandler = (proposalId) => {
    navigation.navigate('EditProposal', { detailId: proposalId });
  };

  const deleteHandler = (proposalId) => {
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
            dispatch(proposalsActions.deleteProposal(proposalId));
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

  return selectedProposal ? (
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
        {/* Show contact info only if the user is not the creator */}
        <ContactDetails
          profileId={ownerId}
          proposalId={selectedProposal.id}
          buttonText="kontaktdetaljer"
        />
        <Divider style={{ marginVertical: 10 }} />

        <View style={detailStyles.textCard}>
          <Text style={detailStyles.proposalText}>{selectedProposal.title}</Text>
        </View>
        <View style={detailStyles.textCard}>
          <Text style={detailStyles.boundaryText}>{selectedProposal.description}</Text>
        </View>
        {selectedProposal.price ? (
          <>
            <Divider style={{ marginTop: 40 }} />
            <Text style={detailStyles.price}>{`Ersättning: ${selectedProposal.price} kr`}</Text>
          </>
        ) : null}
        {/* Buttons to show if the user has edit permissions and the proposal is not yet resolved */}
        {hasEditPermission ? (
          <>
            <Divider style={{ marginTop: 40 }} />
            <View style={detailStyles.spaceBetweenRow}>
              {/* Delete button */}
              <ButtonIcon
                icon="delete"
                color={Colors.warning}
                onSelect={() => {
                  deleteHandler(selectedProposal.id);
                }}
              />

              <ButtonIcon
                icon="pen"
                color={Colors.neutral}
                onSelect={() => {
                  editProposalHandler(selectedProposal.id);
                }}
              />
            </View>
          </>
        ) : null}
      </SectionCard>

      {selectedProposal.projectId && projectForProposal.length ? (
        <SectionCard>
          <View style={detailStyles.centered}>
            <HeaderThree text="Relaterar till projektet:" style={detailStyles.centeredHeader} />

            <HorizontalScroll
              scrollHeight={155}
              roundItem
              detailPath="ProjectDetail"
              scrollData={projectForProposal}
              navigation={props.navigation}
            />
          </View>
        </SectionCard>
      ) : null}

      {!isResolved && hasEditPermission ? (
        <SectionCard>
          <View style={detailStyles.toggles}>
            <ButtonAction
              disabled={isResolved} //disable/enable base on true/false of these params
              onSelect={() => {
                collectHandler(selectedProposal.id);
              }}
              title="Avaktivera och markera som löst"
            />
          </View>
        </SectionCard>
      ) : null}
      <Text style={{ textAlign: 'center', color: '#666', marginTop: 20 }}>
        Upplagt {Moment(selectedProposal.date).locale('sv').startOf('hour').fromNow()}
      </Text>
    </DetailWrapper>
  ) : null;
};

//Sets/overrides the default navigation options in the ShopNavigator
export const screenOptions = (navData) => {
  return {
    headerTitle: '',
  };
};

export default ProposalDetailScreen;
