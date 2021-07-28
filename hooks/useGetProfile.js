import { useQuery } from 'react-query';
import firebase from 'firebase';

const getProfiles = async () => {
  const data = await firebase.database().ref('profiles').once('value');
  const normalizedProfileData = data.val();
  const profileData = [];

  for (const key in normalizedProfileData) {
    const profile = normalizedProfileData[key];
    profileData.push({
      id: key,
      ...profile,
    });
  }

  return profileData;
};

const useProfiles = (select) => useQuery(['profiles'], getProfiles, { select });

export default function useGetProfile(id) {
  return useProfiles((profiles) => profiles.find((profile) => profile.id === id));
}
