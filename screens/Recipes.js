import * as React from 'react';
import {FlatList, Alert, Platform, StyleSheet, Text, TouchableOpacity, View, TextInput} from 'react-native';

import { MonoText } from '../components/StyledText';
import * as SQLite from 'expo-sqlite';
import {Ionicons} from "@expo/vector-icons";
import MealItem from "../components/MealItem";

const db = SQLite.openDatabase("keto_db.db");
export default class Recipes extends React.Component {
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
            this.getRecipesFromDb();
        });
    }

    getRecipesFromDb = () => {
        const array = [];
        db.transaction(tx => {
            tx.executeSql(
                `select * from recipe;`,
                null,
                (_, { rows: { _array } }) => {
                    _array = _array.reverse().concat(array)
                    this.setState({items: _array,
                        filteredItems:_array,
                        selectedItems:[]});
                }
            );
        });
    }

    backPress = () => {
        this.props.navigation.goBack();
    };
    addMeal = () => {
        this.props.navigation.navigate('Add Ingredients');
    };
    deleteMeal = () => {
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
                                "delete from recipe where id = "+this.state.selectedItems[0].id+";",
                                null,
                                ()=>{
                                    this.getRecipesFromDb();
                                }
                            );
                        });
                    } }
            ],
            { cancelable: false }
        );
    };
    setAmount = () => {
        if (this.state.selectedItems.length > 0) {
            const ingredients = JSON.parse(this.state.selectedItems[0].description);
            let count = 0;
            ingredients.forEach( meal => {
                db.transaction(
                    tx => {
                        tx.executeSql("insert into mealquantity (log_id, meal_type, meal_name, protein," +
                            "fat,carb,protein_percent,fat_percent,carb_percent,quantity,meal_id) values " +
                            "(" + this.props.route.params.logId + "," + this.props.route.params.mealType + ",'" +
                            meal.meal_name + "', " + meal.protein + "," + meal.fat
                            + "," + meal.carb + "," + meal.protein_percent + "," + meal.fat_percent + ","
                            + meal.carb_percent + "," + meal.quantity + ","+ meal.meal_id +");"
                            , null,
                            (_t,_r)=> console.log('Custom Meal Added', _r.insertId));
                    },
                    (_err)=>{console.warn('error',_err)},
                    () => {
                        count++;
                        if (count === ingredients.length) {
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
                selectedItems: [...[], item]
            })
        } else {
            var temp = [...this.state.selectedItems];
            temp.splice(temp.indexOf(temp.find(p=>p.id===item.id)),1);
            this.setState({selectedItems: temp});
        }
    };
    onChange = (value) => {
        var filteredItems = this.state.items.filter(p => p.name.toLowerCase().includes(value.toLowerCase()));
        this.setState({filteredItems:filteredItems, selectedItems:[]});
    };
    render () {
        return (
            <View style={styles.container}>
                <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
                    {this.state.selectedItems.length === 1 &&
                    <TouchableOpacity onPress={this.deleteMeal} style={{flexDirection: 'row', marginRight: 5}}>
                        <Ionicons name="md-trash" size={32} color="red"/>
                        <MonoText style={{color: 'red', marginLeft: 10, alignSelf: 'center'}}>Delete Meal</MonoText>
                    </TouchableOpacity>
                    }
                </View>
                <TextInput
                    style={styles.textInputStyle}
                    placeholder={'Search'}
                    onChangeText={this.onChange}
                    keyboardType={'default'}

                />
                {
                    this.state.filteredItems.length > 0 &&
                    <FlatList
                        keyExtractor={(item) => item.id.toString() }
                        data={this.state.filteredItems}
                        renderItem={({ item }) => <MealItem
                            onItemSelected={this.onItemSelected}
                            selected={this.state.selectedItems.filter(p=>p.id === item.id).length === 1}
                            item={item}/>}
                    />
                }
                {
                    this.state.filteredItems.length === 0 &&
                    <View style={{backgroundColor: '#d0cfcf'}}>
                        <View style={{flexDirection:'row', alignSelf: 'center'}}>
                            <Ionicons style={{alignSelf: 'center'}} name="md-information-circle" size={32} color="red" />
                            <MonoText style={{color:'red',marginLeft: 10, alignSelf:'center'}}>No Values</MonoText>
                        </View>
                    </View>
                }
                {
                    this.state.filteredItems.length > 0 &&
                    <TouchableOpacity onPress={this.setAmount} style={styles.buttonStyle}>
                        <Text style={styles.buttonTextStyle}>Save</Text>
                    </TouchableOpacity>
                }
            </View>
        );
    }
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
