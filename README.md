<p align="left">
  <img src="https://user-images.githubusercontent.com/3785147/90018981-11d7d880-dcae-11ea-82ee-d01a7449581e.jpg" width="190" title="kretsloppan">
</p>

# kretsloppan

iOS/Android app supporting sustainable reuse of building materials

## get started

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
`npm start`
...and start apple and android simulators

## When using as a template

- clone the project
- create a new firebase db: https://console.firebase.google.com/
- change the name of example-env in the root of your project to env.js and (IMPORTANT) include it in your gitignore file.
- in firebase, go to project settings and find your project details. Update the account details in env.js
- delete all specific firebase files in root, these will be generated in the next step
- `firebase init` - select installing all options. Follow all defaults apart for functions, do not overwrite these.
- In firebase project settings download the google-services.json file from your apps/android and the GoogleService-Info.plist from your apps/iOS, add these to the root of your project
- In firebase/auth set up your authentication

## Setup

### Prerequisites

Install the below:

#### XCode

Get it through app store

#### Android Studio

Follow instructions here: https://docs.expo.io/versions/v36.0.0/workflow/android-studio-emulator/

#### Visual Studio Code

Google it

#### Chrome

…uh, altavista it.

#### Expo

https://docs.expo.io/versions/latest/get-started/installation/
Tip if need to upgrade Expo:
`npm i -g expo-cli`
`expo upgrade`

#### Brew

https://brew.sh/

#### React Native Debugger

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
- Go to your terminal. If you’re not already running write `npm start` then with that process running `a` to launch the Expo project on android. It’ll first need to install some stuff so patience, young one.

### Run on iPhone simulator

- Install Xcode
- Go to Xcode > preferences > locations > check that the command line tools are installed (they are if there is a version listed)
- Xcode > open developer tools > simulator
- As with android: go to your terminal. If you’re not already running write `npm start` then with that process running `i` to launch the expo project on iPhone.

### Run on your phone (Android or iPhone)

- From your phone download Expo on App store or the Google Play store
- Scan the QR code from your terminal in order to log in
- boyaa

## FAQ

### Debugging

Android: in the simulator press cmd + m
iOS: in the simulator press cmd + d
Make sure in your original browser window (the one that opened when you ran npm start) you’ve set lan or local, not tunnel. Otherwise it will be super slow.

### Reloading simulators

Android: RR
iOS: CMD + R
