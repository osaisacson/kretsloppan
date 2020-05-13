import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
//Components
import { View, Text, Alert } from 'react-native';
import {
  DetailWrapper,
  detailStyles,
} from '../../components/wrappers/DetailWrapper';
import ContactDetails from '../../components/UI/ContactDetails';
import ButtonIcon from '../../components/UI/ButtonIcon';
import ButtonNormal from '../../components/UI/ButtonNormal';
//Constants
import Colors from '../../constants/Colors';
//Actions
import * as proposalsActions from '../../store/actions/proposals';

const ProposalDetailScreen = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  //Get proposal and owner id from navigation params (from parent screen) and current user id from state
  const proposalId = props.route.params.detailId;
  const loggedInUserId = useSelector((state) => state.auth.userId);

  //Find us the proposal that matches the current proposalId
  const selectedProposal = useSelector((state) =>
    state.proposals.availableProposals.find(
      (proposal) => proposal.id === proposalId
    )
  );

  const ownerId = selectedProposal.ownerId;

  //Check if the currently logged in user is the one who created the proposal, and thereby should have editing privileges
  const hasEditPermission = ownerId === loggedInUserId;

  //Check if the proposal is resolved yet
  const isResolved = selectedProposal.status === 'löst';

  const editProposalHandler = (id) => {
    navigation.navigate('EditProposal', { detailId: id });
  };

  const deleteHandler = () => {
    const id = selectedProposal.id;
    Alert.alert(
      'Är du säker?',
      'Vill du verkligen radera den här eftelrysningen? Det går inte att gå ändra sig när det väl är gjort.',
      [
        { text: 'Nej', style: 'default' },
        {
          text: 'Ja, radera',
          style: 'destructive',
          onPress: () => {
            dispatch(proposalsActions.deleteProposal(id));
          },
        },
      ]
    );
    navigation.goBack();
  };

  const collectHandler = () => {
    const id = selectedProposal.id;
    Alert.alert(
      'Är efterlysningen löst?',
      'Genom att klicka här bekräftar du att efterlysningen är avklarad.',
      [
        { text: 'Nej', style: 'default' },
        {
          text: 'Ja, flytta den',
          style: 'destructive',
          onPress: () => {
            dispatch(proposalsActions.changeProposalStatus(id, 'löst'));
          },
        },
      ]
    );
  };

  return (
    <DetailWrapper>
      {/* Show contact info only if the user is not the creator */}
      {!hasEditPermission && (
        <ContactDetails
          profileId={ownerId}
          proposalId={selectedProposal.id}
          hideButton={isResolved}
          buttonText={'kontaktdetaljer'}
        />
      )}
      <View style={detailStyles.textCard}>
        <Text style={detailStyles.proposalText}>{selectedProposal.title}</Text>
      </View>
      <View style={detailStyles.textCard}>
        <Text style={detailStyles.boundaryText}>
          {selectedProposal.description}
        </Text>
      </View>
      <Text style={detailStyles.price}>
        {selectedProposal.price
          ? `${selectedProposal.price} kr`
          : 'Volontärbasis/Donation'}
      </Text>
      {/* Buttons to show if the user has edit permissions and the proposal is not yet resolved */}
      {hasEditPermission && !isResolved ? (
        <View style={detailStyles.actions}>
          {/* Delete button */}
          <ButtonIcon
            icon="delete"
            color={Colors.warning}
            onSelect={deleteHandler.bind(this)}
          />

          <ButtonIcon
            icon="pen"
            color={Colors.neutral}
            onSelect={() => {
              editProposalHandler(selectedProposal.id);
            }}
          />
        </View>
      ) : null}
      {hasEditPermission ? (
        <View style={detailStyles.toggles}>
          <ButtonNormal
            color={Colors.primary}
            disabled={isResolved} //disable/enable base on true/false of these params
            actionOnPress={collectHandler}
            text={isResolved ? 'löst' : 'Avaktivera och markera som löst'}
          />
        </View>
      ) : null}
    </DetailWrapper>
  );
};

//Sets/overrides the default navigation options in the ShopNavigator
export const screenOptions = (navData) => {
  return {
    headerTitle: '',
  };
};

export default ProposalDetailScreen;
