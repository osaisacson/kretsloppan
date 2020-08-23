import moment from 'moment/min/moment-with-locales';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import CalendarStrip from 'react-native-calendar-strip';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Divider } from 'react-native-paper';

import Colors from '../../constants/Colors';
import HeaderThree from './HeaderThree';

const Logistics = ({ suggestedDate, sendSuggestedTime }) => {
  console.log('CalendarSection, passed params:');
  console.log({ suggestedDate, sendSuggestedTime });
  console.log('------------');

  const colorScheme = useColorScheme();

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [suggestedDateLocal, setSuggestedDateLocal] = useState(suggestedDate ? suggestedDate : []); //If we already have a date suggested, use this as the original state
  const [suggestedDateTime, setSuggestedDateTime] = useState();

  const handleTimePicker = (date) => {
    setSuggestedDateLocal(date);
    setShowTimePicker(true);
  };

  const hideTimePicker = () => {
    setShowTimePicker(false);
  };

  const setSuggestedDT = (dateTime) => {
    setSuggestedDateTime(dateTime);
    sendSuggestedTime(dateTime);
    hideTimePicker();

    // Alert.alert(
    //   'Föreslå tid',
    //   `Genom att klicka här föreslår du ${moment(dateTime)
    //     .locale('sv')
    //     .format(
    //       'HH:mm, D MMMM'
    //     )} som tid för upphämtning. Om motparten godkänner tiden åtar du dig att vara på överenskommen plats vid denna tidpunkt.`,
    //   [
    //     { text: 'Avbryt', style: 'default' },
    //     {
    //       text: 'Jag förstår',
    //       style: 'destructive',
    //       onPress: () => {
    //         setOrderSuggestedDate(dateTime);
    //         hideTimePicker();
    //       },
    //     },
    //   ]
    // );
  };

  return (
    <>
      <Divider style={{ marginBottom: 10 }} />

      <HeaderThree
        style={{ textAlign: 'center', marginBottom: 10 }}
        text={
          suggestedDate
            ? `Tidigare föreslagen upphämtningstid: ${moment(
                suggestedDate
              )}. Föreslå en ny tid nedan.`
            : 'Föreslå en tid för upphämtning nedan.'
        }
      />
      <HeaderThree
        style={{ textAlign: 'center' }}
        text="Kontakta varandra om ni har frågor, annars är det nedan tid och säljarens givna upphämtningsplats som gäller."
      />
      <View style={{ flex: 1 }}>
        <CalendarStrip
          scrollable
          selectedDate={suggestedDateLocal}
          daySelectionAnimation={{
            type: 'border',
            borderWidth: 0.5,
            borderHighlightColor: Colors.darkPrimary,
            duration: 200,
          }}
          highlightDateNameStyle={{ color: Colors.darkPrimary }}
          highlightDateNumberStyle={{ color: Colors.darkPrimary }}
          styleWeekend
          onDateSelected={(date) => {
            handleTimePicker(date);
          }}
          style={{ height: 150, paddingTop: 20, paddingBottom: 10 }}
          type="border"
          borderWidth={1}
          borderHighlightColor="#666"
        />
        <DateTimePickerModal
          date={new Date(suggestedDateLocal)}
          isDarkModeEnabled={colorScheme === 'dark'}
          cancelTextIOS="Avbryt"
          confirmTextIOS="Klar!"
          headerTextIOS={`Valt datum ${moment(suggestedDateLocal)
            .locale('sv')
            .format('D MMMM')}. Välj tid:`}
          isVisible={showTimePicker}
          mode="time"
          locale="sv_SV" // Use "en_GB" here
          onConfirm={(dateTime) => {
            setSuggestedDT(dateTime);
          }}
          onCancel={hideTimePicker}
        />
        <HeaderThree style={{ textAlign: 'center' }} text="Föreslagen tid för upphämtning:" />
        <Text
          style={{
            textAlign: 'center',
            fontFamily: 'roboto-bold',
            fontSize: 15,
            marginTop: 5,
            marginBottom: 20,
          }}>
          {moment(suggestedDateTime).locale('sv').format('D MMM YYYY, HH:mm')}
        </Text>
      </View>
    </>
  );
};

export default Logistics;
