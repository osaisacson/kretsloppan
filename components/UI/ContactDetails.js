import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';

import AnimatedButton from './AnimatedButton';

const ContactDetails = (props) => {
  const [toggleDetails, setToggleDetails] = useState(false);

  //Find the profile which matches the id we passed on clicking to the detail
  const defaultObject = useSelector((state) =>
    state.profiles.allProfiles.find(({ profileId }) => profileId === props.profileId)
  );

  if (!defaultObject) {
    return null;
  }

  const { email, phone, address } = defaultObject;

  let contactEmail = email;
  let contactPhone = phone;
  let contactAddress = address;

  //If we are looking at the details for a product, proposal or project, instead show the specific details for this
  if (props.productId) {
    const product = useSelector((state) =>
      state.products.availableProducts.filter((prod) => prod.id === props.productId)
    );

    const productObj = product[0];

    contactEmail = productObj.email ? productObj.email : email;
    contactPhone = productObj.phone ? productObj.phone : phone;
    contactAddress = productObj.address ? productObj.address : address;
  }

  if (props.proposalId) {
    const proposal = useSelector((state) =>
      state.proposals.availableProposals.filter((proposal) => proposal.id === props.proposalId)
    );

    const proposalObj = proposal[0];

    contactEmail = proposalObj.email ? proposalObj.email : email;
    contactPhone = proposalObj.phone ? proposalObj.phone : phone;
    contactAddress = proposalObj.address ? proposalObj.address : address;
  }

  const hasInfo = contactEmail || contactPhone || contactAddress;

  const toggleShowDetails = () => {
    setToggleDetails((prevState) => !prevState);
  };

  return (
    <>
      <AnimatedButton
        text={toggleDetails ? 'Dölj kontaktdetaljer' : 'kontaktdetaljer'}
        onPress={toggleShowDetails}
      />
      {/* Contact information */}
      {toggleDetails ? (
        <View
          style={{
            marginVertical: 5,
            alignItems: 'center',
          }}>
          {hasInfo ? (
            <>
              <Text>{contactEmail}</Text>
              <Text>{contactPhone}</Text>
              <Text>{contactAddress}</Text>
            </>
          ) : (
            <Text>Ingen kontaktinformation tillgänglig</Text>
          )}
          {/* TBD: In-app messaging - Button for passing an object 
            reference to the in-app messaging screen */}
          {/* <ButtonAction
              large={true}
              icon="email"
              title={'Skicka meddelande'} //Send message
              onSelect={() => {}} //Should open the in-app messaging view, forwarding a title to what the message is about: {`Angående: ${objectForDetails.title}`}. Title should in the message link to the post it refers to.
            /> */}
        </View>
      ) : null}
    </>
  );
};

export default ContactDetails;
