import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image, Alert, TextInput} from 'react-native';
import { Button, Platform} from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Modal, TouchableHighlight } from 'react-native';
// import * as Progress from 'react-native-progress';
import * as Progress from 'react-native-progress';
import MealComponent from "../components/MealComponent";
import Enums from '../constants/Enums';
import * as SQLite from 'expo-sqlite';
import * as SecureStore from "expo-secure-store";
import InitialData from "../constants/InitialData";
import * as WebBrowser from "expo-web-browser";

const db = SQLite.openDatabase("keto_db.db");
const months = ["01", "02", "03","04", "05", "06", "07", "08", "09", "10", "11", "12"];
export default class LinksScreen extends React.Component {
  constructor () {
    super();
    this.state = {
      date: new Date(),
      mode: 'date',
      show: false,
      items: [],
      proteinTarget: 1.0,
      proteinToday: 0.0,
      fatTarget: 1.0,
      fatToday: 0.0,
      carbTarget: 1.0,
      carbToday: 0.0,
      caloriesTarget: 1.0,
      caloriesToday: 0.0,
      protein: 0,
      fat: 0,
      carb: 0,
      modalOpen: false,
      legalModalOpen: false,
      mealName:'',
      meals:[],
    };
  }
  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      // do something
      this.getUserPreferences();
      this.getDailyLogs();
    });
  }
  goToWebAddress = () => {
    WebBrowser.openBrowserAsync('http://glut1.de/');
  }
  onAcceptModal = () => {
    this.setState({legalModalOpen: false});
    SecureStore.setItemAsync('initialLaunch', 'true');
  }
  getUserPreferences = () => {
    SecureStore.getItemAsync('initialLaunch').then(result => {
      if (!result) {
        this.setState({legalModalOpen: true});
      }
    });
    var target_protein_in_gram = 1;
    var target_fat_in_gram = 1;
    var target_carb_in_gram = 1;
    SecureStore.getItemAsync('user_calories').then(user_calories => {
      SecureStore.getItemAsync('user_protein').then(user_protein => {
        SecureStore.getItemAsync('user_fat').then(user_fat => {
          SecureStore.getItemAsync('user_carb').then(user_carb => {
            if (user_calories && user_carb && user_fat && user_protein) {
              if (user_calories > 0 && user_protein > 0) {
                target_protein_in_gram = ((user_calories * user_protein / 100) / 4.1).toFixed(2);
              }
              if (user_calories > 0 && user_fat > 0) {
                target_fat_in_gram = ((user_calories * user_fat / 100) / 9.3).toFixed(2);
              }
              if (user_calories > 0 && user_carb > 0) {
                target_carb_in_gram = ((user_calories * user_carb / 100) / 4.1).toFixed(2);
              }
              this.setState({
                proteinTarget: target_protein_in_gram,
                fatTarget: target_fat_in_gram,
                carbTarget: target_carb_in_gram,
                caloriesTarget: user_calories,
                protein: user_protein,
                fat: user_fat,
                carb: user_carb
              });
            }
          });
        });
      });
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }
  getMealQuantities = (logId) => {
    db.transaction(tx => {
      tx.executeSql(
          `select * from mealquantity where log_id = ?;`,
          [logId],
          (_, { rows: { _array } }) => {
            if (_array.length > 0) {
              var proteinToday = 0;
              var fatToday = 0;
              var carbToday = 0;
              var caloriesToday = 0;
              _array.forEach(item => {
                proteinToday = proteinToday + item.protein;
                carbToday = carbToday + item.carb;
                fatToday = fatToday + item.fat;
              });
              caloriesToday = (proteinToday * 4.1) + (carbToday * 4.1) + (fatToday * 9.3);
              this.setState({items: _array,
                proteinToday: proteinToday,
                carbToday: carbToday,
                caloriesToday:caloriesToday,
                fatToday: fatToday});
            } else {
              this.setState({items: [],
                proteinToday: 0,
                carbToday: 0,
                fatToday: 0,
                caloriesToday: 0});
            }
          }
      );
    });
  }
  getDailyLogs = (date = this.state.date) => {
    var result;
    const formatted_date = date.getDate() + "-" + months[date.getMonth()] + "-" + date.getFullYear();
    db.transaction(tx => {
      tx.executeSql(
          `select * from dailylogs where date = ?;`,
          [formatted_date],
          (_, { rows: { _array } }) => {
            if (_array.length > 0) {
              this.getMealQuantities(_array[0].id);
            } else {
              this.setState({items: [],
                proteinToday: 0,
                carbToday: 0,
                caloriesToday: 0,
                fatToday: 0});
            }
          }
      );
    });
  }
  // private _closeDialog = (): void => {
  onChange = (event, selectedDate) => {
    if(selectedDate) {
      this.setState({
        show: false,
        date: selectedDate
      });
      this.getDailyLogs(selectedDate);
    }
  };
  showMode = (currentMode) => {
    this.setState({
      show: true,
      mode: currentMode
    })
  };

  showDatepicker = () => {
    this.showMode('date');
    // db.transaction(tx => {
    //   tx.executeSql(
    //       `select * from mealquantity;`,
    //       null,
    //       (_, { rows: { _array } }) => console.warn(_array)
    //   );
    // });
    // db.transaction(
    //     tx => {
    //       tx.executeSql("insert into meals (protein, fat,carb,name) values (12.4,21,5.5, 'channay')", null);
    //       // tx.executeSql("insert into meals (protein, fat,carb,name) values (12,11,5, 'channay2')", null);
    //     }
    // );
  };

  checkLogs = (meal, isMeal) => {
    // this.props.navigation.navigate('Ingredients', {mealType:meal, date: this.state.date});
    const formatted_date = this.state.date.getDate() + "-" + months[this.state.date.getMonth()] + "-" + this.state.date.getFullYear();
    db.transaction(tx => {
      tx.executeSql(
          `select * from dailylogs where date = ?;`,
          [formatted_date],
          (_, { rows: { _array } }) => {
            if (_array.length > 0) {
              if (isMeal) {
                this.gotoMeals(meal, _array[0].id)
              } else {
                this.gotoIngredients(meal, _array[0].id)
              }
            } else {
              this.insertLogAndNavigate(meal, isMeal);
            }
          }
      );
    });
  };
  insertLogAndNavigate = (meal, isMeal) => {
    const formatted_date = this.state.date.getDate() + "-" + months[this.state.date.getMonth()] + "-" + this.state.date.getFullYear();
    db.transaction(
        tx => {
          tx.executeSql("insert into dailylogs (date) values " +
              "('" + formatted_date + "');", null, (_t,_r)=> {
                if (isMeal) {
                  this.gotoMeals(meal,_r.insertId);
                } else {
                  this.gotoIngredients(meal,_r.insertId);
                }
              });
        },
        (_err)=>{console.warn('error',_err)},
        () => {
        }
    );
  }
  gotoMeals = (meal, logId) => {
    this.props.navigation.navigate('Recipes', {mealType:meal, logId: logId,
      proteinPercent: this.state.proteinToday,
      fatPercent: this.state.fatToday,
      carbPercent: this.state.carbToday,
    });
  }
  gotoIngredients = (meal, logId) => {
    this.props.navigation.navigate('Ingredients', {mealType:meal, logId: logId,
      proteinPercent: this.state.proteinToday,
      fatPercent: this.state.fatToday,
      carbPercent: this.state.carbToday,
    });
  }
  clearData = (items) => {
    Alert.alert(
        "Clear Selected Items",
        "Are you sure?",
        [
          {
            text: "Cancel",
            onPress: () => {
            },
            style: "cancel"
          },
          { text: "OK", onPress: () => {
              this.deleteSection(items);
            }
          }
        ],
        { cancelable: false }
    );
  }
  deleteSection = (items) => {
    var idsString = '(';
    items.forEach(item => {
      idsString = idsString.concat(item.id+',');
    })
    idsString = idsString.slice(0, -1)+')';
    db.transaction(tx => {
      tx.executeSql(
          "delete from mealquantity where id in " + idsString + ";",
          null,
          ()=>{
            this.getDailyLogs();
          }
      );
    });
  }
  saveIngradientsAsMeal = (items) => {
    this.setState({meals: items});
    this.openMealNameDialog();
  }
  onChangeMealName = (value) => {
    this.setState({
      mealName:value
    });
  }
  onSaveMealName = () => {
    if (this.state.mealName.length < 1)
      return;
    let mealObject = {name: this.state.mealName, description: 'null', protein:0, fat:0, carb:0,quantity:0};
    this.state.meals.forEach(meal => {
      mealObject.fat = mealObject.fat + meal.fat;
      mealObject.carb = mealObject.carb + meal.carb;
      mealObject.protein = mealObject.protein + meal.protein;
      mealObject.quantity = mealObject.quantity + meal.quantity;
    });
    db.transaction(
        tx => {
          tx.executeSql("insert into recipe (protein, fat, carb, quantity, name," +
              "description) values " +
              "(" + mealObject.protein + "," + mealObject.fat + "," +
              mealObject.carb +"," + mealObject.quantity + ", '" + mealObject.name + "'," + "'"
              +JSON.stringify(this.state.meals)+ "'"  +");", null,
              (_t,_r)=> {});
        },
        (_err)=>{console.warn('error',_err)},
        () => {
          this.showSuccessAndResetState();
        }
    );
  }
  showSuccessAndResetState  = () => {
    Alert.alert(
        "Success",
        "Meal added successfully",
        [
          {
            text: "Ok",
            onPress: () => {
              this.setState({modalOpen:!this.state.modalOpen, meals:[], mealName:''});
            },
          }
        ],
        { cancelable: false }
    );
  }
  onCancelModal  = () => {
    this.setState({modalOpen:!this.state.modalOpen, meals:[], mealName:''});
  }
  openMealNameDialog = () => {
    this.setState({modalOpen: true});
  }
  onQuantityChange = (item, value) => {
    let ingredientItem = {...item};
    ingredientItem.carb = +((ingredientItem.carb_percent * value).toFixed(3));
    ingredientItem.protein = +((ingredientItem.protein_percent * value).toFixed(3));
    ingredientItem.fat = +((ingredientItem.fat_percent * value).toFixed(3));
    ingredientItem.quantity = value;
    db.transaction(
        tx => {
          tx.executeSql("UPDATE mealquantity " +
              "SET protein = "+ingredientItem.protein+"," +
              " fat = "+ingredientItem.fat+"," +
              " carb = "+ingredientItem.carb+"," +
              " quantity = "+ingredientItem.quantity+
              " WHERE" +
              " id = "+item.id+";", null,
              (_t,_r)=> console.log('kkkk', _r.insertId));
        },
        (_err)=>{console.warn('DB Error',_err)},
        () => {
          this.getDailyLogs();
        }
    );

    let tempState = [...this.state.items];
    tempState.filter(p => p.id === item.id)[0].quantity = value;
    this.setState({items: tempState});
  }
  render () {
    let ratio = -1;
    if (this.state.fatToday && this.state.proteinToday && this.state.carbToday) {
      ratio = (this.state.fatToday/(this.state.proteinToday + this.state.carbToday)).toFixed(2);
    }
    return (
        <ScrollView style={(this.state.modalOpen)?styles.containerDark:styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.getStartedContainer}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.legalModalOpen}
                onRequestClose={() => {
                }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText2}>You have read the website information and aware of all risks
                    and we will not be held responsible if the user is using it wrong and harming himself.</Text>
                  <View style={{height:1, backgroundColor:'#aaaaaa'}}/>

                  <TouchableOpacity onPress={this.goToWebAddress}>
                    <Text style={{fontSize:14, color:'#0079FF',marginBottom:10}}>Terms and Privacy Policy</Text>
                  </TouchableOpacity>
                  <View style={{flexDirection:'row'}}>
                    <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: '#2196F3',marginLeft: 5,marginTop:10 }}
                        onPress={this.onAcceptModal}>
                      <Text style={styles.textStyle}>Accept</Text>
                    </TouchableHighlight>
                  </View>

                </View>
              </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalOpen}
                onRequestClose={() => {
                }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Please enter meal name</Text>
                  <TextInput
                      style={styles.textInputStyle}
                      placeholder={'Name'}
                      onChangeText={this.onChangeMealName}
                      value={this.state.mealName}
                  />


                  <View style={{flexDirection:'row'}}>
                    <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: '#e02e2e', marginRight: 5 }}
                        onPress={this.onCancelModal}>
                      <Text style={styles.textStyle}>Cancel</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={{ ...styles.openButton, backgroundColor: '#2196F3',marginLeft: 5 }}
                        onPress={this.onSaveMealName}>
                      <Text style={styles.textStyle}>Save</Text>
                    </TouchableHighlight>
                  </View>

                </View>
              </View>
            </Modal>

            <TouchableOpacity onPress={this.showDatepicker}>
              <Image
                  source={require('../assets/images/calendar.png')
                  }
                  style={styles.imageStyle}
              />
            </TouchableOpacity>

            {/*<Text style={styles.getStartedText}>Set Date:</Text>*/}
            <TouchableOpacity onPress={this.showDatepicker}>
              <Text style={styles.dateStyle}>{this.state.date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {(ratio!== -1)?<Text style={styles.getStartedText}>Ratio:</Text>:null}
            {(ratio!== -1)?<Text style={styles.ratioStyle}>{ratio}</Text>:null}
          </View>
          {this.state.show && (
              <DateTimePicker
                  testID="dateTimePicker"
                  value={this.state.date}
                  mode={this.state.mode}
                  display="default"
                  onChange={this.onChange}
              />
          )}
          <View style={styles.progressContainerWithBackground}>
            <View style={styles.progressBarContainer} >
              <View style={{marginBottom:5}}>
                <Progress.Bar progress={this.state.caloriesToday/this.state.caloriesTarget} width={null} height={10} color={'#2c9aee'} />
              </View>
              <View style={styles.progressTextContainer}>
                <Text style={styles.progressTextLeft}>Kalorien</Text>
                {((this.state.caloriesToday/this.state.caloriesTarget) <= 1) &&
                <Text style={styles.progressTextRight}>{parseFloat(this.state.caloriesToday.toString()).toFixed(2)}/{this.state.caloriesTarget}</Text>
                }
                {((this.state.caloriesToday/this.state.caloriesTarget) > 1) &&
                <Text style={styles.progressTextRightDanger}>{parseFloat(this.state.caloriesToday.toString()).toFixed(2)}/{this.state.caloriesTarget}</Text>
                }
              </View>
            </View>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBarContainer} >
              <View style={{marginBottom:5}}>
                <Progress.Bar progress={this.state.proteinToday/this.state.proteinTarget} width={null} height={10} color={'#f37f4a'} />
              </View>
              <View style={styles.progressTextContainer}>
                <Text style={styles.progressTextLeft}>Eiweiß {'('+this.state.protein + '%)'}</Text>
                {((this.state.proteinToday/this.state.proteinTarget) <= 1) &&
                  <Text style={styles.progressTextRight}>{parseFloat(this.state.proteinToday.toString()).toFixed(2)}/{this.state.proteinTarget}g</Text>
                }
                {((this.state.proteinToday/this.state.proteinTarget) > 1) &&
                  <Text style={styles.progressTextRightOrange}>{parseFloat(this.state.proteinToday.toString()).toFixed(2)}/{this.state.proteinTarget}g</Text>
                }
              </View>

            </View>
            <View style={styles.progressBarContainer} >
              <View style={{marginBottom:5}}>
                <Progress.Bar progress={this.state.fatToday/this.state.fatTarget} width={null} height={10} color={'#933dde'} />
              </View>
              <View style={styles.progressTextContainer}>
                <Text style={styles.progressTextLeft}>Fett {'('+this.state.fat + '%)'}</Text>
                {((this.state.fatToday/this.state.fatTarget) <= 1) &&
                  <Text style={styles.progressTextRight}>{parseFloat(this.state.fatToday.toString()).toFixed(2)}/{this.state.fatTarget}g</Text>
                }
                {((this.state.fatToday/this.state.fatTarget) > 1) &&
                  <Text style={styles.progressTextRightGreen}>{parseFloat(this.state.fatToday.toString()).toFixed(2)}/{this.state.fatTarget}g</Text>
                }
              </View>
            </View>
            <View style={styles.progressBarContainer} >
              <View style={{marginBottom:5}}>
                <Progress.Bar progress={this.state.carbToday/this.state.carbTarget} width={null} height={10} color={'#3b3a39'} />
              </View>
              <View style={styles.progressTextContainer}>
                <Text style={styles.progressTextLeft}>Kohlenhydrate {'('+this.state.carb + '%)'}</Text>
                {((this.state.carbToday/this.state.carbTarget) <= 1) &&
                  <Text style={styles.progressTextRight}>{parseFloat(this.state.carbToday.toString()).toFixed(2)}/{this.state.carbTarget}g</Text>
                }
                {((this.state.carbToday/this.state.carbTarget) > 1) &&
                  <Text style={styles.progressTextRightDanger}>{parseFloat(this.state.carbToday.toString()).toFixed(2)}/{this.state.carbTarget}g</Text>
                }
              </View>
            </View>
          </View>
          <View style={{height:1, backgroundColor:'#5f5f5f', marginTop:10}}/>
          <MealComponent
              fatTarget = {this.state.fatTarget}
              proteinTarget = {this.state.proteinTarget}
              carbTarget = {this.state.carbTarget}
              callBackAdd = {this.checkLogs}
              mealText={'Frühstück'}
              onQuantityChange={this.onQuantityChange}
              callBackClear = {this.clearData}
              callBackAddMeal = {this.saveIngradientsAsMeal}
              mealType={Enums.breakFast}
              mealQuantities={this.state.items.filter(p => p.meal_type === Enums.breakFast)}
              imageSrc={require('../assets/images/mug.png')}/>
          <MealComponent
              fatTarget = {this.state.fatTarget}
              proteinTarget = {this.state.proteinTarget}
              carbTarget = {this.state.carbTarget}
              callBackAdd = {this.checkLogs}
              onQuantityChange={this.onQuantityChange}
              mealType={Enums.snack_one}
              callBackAddMeal = {this.saveIngradientsAsMeal}
              callBackClear = {this.clearData}
              mealText={'Snack'}
              mealQuantities={this.state.items.filter(p => p.meal_type === Enums.snack_one)}
              imageSrc={require('../assets/images/pop-corn.png')}/>
          <MealComponent
              fatTarget = {this.state.fatTarget}
              proteinTarget = {this.state.proteinTarget}
              carbTarget = {this.state.carbTarget}
              callBackAdd = {this.checkLogs}
              callBackAddMeal = {this.saveIngradientsAsMeal}
              onQuantityChange={this.onQuantityChange}
              mealType={Enums.lunch}
              callBackClear = {this.clearData}
              mealText={'Mittagessen'}
              mealQuantities={this.state.items.filter(p => p.meal_type === Enums.lunch)}
              imageSrc={require('../assets/images/meat.png')}/>
          <MealComponent
              fatTarget = {this.state.fatTarget}
              proteinTarget = {this.state.proteinTarget}
              carbTarget = {this.state.carbTarget}
              callBackAdd = {this.checkLogs}
              callBackAddMeal = {this.saveIngradientsAsMeal}
              mealType={Enums.snack_two}
              onQuantityChange={this.onQuantityChange}
              callBackClear = {this.clearData}
              mealText={'Snack'}
              mealQuantities={this.state.items.filter(p => p.meal_type === Enums.snack_two)}
              imageSrc={require('../assets/images/pop-corn.png')}/>
          <MealComponent
              fatTarget = {this.state.fatTarget}
              proteinTarget = {this.state.proteinTarget}
              carbTarget = {this.state.carbTarget}
              callBackAdd = {this.checkLogs}
              callBackAddMeal = {this.saveIngradientsAsMeal}
              onQuantityChange={this.onQuantityChange}
              mealType={Enums.dinner}
              callBackClear = {this.clearData}
              mealText={'Abendessen'}
              mealQuantities={this.state.items.filter(p => p.meal_type === Enums.dinner)}
              imageSrc={require('../assets/images/dinner.png')}/>
          {/*<Progress.Bar progress={0.3} width={200}  color={['12', '12', '12']} />*/}
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
  progressContainerWithBackground: {
    paddingTop: 10,
    marginTop:20,
    marginStart:10,
    marginEnd: 10,
    borderRadius: 4,
    flexDirection: 'column',
    borderColor: '#a09c9c',
    backgroundColor: '#d5d5d5',
    borderWidth: 1,
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
    color:'#3e3e3e'
  },
  progressTextRightDanger: {
    fontSize:12,
    color:'#ee2c2c'
  },
  progressTextRightOrange: {
    fontSize:12,
    color:'#f37f4a'
  },
  progressTextRightGreen: {
    fontSize:12,
    color:'#30ba4d'
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
  textInputStyle: {
    width:200,
    height: 35, borderColor: 'gray', borderWidth: 1, borderRadius: 4,marginBottom:10,padding:5},
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
  containerDark: {
    flex: 1,
    backgroundColor: 'rgba(5,5,5,0.16)',
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
  imageStyle: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: 70,
  },
  ratioStyle : {
    padding: 2,
    fontSize: 17,
    color: 'rgb(19,19,19)',
    lineHeight: 35,
    textAlign: 'center'
  },
  getStartedText: {
    padding: 2,
    fontSize: 14,
    color: 'rgb(96,100,109)',
    lineHeight: 35,
    textAlign: 'center',
    marginLeft: 40
  },
  getStartedContainer: {
    alignItems: 'stretch',
    flexDirection: 'row'
  },
  dateStyle: {
    fontSize: 23,
    color: 'rgb(18,19,19)',
    lineHeight: 35,
    marginLeft: 40,
    textAlign: 'right',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText2: {
    marginBottom: 5,
    textAlign: 'center',
  },
  openButton: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width:80
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  }
});
