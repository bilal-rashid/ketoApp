import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import {Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View,Button} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as SecureStore from 'expo-secure-store';
export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      editMode: true,
      percentMode: false,
      name: '',
      calories: 0,
      protein:0,
      fat:0,
      carb:0,
      proteinPercent:0,
      fatPercent:0,
      carbPercent:0,
      ratio:0,
      error:false
    };
  }

  componentDidMount() {
    this.fetchFromLocalStorage();
  }
  fetchFromLocalStorage = () => {
    var protein_in_gram = 1;
    var fat_in_gram = 1;
    var carb_in_gram = 1;
    SecureStore.getItemAsync('user_name').then(user_name => {
      SecureStore.getItemAsync('user_calories').then(user_calories => {
        SecureStore.getItemAsync('user_protein').then(user_protein => {
          SecureStore.getItemAsync('user_fat').then(user_fat => {
            SecureStore.getItemAsync('user_carb').then(user_carb => {
              if (user_calories && user_carb && user_fat && user_protein) {
                if (user_calories > 0 && user_protein > 0) {
                  protein_in_gram = +(((user_calories * user_protein / 100) / 4.1).toFixed(2));
                }
                if (user_calories > 0 && user_fat > 0) {
                  fat_in_gram = +(((user_calories * user_fat / 100) / 9.3).toFixed(2));
                }
                if (user_calories > 0 && user_carb > 0) {
                  carb_in_gram = +(((user_calories * user_carb / 100) / 4.1).toFixed(2));
                }
              }
              this.setState({
                name: (user_name)? user_name: '',
                calories: (user_calories)? +user_calories: 0,
                proteinPercent: (user_protein)? +user_protein: 0,
                fatPercent: (user_fat)? +user_fat: 0,
                carbPercent: (user_carb)? +user_carb: 0,
                protein: protein_in_gram,
                fat: fat_in_gram,
                carb: carb_in_gram,
                ratio: +((fat_in_gram/(protein_in_gram+carb_in_gram)).toFixed(2))
              });
            });
          });
        });
      });
    });
  };
  editProfile = () => {
    this.setState({editMode: true});
  };
  setPercentMode = () => {
    this.setState({
      percentMode: true
    });
  };
  setValueMode = () => {
    this.setState({
      percentMode: false
    });
  };
  saveProfile = () => {
    const totalPercent = this.state.proteinPercent + this.state.fatPercent + this.state.carbPercent;
    if (totalPercent > 101) {
      this.setState({error: true});
    } else {
      SecureStore.setItemAsync('user_name', this.state.name);
      SecureStore.setItemAsync('user_calories', this.state.calories.toString());
      SecureStore.setItemAsync('user_protein', this.state.proteinPercent.toString());
      SecureStore.setItemAsync('user_fat', this.state.fatPercent.toString());
      SecureStore.setItemAsync('user_carb', this.state.carbPercent.toString());
      this.setState({editMode: false, error: false});
    }
  };
  onChangeName = (value) => {
    this.setState({
      name:value
    });
  };
  onChangeCalories = (value) => {
      let protein_in_gram = 0;
      let fat_in_gram = 0;
      let carb_in_gram = 0;
      if ((+value) > 0 && (this.state.proteinPercent) > 0) {
        protein_in_gram = +((((value * (this.state.proteinPercent) / 100) / 4.1)).toFixed(2));
      }
      if ((+value) > 0 && this.state.fatPercent > 0) {
        fat_in_gram = +((((value * this.state.fatPercent / 100) / 9.3)).toFixed(2));
      }
      if ((+value) > 0 && this.state.carbPercent > 0) {
        carb_in_gram = +((((value * this.state.carbPercent / 100) / 4.1)).toFixed(2));
      }
      this.setState({
        calories:+value,
        fat: fat_in_gram,
        protein: protein_in_gram,
        carb: carb_in_gram,
        ratio: +((fat_in_gram/(protein_in_gram+carb_in_gram)).toFixed(2))
      });
    };
  onChangeProteinPercent = (value) => {
    let carbPercent = +(100 - this.state.fatPercent - (+value)).toFixed(2);
    if (carbPercent > -1) {
      let protein_in_gram = 0;
      let fat_in_gram = 0;
      let carb_in_gram = 0;
      if (this.state.calories > 0 && (+value) > 0) {
        protein_in_gram = +((((this.state.calories * (+value) / 100) / 4.1)).toFixed(2));
      }
      if (this.state.calories > 0 && this.state.fatPercent > 0) {
        fat_in_gram = +((((this.state.calories * this.state.fatPercent / 100) / 9.3)).toFixed(2));
      }
      if (this.state.calories > 0 && carbPercent > 0) {
        carb_in_gram = +((((this.state.calories * carbPercent / 100) / 4.1)).toFixed(2));
      }
      this.setState({
        proteinPercent: +value,
        carbPercent: carbPercent,
        fat: fat_in_gram,
        protein: protein_in_gram,
        carb: carb_in_gram,
        ratio: +((fat_in_gram/(protein_in_gram+carb_in_gram)).toFixed(2))
      });
    }
  };
  onChangeProtein = (value) => {
    let proteinPercent = 0;
    let carbPercent = 0;
    let carb = 0;
    if (this.state.calories > 0 && (+value) > 0) {
      carb = +((((this.state.calories - ((+value)*4.1) - (this.state.fat*9.3))/4)).toFixed(2));
    }
    if (this.state.calories > 0 && (+value) > 0) {
      proteinPercent = +(((((+value) * 4.1)/this.state.calories)*100).toFixed(2));
    }
    if (this.state.calories > 0 && carb > 0) {
      carbPercent = +((100 - proteinPercent - this.state.fatPercent).toFixed(2));
    }
    if (carb > -0.01) {
      this.setState({
        protein: +value,
        carb: carb,
        proteinPercent: proteinPercent,
        carbPercent: carbPercent,
        ratio: +((this.state.fat/((+value) + carb)).toFixed(2))
      });
    }
  };
  onChangeFatPercent = (value) => {
    let carbPercent = +((100 - this.state.proteinPercent - (+value)).toFixed(2));
    if (carbPercent > -1) {
      let protein_in_gram = 0;
      let fat_in_gram = 0;
      let carb_in_gram = 0;
      if (this.state.calories > 0 && this.state.proteinPercent > 0) {
        protein_in_gram = +((((this.state.calories * this.state.proteinPercent / 100) / 4.1)).toFixed(2));
      }
      if (this.state.calories > 0 && (+value) > 0) {
        fat_in_gram = +((((this.state.calories * (+value) / 100) / 9.3)).toFixed(2));
      }
      if (this.state.calories > 0 && carbPercent > 0) {
        carb_in_gram = +((((this.state.calories * carbPercent / 100) / 4.1)).toFixed(2));
      }
      this.setState({
        fatPercent: +value,
        carbPercent: carbPercent,
        fat: fat_in_gram,
        protein: protein_in_gram,
        carb: carb_in_gram,
        ratio: +((fat_in_gram/(protein_in_gram+carb_in_gram)).toFixed(2))
      });
    }
  };
  onChangeFat = (value) => {
    let fatPercent = 0;
    let carbPercent = 0;
    let carb = 0;
    if (this.state.calories > 0 && (+value) > 0) {
      carb = +((((this.state.calories - (this.state.protein*4.1) - ((+value)*9.3))/4)).toFixed(2));
    }
    if (this.state.calories > 0 && (+value) > 0) {
      fatPercent = +(((((+value) * 9.3)/this.state.calories)*100).toFixed(2));
    }
    if (this.state.calories > 0 && carb > 0) {
      carbPercent = +((100 - this.state.proteinPercent - fatPercent).toFixed(2));
    }
    if (carb > -0.01) {
      this.setState({
        fat: +value,
        carb: carb,
        fatPercent: fatPercent,
        carbPercent: carbPercent,
        ratio: +(((+value)/(this.state.protein + carb)).toFixed(2))
      });
    }
  };
  // signInWithGoogleAsync = async () => {
  // // "expo-google-app-auth": "^8.1.3",
  //   try {
  //     const result = await Google.logInAsync({
  //       androidClientId: '917336913799-mrktimrtnfrqothn7rre1alhk5fatvu1.apps.googleusercontent.com',
  //       iosClientId: '917336913799-3oo4f718m6dq5r7q5db5j59k06vph2b8.apps.googleusercontent.com',
  //       scopes: ['profile', 'email'],
  //     });
  //
  //     if (result.type === 'success') {
  //       // console.warn(result.accessToken);
  //       // console.warn(result);
  //       GDrive.setAccessToken(accessToken);
  //       GDrive.init();
  //       console.warn(GDrive.isInitialized());
  //
  //       var fileContent = 'sample text'; // As a sample, upload a text file.
  //       var file = new Blob([fileContent], {type: 'text/plain'});
  //       var metadata = {
  //         'name': 'sampleName', // Filename at Google Drive
  //         'mimeType': 'text/plain' // mimeType at Google Drive
  //       };
  //       // fetch('https://www.googleapis.com/drive/v3/files?uploadType=multipart&fields=id', {
  //       //   method: 'POST',
  //       //   headers: {
  //       //     Authorization: 'Bearer '+ result.accessToken,
  //       //     Accept: 'application/json'
  //       //   },
  //       //   body: JSON.stringify({
  //       //     metadata: new Blob([JSON.stringify(metadata)], {type: 'application/json'}),
  //       //     file: file,
  //       //   }),
  //       // }).then(res => {console.warn(res)});
  //       return result.accessToken;
  //     } else {
  //       return { cancelled: true };
  //     }
  //   } catch (e) {
  //     return { error: true };
  //   }
  // }
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
                  <Text style={{fontSize: 19, color: 'black', alignSelf: 'center', marginRight: 15, marginTop: 20}}>{this.state.proteinPercent}%</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Text style={{
                    fontSize: 17,
                    color: 'grey',
                    alignSelf: 'center',
                    marginRight: 15,
                    marginTop: 20
                  }}>Fett</Text>
                  <Text style={{fontSize: 19, color: 'black', alignSelf: 'center', marginRight: 15, marginTop: 20}}>{this.state.fatPercent}
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
                  <Text style={{fontSize: 19, color: 'black', alignSelf: 'center', marginRight: 15, marginTop: 20}}>{this.state.carbPercent}
                    %</Text>
                </View>
                <TouchableOpacity onPress={this.editProfile} style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>Edit</Text>
                </TouchableOpacity>
              </View>
            }
            { this.state.editMode &&
              <View>
                <View style = {{flex: 1,flexDirection:'row'}}>
                  <TextInput
                      style={styles.textViewStyle}
                      value={'Name'}
                      editable={false}
                      textAlign={'center'}
                  />
                  <TextInput
                      style={styles.textInputStyle}
                      placeholder={'Name'}
                      value={this.state.name}
                      onChangeText={this.onChangeName}
                      keyboardType={'default'}
                  />

                </View>
                <View style = {{flexDirection:'row',justifyContent:'flex-start'}}>
                  <TextInput
                      style={styles.textViewStyle}
                      value={'KCal'}
                      editable={false}
                      textAlign={'center'}
                  />
                  <TextInput
                      style={styles.textInputStyle}
                      placeholder={'Kalorien pro Tag'}
                      value={this.state.calories.toString()}
                      onChangeText={this.onChangeCalories}
                      keyboardType={'decimal-pad'}
                  />

                </View>
                <View style={styles.getStartedContainer}>
                  <Text style={styles.getStartedText}>Verhältnis:</Text>
                </View>
                <View style = {{flexDirection:'row' }}>
                  <View
                      style={[styles.hiddenView1]}
                  />
                  <View
                      style={[styles.hiddenView2,{flexDirection:'row',alignItems: 'center',justifyContent:'center'}]}>
                    <View style={(this.state.percentMode)?styles.circle:styles.circleInvisible}>
                    </View>
                    <TouchableOpacity
                        style={(this.state.percentMode) ? styles.textViewStyleEnabled:styles.textViewStyleDisabled }
                        onPress={this.setPercentMode} >
                      <Text>   %Methode</Text>
                    </TouchableOpacity>
                  </View>
                  <View
                      style={[styles.hiddenView2,{flexDirection:'row',alignItems: 'center',justifyContent:'center'}]}>
                    <View style={(!this.state.percentMode)? styles.circle:styles.circleInvisible}>
                    </View>
                    <TouchableOpacity style={ (this.state.percentMode) ? styles.textViewStyleDisabled: styles.textViewStyleEnabled}
                                      onPress={this.setValueMode}>
                      <Text>Grammbedarf</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style = {{flexDirection:'row' }}>
                  <TextInput
                      style={styles.textViewStyle}
                      value={'Eiweiß'}
                      editable={false}
                      textAlign={'center'}
                  />
                  <TextInput
                      style={(this.state.percentMode)? styles.textInputStyle : styles.textInputStyleDisabled}
                      editable={this.state.percentMode}
                      placeholder={'Protein%'}
                      value={this.state.proteinPercent.toString()}
                      onChangeText={this.onChangeProteinPercent}
                      keyboardType={'decimal-pad'}
                  />
                  <TextInput
                      style={(!this.state.percentMode)? styles.textInputStyle : styles.textInputStyleDisabled}
                      editable={!this.state.percentMode}
                      placeholder={'Protein'}
                      value={this.state.protein.toString()}
                      onChangeText={this.onChangeProtein}
                      keyboardType={'decimal-pad'}
                  />
                </View>
                <View style = {{flexDirection:'row' }}>
                  <TextInput
                      style={styles.textViewStyle}
                      value={'Fett'}
                      editable={false}
                      textAlign={'center'}
                  />
                  <TextInput
                      style={(this.state.percentMode)? styles.textInputStyle : styles.textInputStyleDisabled}
                      placeholder={'Fat %'}
                      value={this.state.fatPercent.toString()}
                      onChangeText={this.onChangeFatPercent}
                      editable={this.state.percentMode}
                      keyboardType={'decimal-pad'}
                  />
                  <TextInput
                      style={(!this.state.percentMode)? styles.textInputStyle : styles.textInputStyleDisabled}
                      placeholder={''}
                      value={this.state.fat.toString()}
                      editable={!this.state.percentMode}
                      onChangeText={this.onChangeFat}
                      keyboardType={'decimal-pad'}
                  />
                </View>
                <View style = {{flexDirection:'row' }}>
                  <TextInput
                      style={styles.textViewStyle}
                      value={'KH'}
                      editable={false}
                      textAlign={'center'}
                  />
                  <TextInput
                      style={styles.textInputStyleDisabled}
                      placeholder={'Carbohydrate %'}
                      value={this.state.carbPercent.toString()}
                      editable={false}
                      keyboardType={'decimal-pad'}
                  />
                  <TextInput
                      style={styles.textInputStyleDisabled}
                      placeholder={'Carbohydrate'}
                      value={this.state.carb.toString()}
                      editable={false}
                      keyboardType={'decimal-pad'}
                  />
                </View>
                <View style = {{flexDirection:'row' }}>
                  <TextInput
                      style={styles.textViewStyle}
                      value={'Ratio'}
                      editable={false}
                      textAlign={'center'}
                  />
                  <TextInput
                      style={styles.textInputStyleDisabled}
                      placeholder={''}
                      value={this.state.ratio.toString()}
                      editable={false}
                      keyboardType={'decimal-pad'}
                  />
                </View>
                {this.state.error &&
                  <Text style={{color: 'red', alignSelf: 'center', marginTop: 10}}>Ungültig Verhältnis</Text>
                }
                <TouchableOpacity onPress={this.saveProfile} style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>Save</Text>
                </TouchableOpacity>
              </View>
            }
          </ScrollView>
        </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  hiddenView1: {
    width: 90,
    height:35,
    marginLeft: 5,
    borderColor: 'transparent', borderWidth: 0, margin: 5, padding: 4 },
  hiddenView2: {
    width:200,
    flex: 1,
    marginRight:5,
    height: 35,margin: 5, padding: 4 },
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
  circleInvisible: {
    marginTop:10,
    width:20,
    height:20,
    borderRadius:10,
    backgroundColor:'#fff'
  },
  circle: {
    marginTop:10,
    width:20,
    height:20,
    borderRadius:10,
    backgroundColor:'#5fd02d'
  },
  textViewStyleDisabled: {
    width: 110,
    height:30,
    marginLeft: 5,
    marginRight:10,
    backgroundColor:'#9c9a9a',
    justifyContent: 'center',
    borderColor: 'gray', borderWidth: 1, borderRadius: 4, margin: 5, padding: 4 },
  textViewStyleEnabled: {
    width: 110,
    height:30,
    marginLeft: 5,
    fontSize:17,
    marginRight:10,
    justifyContent: 'center',
    borderColor: 'gray', borderWidth: 1, borderRadius: 4, margin: 5, padding: 4 },
  textViewStyle: {
    width: 90,
    height:35,
    fontSize:17,
    marginLeft: 5,
    borderColor: 'gray', borderWidth: 1, borderRadius: 4, margin: 5, padding: 4 },
  textInputStyle: {
    width:200,
    flex: 1,
    fontSize:17,
    marginRight:5,
    height: 35, borderColor: 'gray', borderWidth: 1, borderRadius: 4, margin: 5, padding: 4 },
  textInputStyleDisabled: {
    width:200,
    flex: 1,
    fontSize:17,
    marginRight:5,
    backgroundColor:'#9c9a9a',
    height: 35, borderColor: 'gray', borderWidth: 1, borderRadius: 4, margin: 5, padding: 4 },
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
