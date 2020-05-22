import firebase from 'firebase';

export const getIndex = (stateSegment, matchId) => {
  return stateSegment.findIndex((item) => item.id === matchId);
};

export const updateCollection = (stateSegment, itemId, itemToUpdateWith) => {
  const itemIndex = getIndex(stateSegment, itemId); //get the index of the passed item
  const updatedCollection = [...stateSegment]; //copy current state
  updatedCollection[itemIndex] = itemToUpdateWith; //find the position of the passed item index, and replace it with the passed item
  return updatedCollection;
};

export function convertImage(image) {
  return async () => {
    try {
      console.log('START----------actions/images/convertImage--------');
      console.log('Attempting to convert image from base64 to firebase url');
      console.log('image.length: ', image.length);

      // Perform the API call - convert image from base64 to a firebase url
      const response = await fetch(
        'https://us-central1-egnahemsfabriken.cloudfunctions.net/storeImage',
        {
          method: 'POST',
          body: JSON.stringify({
            image: image, //this gets the base64 of the image to upload into cloud storage. note: very long string. Expo currently doesn't work well with react native and firebase storage, so this is why we are doing this approach through cloud functions.
          }),
        }
      );

      const firebaseImageUrl = await response.json();
      console.log('returned image url from firebase', firebaseImageUrl);
      console.log('----------actions/images/convertImage--------END');
      return firebaseImageUrl;
    } catch (error) {
      console.log('----------actions/images/convertImage--------END');
      // Rethrow so returned Promise is rejected
      throw error;
    }
  };
}


export function updateExpoTokens(userId, remove = false) {
  try {
    firebase.database().ref('profiles').orderByChild('profileId').equalTo(userId).on('value', async snapshot => {
      const user = snapshot.val();
      const newToken = await Notifications.getExpoPushTokenAsync();

      const nextTokens = remove ? user.expoTokens.filter(token => token !== newToken) : [...user.expoTokens, newToken];

      snapshot.forEach(action => action.ref.update({ expoTokens: nextTokens }));
    });
  } catch (error) {
    console.error(error.message)
  }
}