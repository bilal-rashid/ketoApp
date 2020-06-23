import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import {useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Button, Platform} from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import {MonoText} from "../components/StyledText";
// import * as Progress from 'react-native-progress';


export default function LinksScreen() {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.getStartedContainer}>

        <Text style={styles.getStartedText}>Set Date:</Text>
        <TouchableOpacity onPress={showDatepicker}>
          <Text style={styles.dateStyle}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
      </View>
      {/*<Progress.Bar progress={0.3} width={200}  color={['12', '12', '12']} />*/}
      {show && (
          <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
          />
      )}
      {/*<OptionButton*/}
      {/*  icon="md-school"*/}
      {/*  label="Read the Expo documentation"*/}
      {/*  onPress={() => WebBrowser.openBrowserAsync('https://docs.expo.io')}*/}
      {/*/>*/}

      {/*<OptionButton*/}
      {/*  icon="md-compass"*/}
      {/*  label="Read the React Navigation documentation"*/}
      {/*  onPress={() => WebBrowser.openBrowserAsync('https://reactnavigation.org')}*/}
      {/*/>*/}

      {/*<OptionButton*/}
      {/*  icon="ios-chatboxes"*/}
      {/*  label="Ask a question on the forums"*/}
      {/*  onPress={() => WebBrowser.openBrowserAsync('https://forums.expo.io')}*/}
      {/*  isLastOption*/}
      {/*/>*/}
    </ScrollView>
  );
}

function OptionButton({ icon, label, onPress, isLastOption }) {
  return (
    <RectButton style={[styles.option, isLastOption && styles.lastOption]} onPress={onPress}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.optionIconContainer}>
          <Ionicons name={icon} size={22} color="rgba(0,0,0,0.35)" />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>{label}</Text>
        </View>
      </View>
    </RectButton>
  );
}

const styles = StyleSheet.create({

  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },

  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  dateStyle: {
    fontSize: 19,
    color: 'rgb(18,19,19)',
    lineHeight: 24,
    marginLeft: 100,
    textAlign: 'right',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  contentContainer: {
    paddingTop: 15,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: '#ededed',
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 1,
  },
});
