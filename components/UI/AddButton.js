import React, { useState } from 'react';
import { FAB, Portal, Provider } from 'react-native-paper';

//Constants
import Colors from '../../constants/Colors';

const AddButton = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <Provider>
      <Portal>
        <FAB.Group
          open={isOpen}
          icon={isOpen ? 'plus' : 'plus'}
          actions={[
            {
              icon: 'star',
              label: 'Nytt Återbruk',
              onPress: () => props.navigation.navigate('EditProduct'),
            },
            {
              icon: 'star',
              label: 'Nytt Projekt',
              onPress: () => props.navigation.navigate('EditProject'),
            },
            {
              icon: 'star',
              label: 'Ny Efterlysning',
              onPress: () => props.navigation.navigate('EditProposal'),
            },
          ]}
          onStateChange={toggleOpen}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
        />
      </Portal>
    </Provider>
  );
};
export default AddButton;
