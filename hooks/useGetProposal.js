import { useQuery } from 'react-query';
import firebase from 'firebase';

const getProposals = async () => {
  const data = await firebase.database().ref('proposals').once('value');
  const normalizedProposalData = data.val();
  const proposalData = [];

  for (const key in normalizedProposalData) {
    const proposal = normalizedProposalData[key];
    proposalData.push({
      id: key,
      ...proposal,
    });
  }

  return proposalData;
};

const useProposals = (select) => useQuery(['proposals'], getProposals, { select });

export default function useGetProposal(id) {
  return useProposals((proposals) => proposals.find((proposal) => proposal.id === id));
}
