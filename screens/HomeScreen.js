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
    };
  }

  componentDidMount() {
  }
  fetchval = () => {
    SecureStore.getItemAsync('notFirstLaunch').then(value => {
      console.warn(value);
    });
  }
  saveval = () => {
    console.warn('call');
    SecureStore.setItemAsync('notFirstLaunch', 'bilal').then(value => {console.warn(value)})
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
            <TextInput
                style={styles.textInputStyle}
                placeholder={'Name'}
                keyboardType={'default'}
            />
            <TextInput
                style={styles.textInputStyle}
                placeholder={'Calories per day'}
                keyboardType={'decimal-pad'}
            />

            <View style={styles.getStartedContainer}>
              <Text  style={styles.getStartedText}>Proportion:</Text>
            </View>
            <TextInput
                style={styles.textInputStyle}
                placeholder={'Protein%'}
                keyboardType={'decimal-pad'}
            />
            <TextInput
                style={styles.textInputStyle}
                placeholder={'Fat %'}
                keyboardType={'decimal-pad'}
            />
            <TextInput
                style={styles.textInputStyle}
                placeholder={'Carbohydrate %'}
                keyboardType={'decimal-pad'}
            />
            <TouchableOpacity style={styles.buttonStyle}>
              <Text style={styles.buttonTextStyle}>Save</Text>
            </TouchableOpacity>

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
    backgroundColor: '#519a55',
    width:150,
    alignSelf: 'center',
    alignItems: 'center',
    padding:10,
    borderRadius: 10,
    marginTop:30
  },
  buttonTextStyle: {
    color:'#fff',
    fontSize: 19,
  }
});
