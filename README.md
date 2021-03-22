<p align="left">
  <img src="https://user-images.githubusercontent.com/3785147/90018981-11d7d880-dcae-11ea-82ee-d01a7449581e.jpg" width="190" title="kretsloppan">
</p>

# Kretsloppan

iOS/Android app supporting local sustainable reuse of building materials.
In collaboration with Egnahemsfabriken - (https://coompanion.se/2020/11/10/egnahemsfabriken-blir-arets-kooperativ-2020/ "Swedish Cooperative of the Year 2020"). The project was developed with the support of Vinnova - Swedens innovation agency.

Kretsloppan serves as a tool for the residents of Tjörns Kommun to manage local logistics of bartering, buying and selling of used building materials. The heart of this work is the center for reused materials located at Egnahemsfabriken.

The app allows the user to:

- Upload their own materials
- Browse available materials
- Book and confirm pick up of materials
- Freely advertise for needed materials
- Create projects
- Associate collected materials to projects, providing follow up to where the materials end up in their second (third, fourth...) lives.

Kretsloppan is a local, non-profit initiative which welcomes collaborations. We work according to decentralised principles and believe in tech adjusting to local conditions, not the other way around. If you wish to setup similar initiatives in your vicinity feel welcome to contact us through asaisacson@gmail.com for support.

## Get started

Make sure you first have installed:

- XCode
- Android Studio
- NPM
- Expo CLI

See 'Setup' below for step-by-step details on how to install and configure the above.

Then...
`git clone https://github.com/osaisacson/kretsloppan.git`
`git init`
`npm install`
...if you get an error about peer-deps do `npm install react-native-fs --save --legacy-peer-deps`
Start apple and android simulators, see details in 'Simulators' below
`expo start`
Select 'Run on iOS simulator' and 'Run on Android simulator' in you browser
With the Expo app in your phone scan QR code to see it on your device

## Workflow

- `git checkout master`
- `git pull`
- `git checkout -b 'name-of-new-branch'`
- Work work work
- When you have made changes worthy of a commit, do a commit `git commit -m '...'`. Don't make huge commits. Do make legible and focused ones.

## Release new version on the App store/Google Play store

- Read info here: https://docs.expo.io/distribution/app-stores/
- `expo build:android`
- `expo build:ios`
- `expo publish` background on this here: https://docs.expo.io/workflow/publishing/
- To upload the previously built standalone app to the appropriate app store, you simply run `expo upload:android` for android, more on this here: https://docs.expo.io/distribution/uploading-apps/
- When asked for Google Service Account path: ./../api-7295700764673714197-958965-962f25310ea7.json
- To upload ios go to https://expo.io/accounts/asaisacson/builds where you will find the build, dwnload it as .ipa
- Install/open Transporter from the app store
- Upload the .ipa in the Transporter
- Go to https://appstoreconnect.apple.com/apps/1523861208/testflight/ios
- Select your app and on the top left plus sign create a new version
- Wait until testflight has finished uploading. Check the status under the tab 'Testflight' It could take about an hour and you wont be able to select the build for the version documentation until its done.
- Fill out documentation upload details and choose the build.
- Click publish

## Original setup

Install the below:

### Required

##### Node/NPM

- Check if you have Node.js: `node -v`
- Check if you have npm installed `npm -v`
- Install from scratch: https://nodejs.org/en/
- To update to latest version of npm `npm install npm@latest -g`

##### XCode

Get it through app store

##### Android Studio

Follow instructions here: https://docs.expo.io/versions/v36.0.0/workflow/android-studio-emulator/

##### Expo

https://docs.expo.io/versions/latest/get-started/installation/
Tip if need to upgrade Expo:
`sudo npm i -g expo-cli` Enter your password.
`expo upgrade`

### Recommended:

##### Visual Studio Code

Google it

##### Chrome

…uh, altavista it.

##### Brew

https://brew.sh/

##### React Native Debugger

`brew update && brew cask install react-native-debugger`
This will install react native debugger in your applications folder.
Once done, open by going to applications and clicking the react native debugger.

## Simulators

### Run on Android simulator

- Open Android Studio
- Configure > SDK manager:
- SDK Platforms > install the top first three in the list.
- SDK Tools > install Android build tools, emulator, sdk platform tools and sdk tools, google play services and intel emulator
- Configure > AVD manager > create virtual device > select a phone that has play store icon > choose and download OS > once created click the green play button under actions to launch the device
- Go to your terminal. If you’re not already running write `expo start` then with that process running `a` to launch the Expo project on android. It’ll first need to install some stuff so patience, young one.

### Run on iPhone simulator

- Open Xcode
- Go to Xcode > preferences > locations > check that the command line tools are installed (they are if there is a version listed)
- Xcode > open developer tools > simulator
- As with android: go to your terminal. If you’re not already running write `expo start` then with that process running `i` to launch the expo project on iPhone.

### Run on your phone (Android or iPhone)

- From your phone download Expo on App store or the Google Play store
- Scan the QR code from your terminal in order to log in
- Boyaa

## FAQ

### How do I debug?

Android: in the simulator press cmd + m
iOS: in the simulator press cmd + d
Make sure in your original browser window (the one that opened when you ran npm start) you’ve set lan or local, not tunnel. Otherwise it will be super slow.

### How do I reload simulators?

Android: RR
iOS: CMD + R

### How do I use this repo as a template for a new project?

- Clone the project
- Create a new firebase db: https://console.firebase.google.com/
- Change the name of example-env in the root of your project to env.js and (IMPORTANT) include it in your gitignore file.
- In firebase, go to project settings and find your project details. Update the account details in env.js
- Delete all specific firebase files in root, these will be generated in the next step
- `firebase init` - select installing all options. Follow all defaults apart for functions, do not overwrite these.
- In firebase project settings download the google-services.json file from your apps/android and the GoogleService-Info.plist from your apps/iOS, add these to the root of your project
- In firebase/auth set up your authentication
