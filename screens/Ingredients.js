import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { FlatList,Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {RectButton, ScrollView} from 'react-native-gesture-handler';

import { MonoText } from '../components/StyledText';
import * as SQLite from 'expo-sqlite';
import {Ionicons} from "@expo/vector-icons";
import MealItem from "../components/MealItem";

const db = SQLite.openDatabase("db.db");
export default class Ingredients extends React.Component {
    constructor () {
        super();
        this.state = {
            items: [],
            selectedItems: []
        };
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            // do something
            this.getMealsFromDb();
        });
    }

    getMealsFromDb = () => {
        db.transaction(tx => {
            tx.executeSql(
                `select * from meals;`,
                null,
                (_, { rows: { _array } }) => this.setState({items: _array,
                    selectedItems:[]})
            );
        });
    }

    backPress = () => {
        // db.transaction(tx => {
        //     tx.executeSql(
        //         `select * from meals;`,
        //         null,
        //         (_, { rows: { _array } }) => console.warn(JSON.stringify(_array))
        //     );
        // });
        this.props.navigation.goBack();

    };
    addMeal = () => {
        this.props.navigation.navigate('Add Meals');
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
    setAmount = () => {
        if (this.state.selectedItems.length > 0) {
            this.props.navigation.navigate('Set Amount', {selectedItems: this.state.selectedItems,
            logId:this.props.route.params.logId, mealType: this.props.route.params.mealType});
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
    render () {
        // console.warn(this.props.route.params.date.getDate());
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this.addMeal} style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
                    <Ionicons name="md-add-circle" size={32} color="green" />
                    <MonoText style={{color:'blue',marginLeft: 10, alignSelf:'center'}}>Add Meal</MonoText>
                </TouchableOpacity>

                { this.state.selectedItems.length === 1 &&
                    <TouchableOpacity onPress={this.deleteMeal} style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
                        <Ionicons name="md-trash" size={32} color="red" />
                        <MonoText style={{color:'red',marginLeft: 10, alignSelf:'center'}}>Delete Meal</MonoText>
                    </TouchableOpacity>
                }
                    <FlatList
                        keyExtractor={(item) => item.id.toString() }
                        data={this.state.items}
                        renderItem={({ item }) => <MealItem
                            onItemSelected={this.onItemSelected}
                            item={item}/>}
                    />
                    <TouchableOpacity onPress={this.setAmount} style={styles.buttonStyle}>
                        <Text style={styles.buttonTextStyle}>Set Amount</Text>
                    </TouchableOpacity>

                    {/*<View style={styles.helpContainer}>*/}
                    {/*  <TouchableOpacity onPress={handleHelpPress} style={styles.helpLink}>*/}
                    {/*    <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>*/}
                    {/*  </TouchableOpacity>*/}
                    {/*</View>*/}

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
        marginVertical: 7,
    },
    codeHighlightText: {
        color: 'rgba(96,100,109, 0.8)',
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
    buttonStyle: {
        backgroundColor: 'green',
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
    }
});
