import {
  DELETE_PROPOSAL,
  CREATE_PROPOSAL,
  UPDATE_PROPOSAL,
  SET_PROPOSALS
} from '../actions/proposals';
import Proposal from '../../models/proposal';

const initialState = {
  availableProposals: [],
  userProposals: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PROPOSALS:
      return {
        availableProposals: action.proposals,
        userProposals: action.userProposals
      };
    case CREATE_PROPOSAL:
      const newProposal = new Proposal(
        action.proposalData.id,
        action.proposalData.ownerId,
        action.proposalData.title,
        action.proposalData.description,
        action.proposalData.price
      );
      return {
        ...state,
        availableProposals: state.availableProposals.concat(newProposal),
        userProposals: state.userProposals.concat(newProposal)
      };
    case UPDATE_PROPOSAL:
      const proposalIndex = state.userProposals.findIndex(
        prop => prop.id === action.pid
      );
      const updatedProposal = new Proposal(
        action.pid,
        state.userProposals[proposalIndex].ownerId,
        action.proposalData.title,
        action.proposalData.description,
        action.proposalData.price
      );
      const updatedUserProposals = [...state.userProposals];
      updatedUserProposals[proposalIndex] = updatedProposal;
      const availableProposalIndex = state.availableProposals.findIndex(
        proposal => proposal.id === action.pid
      );
      const updatedAvailableProposals = [...state.availableProposals];
      updatedAvailableProposals[availableProposalIndex] = updatedProposal;
      return {
        ...state,
        availableProposals: updatedAvailableProposals,
        userProposals: updatedUserProposals
      };
    case DELETE_PROPOSAL:
      return {
        ...state,
        userProposals: state.userProposals.filter(
          proposal => proposal.id !== action.pid
        ),
        availableProposals: state.availableProposals.filter(
          proposal => proposal.id !== action.pid
        )
      };
  }
  return state;
};
