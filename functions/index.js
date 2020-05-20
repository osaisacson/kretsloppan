// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();
const cors = require('cors')({ origin: true });
const fs = require('fs');
const UUID = require('uuid-v4');
// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage');

const { Expo } = require('expo-server-sdk');

// Create a new Expo SDK client
let expo = new Expo();


// Creates a client
const storage = new Storage({
  projectId: 'egnahemsfabriken',
  keyFilename: 'egnahemsfabriken-firebase.json',
});

exports.storeImage = functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
    const body = JSON.parse(request.body);
    console.log('request from cloud function storeImage in index.js', request);
    console.log(
      'request.body from cloud function storeImage in index.js',
      request.body
    );
    console.log(
      'JSON.parse(request.body) from cloud function storeImage in index.js',
      body
    );
    fs.writeFileSync('/tmp/uploaded-image.jpg', body.image, 'base64', (err) => {
      console.log(err);
      return response.status(500).json({ error: err });
    });
    const bucket = storage.bucket('egnahemsfabriken.appspot.com');
    const uuid = UUID();

    return bucket.upload(
      '/tmp/uploaded-image.jpg',
      {
        uploadType: 'media',
        destination: '/pictures/' + uuid + '.jpg',
        metadata: {
          metadata: {
            contentType: 'image/jpeg',
            firebaseStorageDownloadTokens: uuid,
          },
        },
      },
      (err, file) => {
        if (!err) {
          return response.status(201).json({
            image:
              'https://firebasestorage.googleapis.com/v0/b/' +
              bucket.name +
              '/o/' +
              encodeURIComponent(file.name) +
              '?alt=media&token=' +
              uuid,
          });
        } else {
          console.log(
            'Error when trying to upload the image into bucket, storeImage index.js: ',
            err
          );
          return response.status(500).json({ error: err });
        }
      }
    );
  });
});


exports.sendPushNotificationsOnReserve = functions.database.ref('/products/{productId}').onUpdate(({ before, after }) => {
  const beforeVal = before.val();
  const afterVal = after.val();
  const beforeReservedDate = beforeVal.reservedDate;
  const afterReservedDate = afterVal.reservedDate;

  if (!beforeReservedDate && afterReservedDate) {
    const reservedUserId = afterVal.reservedUserId;
    const productName = afterVal.title;
    return admin.database().ref('profiles').orderByChild('profileId').equalTo(reservedUserId).on('value', snapshot => {

      const normalizedData = snapshot.val();
      const id = Object.keys(normalizedData);
      const reservedUser = normalizedData[id[0]];

      if (reservedUser) {
        const message = {
          to: reservedUser.expoTokens,
          sound: 'default',
          title: 'Produkt Reserverad',
          body: `${reservedUser.profileName} reserverade precis ditt återbruk ${productName}`,
          _displayInForeground: true,
        };

        expo.sendPushNotificationsAsync([message])
          .then(() => console.info("Product notification sent!"))
          .catch((e) => console.error("Product notification failed!", e.message));
      }
    });



  }

  return null;
});