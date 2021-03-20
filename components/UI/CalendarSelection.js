import moment from 'moment/min/moment-with-locales';
import React, { useState } from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import CalendarStrip from 'react-native-calendar-strip';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Divider } from 'react-native-paper';

import Colors from '../../constants/Colors';
import HeaderThree from './HeaderThree';

const CalendarSelection = ({ suggestedDate, setSuggestedDate }) => {
  const colorScheme = useColorScheme();

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [newSuggestedDate, setNewSuggestedDate] = useState(suggestedDate ? suggestedDate : []); //If we already have a date suggested, use this as the original state

  const handleTimePicker = (date) => {
    setNewSuggestedDate(date);
    setShowTimePicker(true);
  };

  const hideTimePicker = () => {
    setShowTimePicker(false);
  };

  return (
    <>
      <Divider style={{ marginBottom: 10 }} />

      <HeaderThree
        style={{ textAlign: 'center' }}
        text={
          suggestedDate
            ? `Föreslagen tid: ${moment(suggestedDate)
                .locale('sv')
                .format('HH:mm, D MMMM')}. Föreslå en ny upphämtningstid nedan.`
            : 'Föreslå en tid för upphämtning nedan.'
        }
      />

      <View style={{ flex: 1 }}>
        <CalendarStrip
          scrollable
          selectedDate={newSuggestedDate}
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
          date={new Date(newSuggestedDate)}
          isDarkModeEnabled={colorScheme === 'dark'}
          cancelTextIOS="Avbryt"
          confirmTextIOS="Spara"
          headerTextIOS={`Valt datum ${moment(newSuggestedDate)
            .locale('sv')
            .format('D MMMM')}. Välj tid:`}
          isVisible={showTimePicker}
          mode="time"
          locale="sv_SV" // Use "en_GB" here
          onConfirm={(dateTime) => {
            setSuggestedDate(dateTime);
            hideTimePicker();
          }}
          onCancel={hideTimePicker}
        />
      </View>
    </>
  );
};

export default CalendarSelection;
