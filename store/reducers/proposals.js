import { getIndex, updateCollection } from '../helpers';

import {
  LOADING,
  DELETE_PROPOSAL,
  CREATE_PROPOSAL,
  UPDATE_PROPOSAL,
  SET_PROPOSALS,
} from '../actions/proposals';
import Proposal from '../../models/proposal';

const initialState = {
  availableProposals: [],
  userProposals: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOADING:
      console.log('LOADING BEING SET TO: ', action.loading);
      return {
        ...state,
        loading: action.loading,
      };
    case SET_PROPOSALS:
      return {
        availableProposals: action.proposals,
        userProposals: action.userProposals,
      };
    case CREATE_PROPOSAL:
      const newProposal = new Proposal(
        action.proposalData.id,
        action.proposalData.ownerId,
        action.proposalData.title,
        action.proposalData.description,
        action.proposalData.price,
        action.proposalData.date
      );
      console.log(
        'store/reducers/proposals/CREATE_PROPOSAL, new proposal: ',
        newProposal
      );
      return {
        ...state,
        availableProposals: state.availableProposals.concat(newProposal),
        userProposals: state.userProposals.concat(newProposal),
      };
    case UPDATE_PROPOSAL:
      const userProposalIndex = getIndex(state.userProposals, action.pid);

      const updatedUserProposal = new Proposal( //Whenever we do a new proposal we have to pass the full params to match model
        action.pid,
        state.userProposals[userProposalIndex].ownerId,
        action.proposalData.title,
        action.proposalData.description,
        action.proposalData.price,
        state.userProposals[userProposalIndex].date
      );
      console.log(
        'store/reducers/proposals/UPDATE_PROPOSAL, updated proposal: ',
        updatedUserProposal
      );

      //Update state
      updatedAvailableProposals = updateCollection(
        state.availableProposals,
        action.pid,
        updatedUserProposal
      );
      updatedUserProposals = updateCollection(
        state.userProposals,
        action.pid,
        updatedUserProposal
      );

      return {
        ...state,
        availableProposals: updatedAvailableProposals,
        userProposals: updatedUserProposals,
      };
    case DELETE_PROPOSAL:
      return {
        ...state,
        userProposals: state.userProposals.filter(
          (proposal) => proposal.id !== action.pid
        ),
        availableProposals: state.availableProposals.filter(
          (proposal) => proposal.id !== action.pid
        ),
      };
  }
  return state;
};
