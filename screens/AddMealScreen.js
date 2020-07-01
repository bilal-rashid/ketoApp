import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import {  Platform, StyleSheet, Text, View } from 'react-native';

import * as SQLite from 'expo-sqlite';
import { TextInput,Button,Alert,Picker,TouchableOpacity } from 'react-native';
const db = SQLite.openDatabase("db.db");
export default class AddMealScreen extends React.Component {
    constructor () {
        super();
        this.state = {
            name: '',
            group: '',
            protein: 0.0,
            fat: 0.0,
            carb: 0.0,
            error:false
        };
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
    onSave = () => {
        if (this.state.protein && this.state.fat && this.state.carb && this.state.name.length>1
        && this.state.group.length>1) {
            this.setState({error: false});
            db.transaction(
                tx => {
                    tx.executeSql("insert into meals (protein, fat, carb, name,group_name) values " +
                        "(" + this.state.protein + "," + this.state.fat + "," + this.state.carb + ", '" + this.state.name
                        + "','"+this.state.group+"');", null,
                        (_t,_r)=> console.log('kkkk', _r.insertId));
                },
                (_err)=>{console.warn('error',_err)},
                () => {
                    this.backPress();
                }
            );
        } else {
            this.setState({error: true});

        }
    }
    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={this.onSave}>
                    <Text style={{color:'#007AFF', fontSize:17, marginRight:15}}>Add</Text>
                </TouchableOpacity>
            ),
        });
    }

    render () {
        return (
            <View style={styles.container}>
                <Picker
                    selectedValue={this.state.group}
                    onValueChange={(itemValue, itemIndex) => this.setState({ group: itemValue })}>
                    <Picker.Item label="Select" value='n' />
                    <Picker.Item label="Gemüse" value="Gemüse" />
                    <Picker.Item label="Früchte" value="Früchte" />
                    <Picker.Item label="Ei" value="Ei" />
                    <Picker.Item label="Fette" value="Fette" />
                    <Picker.Item label="Fleisch/ Wurst" value="Fleisch/ Wurst" />
                    <Picker.Item label="Fisch" value="Fisch" />
                    <Picker.Item label="Kakao" value="Kakao" />
                    <Picker.Item label="KetoNahrung speziell" value="KetoNahrung speziell" />
                    <Picker.Item label="Vitamine" value="Vitamine" />
                    <Picker.Item label="Nahrungsergänzung" value="Nahrungsergänzung" />
                    <Picker.Item label="Getränke" value="Getränke" />
                    <Picker.Item label="Nüsse/ Samen" value="Nüsse/ Samen" />
                    <Picker.Item label="Mehle" value="Mehle" />
                    <Picker.Item label="Brei" value="Brei" />
                    <Picker.Item label="Nussmus" value="Nussmus" />
                    <Picker.Item label="Süssung" value="Süssung" />
                    <Picker.Item label="Käse/ Milchprodukte" value="Käse/ Milchprodukte" />
                    <Picker.Item label="Fertigbreie" value="Fertigbreie" />
                    <Picker.Item label="Getreide-und Brotprodukte" value="Getreide-und Brotprodukte" />
                    <Picker.Item label="Nudeln/Reis" value="Nudeln/Reis" />
                    <Picker.Item label="Britta Alagna" value="Britta Alagna" />
                    <Picker.Item label="Gekochte Breie" value="Gekochte Breie" />
                </Picker>
                <TextInput
                    style={styles.textInputStyle}
                    placeholder={'Name'}
                    onChangeText={this.onChangeName}
                    keyboardType={'default'}

                />
                <TextInput
                    style={styles.textInputStyle}
                    placeholder={'Eiweiß in Gram pro 100g'}
                    onChangeText={this.onChangeProtein}
                    keyboardType={'decimal-pad'}

                />
                <TextInput
                    style={styles.textInputStyle}
                    placeholder={'Fett in Gram pro 100g'}
                    onChangeText={this.onChangeFat}
                    keyboardType={'decimal-pad'}

                />
                <TextInput
                    style={styles.textInputStyle}
                    placeholder={'Kohlenhydrate in Gram pro 100g'}
                    onChangeText={this.onChangeCarb}
                    keyboardType={'decimal-pad'}

                />

                {/*<View style={{marginLeft:100, marginRight:100,marginTop:20,marginBottom:20}}>*/}
                {/*    <Button title="Add" onPress={this.onSave} />*/}
                {/*</View>*/}
                <Separator />
                { this.state.error && (
                <Text style={styles.codeHighlightText}>Some valuesk are missing. Please fill them out and try to save again</Text>)
                }
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
