import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import {FlatList, Alert, Platform, StyleSheet, Text, TouchableOpacity, View, TextInput} from 'react-native';
import {RectButton, ScrollView} from 'react-native-gesture-handler';

import { MonoText } from '../components/StyledText';
import * as SQLite from 'expo-sqlite';
import {Ionicons} from "@expo/vector-icons";
import MealItem from "../components/MealItem";
import InitialData from "../constants/InitialData";

var db = null;
export default class Ingredients extends React.Component {
    constructor () {
        super();
        this.state = {
            items: [],
            filteredItems: [],
            selectedItems: []
        };
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            // do something
            SQLite.openDatabase("keto_db.db","1.0",undefined,undefined,(database)=>{
                db = database;
                this.getMealsFromDb();
            });
        });
    }

    getMealsFromDb = () => {
        var dataId = 9000;
        const array = JSON.parse(new InitialData().getData());
        array.forEach(item => {
            item['id'] = dataId;
            dataId++;
        });
        db.transaction(tx => {
            tx.executeSql(
                `select * from meals;`,
                null,
                (_, { rows: { _array } }) => {
                    _array = _array.reverse().concat(array);
                    this.setState({items: _array,
                    filteredItems:_array,
                    selectedItems:[]});
                }
            );
        });
    };

    backPress = () => {
        this.props.navigation.goBack();

    };
    addMeal = () => {
        this.props.navigation.navigate('Add Ingredients');
    };
    deleteMeal = () => {
        if (this.state.selectedItems[0].id > 8999) {
            Alert.alert(
                "Anfangsdaten können nicht gelöscht werden",
                null,
                [
                    {
                        text: "Ok",
                        onPress: () => {
                        },
                        style: "cancel"
                    }
                ],
                { cancelable: true }
            );
        } else {
            Alert.alert(
                "Delete "+ this.state.selectedItems[0].name,
                "Are you sure?",
                [
                    {
                        text: "Cancel",
                        onPress: () => {
                        },
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => {
                            db.transaction(tx => {
                                tx.executeSql(
                                    "delete from meals where id = "+this.state.selectedItems[0].id+";",
                                    null,
                                    ()=>{
                                        this.getMealsFromDb();
                                    }
                                );
                            });
                        } }
                ],
                { cancelable: false }
            );
        }
    };
    setAmount = () => {
        if (this.state.selectedItems.length > 0) {
            let resultMeals = [];
            for (let i=0; i < this.state.selectedItems.length; i++) {
                let meal = {...this.state.selectedItems[i]};
                meal.carb_percent = meal.carb/100;
                meal.protein_percent = meal.protein/100;
                meal.fat_percent = meal.fat/100;
                meal.carb = 0;
                meal.protein = 0;
                meal.fat = 0;
                meal.quantity = 0;
                meal.meal_id = meal.id;
                resultMeals.push(meal);
            }
            let count = 0;
            resultMeals.forEach( meal => {
                db.transaction(
                    tx => {
                        tx.executeSql("insert into mealquantity (log_id, meal_type, meal_name, protein," +
                            "fat,carb,protein_percent,fat_percent,carb_percent,quantity,meal_id) values " +
                            "(" + this.props.route.params.logId + "," + this.props.route.params.mealType + ",'" +
                            meal.name + "', " + meal.protein + "," + meal.fat
                            + "," + meal.carb + "," + meal.protein_percent + "," + meal.fat_percent + "," + meal.carb_percent
                            + "," + meal.quantity + ","+ meal.meal_id +");", null,
                            (_t,_r)=> console.log('kkkk', _r.insertId));
                    },
                    (_err)=>{console.warn('error',_err)},
                    () => {
                        count++;
                        if (count === resultMeals.length) {
                            this.props.navigation.navigate('Root');
                        }
                    }
                );
            });
        }
    };
    onItemSelected = (selected, item) => {
        if (selected) {
            this.setState({
                selectedItems: [...this.state.selectedItems, item]
            })
        } else {
            var temp = [...this.state.selectedItems];
            temp.splice(temp.indexOf(temp.find(p=>p.id===item.id)),1);
            this.setState({selectedItems: temp});
        }
    };
    onChange = (value) => {
        var filteredItems = this.state.items.filter(p => p.name.toLowerCase().includes(value.toLowerCase()) ||
            p.group_name.toLowerCase().includes(value.toLowerCase()));
        this.setState({filteredItems:filteredItems, selectedItems:[]});
    };
    render () {
        return (
            <View style={styles.container}>
                <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
                    <TouchableOpacity onPress={this.addMeal} style={{flexDirection: 'row'}}>
                        <Ionicons name="md-add-circle" size={32} color="#007AFF" />
                        <MonoText style={{color:'#007AFF',marginLeft: 10, alignSelf:'center'}}>Add Ingredient</MonoText>
                    </TouchableOpacity>
                    {this.state.selectedItems.length === 1 &&
                        <TouchableOpacity onPress={this.deleteMeal} style={{flexDirection: 'row', marginRight: 5}}>
                            <Ionicons name="md-trash" size={32} color="red"/>
                            <MonoText style={{color: 'red', marginLeft: 10, alignSelf: 'center'}}>Delete</MonoText>
                        </TouchableOpacity>
                    }
                </View>
                <TextInput
                    style={styles.textInputStyle}
                    placeholder={'Search'}
                    onChangeText={this.onChange}
                    keyboardType={'default'}

                />
                    <FlatList
                        keyExtractor={(item) => item.id.toString() }
                        data={this.state.filteredItems}
                        renderItem={({ item }) => <MealItem
                            onItemSelected={this.onItemSelected}
                            selected={this.state.selectedItems.filter(p=>p.id === item.id).length === 1}
                            item={item}/>}
                    />
                    <TouchableOpacity onPress={this.setAmount} style={styles.buttonStyle}>
                        <Text style={styles.buttonTextStyle}>Save</Text>
                    </TouchableOpacity>
            </View>
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
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50,
    },
    codeHighlightText: {
        color: 'rgba(96,100,109, 0.8)',
    },
    codeHighlightContainer: {
        flexDirection:'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 3,
        paddingHorizontal: 4,
    },
    homeScreenFilename: {
        marginVertical: 7,
    },
    getStartedText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        lineHeight: 24,
        textAlign: 'center',
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
    buttonStyle: {
        backgroundColor: '#007AFF',
        width:170,
        alignSelf: 'center',
        alignItems: 'center',
        padding:13,
        borderRadius: 10,
        marginBottom:30
    },
    buttonTextStyle: {
        color:'#fff',
        fontSize: 15,
    },
    textInputStyle: { height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 4, margin: 5, padding: 4 }
});
