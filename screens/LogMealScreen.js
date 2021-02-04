import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import {FlatList, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import * as SQLite from 'expo-sqlite';
import MealLogItem from "../components/MealLogItem";
import {Ionicons} from "@expo/vector-icons";
var db = null;
export default class LogMealScreen extends React.Component {
    constructor () {
        super();
        this.state = {
            error:false,
            values:{}
        };
    }
    componentDidMount() {
        SQLite.openDatabase("keto_db.db","1.0",undefined,undefined,(database)=>{
            db = database;
        });
        const items = this.props.route.params.selectedItems;
        let tempObj = {};
        for (let i=0; i < items.length; i++) {
            tempObj[items[i].id+''] = 0;
        }
        this.setState({values: tempObj});
        this.props.navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={this.onSave}>
                    <Text style={{color:'#007AFF', fontSize:17, marginRight:15}}>Save</Text>
                </TouchableOpacity>
            ),
        });
    }

    backPress = () => {
        this.props.navigation.goBack();
    };
    onChangeProtein = (value) => {
        this.setState({
            protein:+value
        })
    };
    onChangeFat = (value) => {
        this.setState({
            fat:+value
        })
    };
    onChangeCarb = (value) => {
        this.setState({
            carb:+value
        })
    };
    onChangeName = (value) => {
        this.setState({
            name:value
        })
    };
    validate = () =>  {
        const keys = Object.keys(this.state.values);
        for (let i=0; i < keys.length; i++) {
            if (this.state.values[keys[i]] === 0) {
                return false;
            }
        }
        return true;
    };
    onSave = () => {
        if (this.validate()) {
            let resultMeals = [];
            this.setState({error:false});
            const keys = Object.keys(this.state.values);
            for (let i=0; i < keys.length; i++) {
                let meal = {...this.props.route.params.selectedItems.find(p => p.id === (+keys[i]))};
                meal.carb = +((meal.carb * this.state.values[keys[i]]/100).toFixed(3));
                meal.protein = +((meal.protein * this.state.values[keys[i]]/100).toFixed(3));
                meal.fat = +((meal.fat * this.state.values[keys[i]]/100).toFixed(3));
                meal.quantity = this.state.values[keys[i]];
                meal.meal_id = (+keys[i]);
                resultMeals.push(meal);
            }
            resultMeals.forEach( meal => {
                db.transaction(
                    tx => {
                        tx.executeSql("insert into mealquantity (log_id, meal_type, meal_name, protein," +
                            "fat,carb,quantity,meal_id) values " +
                            "(" + this.props.route.params.logId + "," + this.props.route.params.mealType + ",'" +
                            meal.name + "', " + meal.protein + "," + meal.fat
                            + "," + meal.carb + "," + meal.quantity + ","+ meal.meal_id +");", null,
                            (_t,_r)=> {});
                    },
                    (_err)=>{console.warn('error',_err)},
                    () => {
                    }
                );
            });
            this.props.navigation.navigate('Root');


        } else {
            this.setState({error:true});
        }
    };
    onChangeValue = (value, id) => {
        console.log(value,id);
        let temp = {...this.state.values};
        temp[id+''] = value;
        this.setState({values: temp});
    };
    render () {
        return (
            <View style={styles.container}>
                <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
                    <TouchableOpacity onPress={this.addMeal} style={{flexDirection: 'row'}}>
                        <Ionicons name="md-information-circle" size={32} color="#007AFF" />
                        <Text style={{color:'#007AFF',marginLeft: 10, alignSelf:'center'}}>Eiweiß Verbraucht</Text>
                        <Text style={{color: '#007AFF', marginLeft: 10, alignSelf: 'center',fontWeight:'bold'}}>{(this.props.route.params.proteinPercent).toFixed(1)}g</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
                    <TouchableOpacity onPress={this.addMeal} style={{flexDirection: 'row'}}>
                        <Ionicons name="md-information-circle" size={32} color="#007AFF" />
                        <Text style={{color:'#007AFF',marginLeft: 10, alignSelf:'center'}}>Fett Verbraucht</Text>
                        <Text style={{color: '#007AFF', marginLeft: 10, alignSelf: 'center',fontWeight:'bold'}}>{(this.props.route.params.fatPercent).toFixed(1)}g</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
                    <TouchableOpacity onPress={this.addMeal} style={{flexDirection: 'row'}}>
                        <Ionicons name="md-information-circle" size={32} color="#007AFF" />
                        <Text style={{color:'#007AFF',marginLeft: 10, alignSelf:'center'}}>Kohlehydrate Verbraucht</Text>
                        <Text style={{color: '#007AFF', marginLeft: 10, alignSelf: 'center',fontWeight:'bold'}}>{(this.props.route.params.carbPercent).toFixed(1)}g</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    keyExtractor={(item) => item.id.toString() }
                    data={this.props.route.params.selectedItems}
                    renderItem={({ item }) => <MealLogItem
                        onValueChange={this.onChangeValue}
                        item={item}/>}
                />

                { this.state.error && (
                    <Text style={styles.codeHighlightText}>Some values are missing. Please fill them out and try to save again</Text>)
                }
            </View>
        );
    }
}

function Separator() {
    return <View style={styles.separator} />;
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
    homeScreenFilename: {
        marginVertical: 0,
    },
    codeHighlightText: {
        color: 'rgba(238,17,17,0.8)',
        margin:5,
        textAlign:'center'
    },
    codeHighlightContainer: {
        flexDirection:'row',
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
    separator: {
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    textInputStyle: { height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 4, margin: 5, padding: 4 }
});
