import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';

import * as SQLite from 'expo-sqlite';
import { Button } from 'react-native';
import MealLogItem from "../components/MealLogItem";
const db = SQLite.openDatabase("db.db");
export default class LogMealScreen extends React.Component {
    constructor () {
        super();
        this.state = {
            error:false,
            values:{}
        };
    }
    componentDidMount() {
        const items = this.props.route.params.selectedItems;
        let tempObj = {};
        for (let i=0; i < items.length; i++) {
            tempObj[items[i].id+''] = 0;
        }
        this.setState({values: tempObj});
    }

    backPress = () => {
        db.transaction(tx => {
            tx.executeSql(
                `select * from meals;`,
                null,
                (_, { rows: { _array } }) => console.warn(JSON.stringify(_array))
            );
        });
        this.props.navigation.goBack();

    };
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
    onChangeName = (value) => {
        this.setState({
            name:value
        })
    }
    validate = () =>  {
        const keys = Object.keys(this.state.values);
        for (let i=0; i < keys.length; i++) {
            if (this.state.values[keys[i]] === 0) {
                return false;
            }
        }
        return true;
    }
    onSave = () => {
        if (this.validate()) {
            this.setState({error:false})

        } else {
            this.setState({error:true})
        }
        // this.props.navigation.navigate('Root');
        // if (this.state.protein && this.state.fat && this.state.name && this.state.carb) {
        //     this.setState({error: false});
        //     db.transaction(
        //         tx => {
        //             tx.executeSql("insert into meals (protein, fat,carb,name) values " +
        //                 "(" + this.state.protein + "," + this.state.fat + "," + this.state.carb + ", '" + this.state.name + "')", null);
        //         },
        //         null,
        //         () => {
        //             this.backPress();
        //         }
        //     );
        // } else {
        //     this.setState({error: true});
        //
        // }
    }
    onChangeValue = (value, id) => {
        console.log(value,id);
        let temp = {...this.state.values};
        temp[id+''] = value;
        this.setState({values: temp});
    }
    render () {
        console.log(this.state);
        return (
            <View style={styles.container}>
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
                <View style={{marginLeft:100, marginRight:100,marginTop:20,marginBottom:20}}>
                    <Button title="Save" onPress={this.onSave} />
                </View>
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
        marginVertical: 7,
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
