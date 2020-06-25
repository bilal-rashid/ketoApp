import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import { Button, Platform} from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
// import * as Progress from 'react-native-progress';
import * as Progress from 'react-native-progress';
import MealComponent from "../components/MealComponent";
import Enums from '../constants/Enums';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("db.db");
export default class LinksScreen extends React.Component {
  constructor () {
    super();
    this.state = {
      date: new Date(),
      mode: 'date',
      show: false
    };
  }
  // private _closeDialog = (): void => {
  onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    this.setState({
      show: false,
      date: currentDate
    })
  };
  showMode = (currentMode) => {
    this.setState({
      show: true,
      mode: currentMode
    })
  };

  showDatepicker = () => {
    this.showMode('date');
    db.transaction(
        tx => {
          tx.executeSql("insert into meals (protein, fat,carb,name) values (12.4,21,5.5, 'channay')", null);
          // tx.executeSql("insert into meals (protein, fat,carb,name) values (12,11,5, 'channay2')", null);
        }
    );
  };

  gotoIngredients = (meal) => {
    this.props.navigation.navigate('Ingredients', {mealType:meal, date: this.state.date});
  };
  render () {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.getStartedContainer}>

            <Text style={styles.getStartedText}>Set Date:</Text>
            <TouchableOpacity onPress={this.showDatepicker}>
              <Text style={styles.dateStyle}>{this.state.date.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBarContainer} >
              <View style={{marginBottom:5}}>
                <Progress.Bar progress={0.4} width={null} height={10} color={'#f37f4a'} />
              </View>
              <View style={styles.progressTextContainer}>
                <Text style={styles.progressTextLeft}>Einweis</Text>
                <Text style={styles.progressTextRight}>0.0/1g</Text>
              </View>

            </View>
            <View style={styles.progressBarContainer} >
              <View style={{marginBottom:5}}>
                <Progress.Bar progress={0.7} width={null} height={10} color={'#933dde'} />
              </View>
              <View style={styles.progressTextContainer}>
                <Text style={styles.progressTextLeft}>Fett</Text>
                <Text style={styles.progressTextRight}>0.0/1g</Text>
              </View>
            </View>
            <View style={styles.progressBarContainer} >
              <View style={{marginBottom:5}}>
                <Progress.Bar progress={0.5} width={null} height={10} color={'#3b3a39'} />
              </View>
              <View style={styles.progressTextContainer}>
                <Text style={styles.progressTextLeft}>Kohlenhydrate jjjj</Text>
                <Text style={styles.progressTextRight}>0.0/1g</Text>
              </View>
            </View>
          </View>
          <View style={{height:1, backgroundColor:'#5f5f5f', marginTop:10}}/>
          <MealComponent
              callBackAdd = {this.gotoIngredients}
              mealText={'Frühstück'}
              mealType={Enums.breakFast}
              imageSrc={require('../assets/images/mug.png')}/>
          <MealComponent
              callBackAdd = {this.gotoIngredients}
              mealType={Enums.lunch}
              mealText={'Mittagessen'}
              imageSrc={require('../assets/images/meat.png')}/>
          <MealComponent
              callBackAdd = {this.gotoIngredients}
              mealType={Enums.dinner}
              mealText={'Abendessen'}
              imageSrc={require('../assets/images/dinner.png')}/>
          {/*<Progress.Bar progress={0.3} width={200}  color={['12', '12', '12']} />*/}
          {this.state.show && (
              <DateTimePicker
                  testID="dateTimePicker"
                  value={this.state.date}
                  mode={this.state.mode}
                  display="default"
                  onChange={this.onChange}
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
  progressContainer: {
    paddingTop: 10,
    marginTop:20,
    marginStart:10,
    marginEnd: 10,
    borderRadius: 4,
    flexDirection: 'column',
    borderColor: '#a09c9c',
    borderWidth: 1,
  },
  progressBarContainer: {
    padding:10,
    flexDirection: 'column'
  },
  progressTextLeft: {
    fontSize:15,
    fontWeight:'bold'
  },
  progressTextRight: {
    fontSize:12,
    color:'#656363'
  },
  progressTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
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
    fontSize: 23,
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
