import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import {Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';
import { MonoText } from '../components/StyledText';
export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      editMode: false,
      name: '',
      calories: 0,
      protein:0,
      fat:0,
      carb:0,
      error:false
    };
  }

  componentDidMount() {
    this.fetchFromLocalStorage();
  }
  fetchFromLocalStorage = () => {
    SecureStore.getItemAsync('user_name').then(user_name => {
      SecureStore.getItemAsync('user_calories').then(user_calories => {
        SecureStore.getItemAsync('user_protein').then(user_protein => {
          SecureStore.getItemAsync('user_fat').then(user_fat => {
            SecureStore.getItemAsync('user_carb').then(user_carb => {
              this.setState({
                name: (user_name)? user_name: '',
                calories: (user_calories)? +user_calories: 0,
                protein: (user_protein)? +user_protein: 0,
                fat: (user_fat)? +user_fat: 0,
                carb: (user_carb)? +user_carb: 0
              });
            });
          });
        });
      });
    });
  }
  saveval = () => {
    console.warn('call');
    SecureStore.setItemAsync('notFirstLaunch', 'bilal').then(value => {console.warn(value)})
  }
  editProfile = () => {
    this.setState({editMode: true});
  }
  saveProfile = () => {
    const totalPercent = this.state.protein + this.state.fat + this.state.carb;
    if (totalPercent > 100) {
      this.setState({error: true});
    } else {
      SecureStore.setItemAsync('user_name', this.state.name);
      SecureStore.setItemAsync('user_calories', this.state.calories.toString());
      SecureStore.setItemAsync('user_protein', this.state.protein.toString());
      SecureStore.setItemAsync('user_fat', this.state.fat.toString());
      SecureStore.setItemAsync('user_carb', this.state.carb.toString());
      this.setState({editMode: false, error: false});
    }
  }
  onChangeName = (value) => {
    this.setState({
      name:value
    })
  }
  onChangeCalories = (value) => {
    this.setState({
      calories:+value
    })
  }
  onChangeProtein = (value) => {
    this.setState({
      protein:+value
    })
  }
  onChangeFat = (value) => {
    this.setState({
      fat:+value
    })
  }
  onChangeCarb = (value) => {
    this.setState({
      carb:+value
    })
  }
  render () {
    return (
        <View style={styles.container}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.welcomeContainer}>
              <Image

                  source={
                    __DEV__
                        ? require('../assets/images/user.png')
                        : require('../assets/images/user.png')
                  }
                  style={styles.welcomeImage}
              />
            </View>
            { !this.state.editMode &&
              <View style={{borderRadius:10,borderColor: '#d2d1d1', borderWidth: 1, marginRight:50, marginLeft:50}}>
                <Text style={{fontSize: 19, alignSelf: 'center', marginRight: 15, marginTop: 20}}>{this.state.name}</Text>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Text style={{
                    fontSize: 19,
                    color: 'black',
                    alignSelf: 'center',
                    marginRight: 5,
                    marginTop: 20
                  }}>{this.state.calories}</Text>
                  <Text style={{fontSize: 14, color: 'grey', alignSelf: 'center', marginRight: 15, marginTop: 20}}>Kalorien
                    pro Tag</Text>
                </View>
                <View style={styles.getStartedContainer}>
                  <Text style={styles.getStartedText}>Verhältnis:</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Text style={{
                    fontSize: 17,
                    color: 'grey',
                    alignSelf: 'center',
                    marginRight: 15,
                    marginTop: 20
                  }}>Eiweiß</Text>
                  <Text style={{fontSize: 19, color: 'black', alignSelf: 'center', marginRight: 15, marginTop: 20}}>{this.state.protein}%</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Text style={{
                    fontSize: 17,
                    color: 'grey',
                    alignSelf: 'center',
                    marginRight: 15,
                    marginTop: 20
                  }}>Fett</Text>
                  <Text style={{fontSize: 19, color: 'black', alignSelf: 'center', marginRight: 15, marginTop: 20}}>{this.state.fat}
                    %</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Text style={{
                    fontSize: 17,
                    color: 'grey',
                    alignSelf: 'center',
                    marginRight: 15,
                    marginTop: 20
                  }}>Kohlenhydrat</Text>
                  <Text style={{fontSize: 19, color: 'black', alignSelf: 'center', marginRight: 15, marginTop: 20}}>{this.state.carb}
                    %</Text>
                </View>
                <TouchableOpacity onPress={this.editProfile} style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>Edit</Text>
                </TouchableOpacity>
              </View>
            }
            { this.state.editMode &&
              <View>
                <TextInput
                    style={styles.textInputStyle}
                    placeholder={'Name'}
                    value={this.state.name}
                    onChangeText={this.onChangeName}
                    keyboardType={'default'}
                />
                <TextInput
                    style={styles.textInputStyle}
                    placeholder={'Kalorien pro Tag'}
                    value={this.state.calories.toString()}
                    onChangeText={this.onChangeCalories}
                    keyboardType={'decimal-pad'}
                />

                <View style={styles.getStartedContainer}>
                  <Text style={styles.getStartedText}>Verhältnis:</Text>
                </View>
                <TextInput
                    style={styles.textInputStyle}
                    placeholder={'Protein%'}
                    value={this.state.protein.toString()}
                    onChangeText={this.onChangeProtein}
                    keyboardType={'decimal-pad'}
                />
                <TextInput
                    style={styles.textInputStyle}
                    placeholder={'Fat %'}
                    value={this.state.fat.toString()}
                    onChangeText={this.onChangeFat}
                    keyboardType={'decimal-pad'}
                />
                <TextInput
                    style={styles.textInputStyle}
                    placeholder={'Carbohydrate %'}
                    value={this.state.carb.toString()}
                    onChangeText={this.onChangeCarb}
                    keyboardType={'decimal-pad'}
                />
                {this.state.error &&
                  <Text style={{color: 'red', alignSelf: 'center', marginTop: 10}}>Ungültig Verhältnis</Text>
                }
                <TouchableOpacity onPress={this.saveProfile} style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>Save</Text>
                </TouchableOpacity>
              </View>
            }

            {/*<View style={styles.helpContainer}>*/}
            {/*  <TouchableOpacity onPress={handleHelpPress} style={styles.helpLink}>*/}
            {/*    <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>*/}
            {/*  </TouchableOpacity>*/}
            {/*</View>*/}
          </ScrollView>

          {/*<View style={styles.tabBarInfoContainer}>*/}
          {/*  <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>*/}

          {/*  <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>*/}
          {/*    <MonoText style={styles.codeHighlightText}>navigation/BottomTabNavigator.js</MonoText>*/}
          {/*  </View>*/}
          {/*</View>*/}
        </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use useful development
        tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/workflow/development-mode/');
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/get-started/create-a-new-app/#making-your-first-change'
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
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
    tintColor: 'grey'
  },
  getStartedContainer: {
    alignItems: 'center',
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
    marginRight: 15,
    textAlign: 'center',
    marginBottom:10,
    marginTop:20,
    fontWeight: 'bold'
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
  textInputStyle: {
    marginLeft: 30,
    marginRight:30,
    height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 4, margin: 5, padding: 4 },
  buttonStyle: {
    backgroundColor: '#007AFF',
    width:150,
    alignSelf: 'center',
    alignItems: 'center',
    padding:10,
    borderRadius: 10,
    marginBottom:10,
    marginTop:30
  },
  buttonTextStyle: {
    color:'#fff',
    fontSize: 19,
  }
});
