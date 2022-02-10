import { useQuery } from 'react-query';
import firebase from 'firebase';

export const getProfiles = async () => {
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

export default function useGetProfiles() {
  return useQuery('profiles', getProfiles);
}
