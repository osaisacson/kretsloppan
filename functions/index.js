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
// Creates a client
const storage = new Storage({
  projectId: 'egnahemsfabriken',
  keyFilename: 'egnahemsfabriken-firebase.json'
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
    fs.writeFileSync('/tmp/uploaded-image.jpg', body.image, 'base64', err => {
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
            firebaseStorageDownloadTokens: uuid
          }
        }
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
              uuid
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
