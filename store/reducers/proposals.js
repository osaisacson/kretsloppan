import Proposal from '../../models/proposal';
import {
  DELETE_PROPOSAL,
  CREATE_PROPOSAL,
  UPDATE_PROPOSAL,
  SET_PROPOSALS,
  CHANGE_PROPOSAL_STATUS,
} from '../actions/proposals';
import { getIndex, updateCollection } from '../helpers';

const initialState = {
  availableProposals: [],
  userProposals: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PROPOSALS:
      return {
        availableProposals: action.proposals,
        userProposals: action.userProposals,
      };
    case CREATE_PROPOSAL:
      const newProposal = new Proposal(
        action.proposalData.id,
        action.proposalData.ownerId,
        action.proposalData.projectId,
        action.proposalData.title,
        action.proposalData.description,
        action.proposalData.price,
        action.proposalData.date,
        action.proposalData.status
      );
      console.log('store/reducers/proposals/CREATE_PROPOSAL, new proposal: ', newProposal);
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
        action.proposalData.projectId,
        action.proposalData.title,
        action.proposalData.description,
        action.proposalData.price,
        state.userProposals[userProposalIndex].date,
        state.userProposals.status
      );
      console.log(
        'store/reducers/proposals/UPDATE_PROPOSAL, updated proposal: ',
        updatedUserProposal
      );

      //Update state
      const updatedAvailableProposals = updateCollection(
        state.availableProposals,
        action.pid,
        updatedUserProposal
      );
      const updatedUserProposals = updateCollection(
        state.userProposals,
        action.pid,
        updatedUserProposal
      );

      return {
        ...state,
        availableProposals: updatedAvailableProposals,
        userProposals: updatedUserProposals,
      };
    case CHANGE_PROPOSAL_STATUS:
      const availableProposalsIndexCPS = getIndex(state.availableProposals, action.pid);

      console.log(
        'store/reducers/proposals/CHANGE_PROPOSAL_STATUS, original proposal: ',
        state.availableProposals[availableProposalsIndexCPS]
      );

      const updatedProductCPS = new Proposal( //Whenever we do a new proposal we have to pass the full params to match model
        action.pid,
        state.availableProposals[availableProposalsIndexCPS].ownerId,
        state.availableProposals[availableProposalsIndexCPS].projectId,
        state.availableProposals[availableProposalsIndexCPS].title,
        state.availableProposals[availableProposalsIndexCPS].description,
        state.availableProposals[availableProposalsIndexCPS].price,
        state.availableProposals[availableProposalsIndexCPS].date,
        action.proposalData.status
      );

      console.log(
        'store/reducers/proposals/CHANGE_PROPOSAL_STATUS, updated proposal: ',
        updatedProductCPS
      );
      //Update state
      const updatedAvailableProposalsCPS = updateCollection(
        state.availableProposals,
        action.pid,
        updatedProductCPS
      );
      const updatedUserProposalsCPS = updateCollection(
        state.userProposals,
        action.pid,
        updatedProductCPS
      );

      return {
        ...state,
        availableProposals: updatedAvailableProposalsCPS,
        userProposals: updatedUserProposalsCPS,
      };
    case DELETE_PROPOSAL:
      return {
        ...state,
        userProposals: state.userProposals.filter((proposal) => proposal.id !== action.pid),
        availableProposals: state.availableProposals.filter(
          (proposal) => proposal.id !== action.pid
        ),
      };
  }
  return state;
};
