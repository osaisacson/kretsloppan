import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Portal, Provider } from 'react-native-paper';
//Constants
import Colors from '../../constants/Colors';

const AddButton = props => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTrueFalse = () => setIsOpen(!isOpen);

  return (
    <Provider>
      <Portal>
        <FAB.Group
          open={isOpen}
          icon={isOpen ? 'star' : 'star'}
          actions={[
            {
              icon: 'star',
              onPress: () => console.log('Pressed add')
            },
            {
              icon: 'star',
              label: 'Star',
              onPress: () => console.log('Pressed star')
            },
            {
              icon: 'email',
              label: 'Email',
              onPress: () => console.log('Pressed email')
            },
            {
              icon: 'bell',
              label: 'Remind',
              onPress: () => console.log('Pressed notifications')
            }
          ]}
          onStateChange={toggleTrueFalse}
          onPress={() => {
            if (isOpen) {
              // do something if the speed dial is open
            }
          }}
        />
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: Colors.primary,
    shadowColor: 'black',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2, //Because shadow only work on iOS, elevation is same thing but for android.
    width: 66,
    height: 66,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20
  },
  buttonTextStyle: {
    color: 'white',
    fontSize: 45,
    marginBottom: 6
  }
});

export default AddButton;
