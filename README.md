# egnahemsfabriken

## Workflow

open xCode

open androidStudio and launch the simulator from configure > AVD manager > click right hand play button

`cd egnahemsfabriken`

`npm start` (this opens an expo page in the browser)

in the terminal press `w` (launches project on web)

on the expo page in the browser click ‘run on …’ (android, iOS, web)

test on android, iOS, web, your own phone (see instructions under ‘simulators’ below)

alternatively:
press `i` (launches project in apple simulator)
press `a` (launches project in android simulator)

open react native debugger and a new tab in it by cmd + t.
In the new tab set the port to be that of the one you’re running in the expo window in the browser (should be 19001 or similar)
go to the simulator which is running on that port, press cmd + m for android or cmd + d for iOS and

work work work

push to git

## Over the air updates

expo publish

## Setup

### Prerequisites

#### XCode

Get it through app store

#### Android Studio

Google it

#### Visual Studio Code

Google it

#### Chrome

…uh, altavista it.

#### React Native Debugger

`brew update && brew cask install react-native-debugger`
This will install react native debugger in your applications folder.
Once done, open by going to applications and clicking the react native debugger.

#### Brew

https://brew.sh/

#### Expo

https://docs.expo.io/versions/latest/get-started/installation/

### Simulators

#### Run on Android simulator

install android studio, follow instructions here: https://docs.expo.io/versions/v36.0.0/workflow/android-studio-emulator/
Configure > SDK manager:

SDK Platforms > install the top first three in the list.

SDK Tools > install Android build tools, emulator, sdk platform tools and sdk tools, google play services and intel emulator

Configure > AVD manager > create virtual device > select a phone that has play store icon > choose and download OS > once created click the green play button under actions o launch the device
got to your terminal.
if you’re not already running write `npm start` then with that process running `a` to launch the expo project on android. it’ll first install stuff so patience, young one.

#### Run on iPhone simulator

install xcode

got to xcode > preferences > locations > check that the command line tools are installed (they are if there is a version listed)
xcode > oped developer tool > simulator

as with android: go to your terminal. if you’re not already running write `npm start` then with that process running `i` to launch the expo project on iPhone.

#### Run on your phone (Android or iPhone)

From your phone download expo on app or play store

Scan the QR code from your terminal in order to log in

boyaa

### FAQ

#### Debugging

##### Android:

in the simulator press cmd + m

##### iOS:

in the simulator press cmd + d

make sure in your original browser window (the one that opened when you ran npm start) you’ve set lan or local, not tunnel. Otherwise it will be super slow.

#### Reloading simulators

##### Android:

RR

##### iOS:

CMD + R

#### Upgrade expo

`npm i -g expo-cli`

`expo upgrade`
