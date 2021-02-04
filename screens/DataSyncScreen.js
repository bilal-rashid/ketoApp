import * as React from 'react';
import {Alert, Image, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from "expo-sharing";
import * as SecureStore from "expo-secure-store";
import * as SQLite from "expo-sqlite";
var db = null;
export default class DataSyncScreen extends React.Component {
    content;

    componentDidMount() {
        SQLite.openDatabase("keto_db.db","1.0",undefined,undefined,(database)=>{
            db = database;
        });
    }

    constructor () {
        super();
        this.state = {
            loading: false
        };
        this.resetContent();
    }
    resetContent = () => {
        this.content = {
            profile: {},
            dailylogs: [],
            mealquantity: [],
            meals: [],
            recipe: []
        };
    };
    getAllMeals = () => {
        const array = [];
        db.transaction(tx => {
            tx.executeSql(
                `select * from recipe;`,
                null,
                (_, { rows: { _array } }) => {
                    this.content.recipe = [..._array];
                    this.getAllIngredients();
                }
            );
        });
    };
    getAllIngredients = () => {
        const array = [];
        db.transaction(tx => {
            tx.executeSql(
                `select * from meals;`,
                null,
                (_, { rows: { _array } }) => {
                    this.content.meals = [..._array];
                    this.getAllDailyLogs();
                }
            );
        });
    };
    getAllDailyLogs = () => {
        const array = [];
        db.transaction(tx => {
            tx.executeSql(
                `select * from dailylogs;`,
                null,
                (_, { rows: { _array } }) => {
                    this.content.dailylogs = [..._array];
                    this.getAllMealLogs();
                }
            );
        });
    };
    getAllMealLogs = () => {
        const array = [];
        db.transaction(tx => {
            tx.executeSql(
                `select * from mealquantity;`,
                null,
                (_, { rows: { _array } }) => {
                    this.content.mealquantity = [..._array];
                    this.exportJsonFileUsingShare();
                }
            );
        });
    };
    fetchFromLocalStorage = () => {
        SecureStore.getItemAsync('user_name').then(user_name => {
            SecureStore.getItemAsync('user_calories').then(user_calories => {
                SecureStore.getItemAsync('user_protein').then(user_protein => {
                    SecureStore.getItemAsync('user_fat').then(user_fat => {
                        SecureStore.getItemAsync('user_carb').then(user_carb => {
                            this.content.profile = {
                                name: (user_name)? user_name: '',
                                calories: (user_calories)? +user_calories: 0,
                                proteinPercent: (user_protein)? +user_protein: 0,
                                fatPercent: (user_fat)? +user_fat: 0,
                                carbPercent: (user_carb)? +user_carb: 0
                            };
                            this.getAllMeals();
                        });
                    });
                });
            });
        });
    };



    backPress = () => {
        this.props.navigation.goBack();

    };
    import = () => {
        Alert.alert(
            "Are you sure?",
            "This will delete existing data and import data from external file",
            [
                {
                    text: "Cancel",
                    onPress: () => {
                    },
                    style: "cancel"
                },
                { text: "OK", onPress: () => {
                        this.openDocumentPicker();
                    } }
            ],
            { cancelable: false }
        );
    };
    deleteAllData = (table) => {
        db.transaction(tx => {
            tx.executeSql(
                "delete from "+table+";",
                null,
                () => {}
            );
        });
    };
    restoreData = (data) => {
        // restore profile
        SecureStore.setItemAsync('user_name', data.profile.name);
        SecureStore.setItemAsync('user_calories', data.profile.calories.toString());
        SecureStore.setItemAsync('user_protein', data.profile.proteinPercent.toString());
        SecureStore.setItemAsync('user_fat', data.profile.fatPercent.toString());
        SecureStore.setItemAsync('user_carb', data.profile.carbPercent.toString());
        // restore meals
        data.meals.forEach(ingredient => {
            console.warn('ingredient',ingredient);
            db.transaction(
                tx => {
                    tx.executeSql("insert into meals (protein, fat, carb, name,group_name) values " +
                        "(" + ingredient.protein + "," + ingredient.fat + "," + ingredient.carb + ", '" + ingredient.name
                        + "','"+ingredient.group_name+"');", null,
                        (_t,_r) => console.log('kkkk', _r.insertId));
                },
                (_err)=>{console.warn('error',_err)},
                () => {
                }
            );
        });

        //restore recipe
        data.recipe.forEach(meal => {
            db.transaction(
                tx => {
                    tx.executeSql("insert into recipe (protein, fat, carb, quantity, name," +
                        "description) values " +
                        "(" + meal.protein + "," + meal.fat + "," +
                        meal.carb + "," + meal.quantity + ", '" + meal.name + "'," + "'"
                        + meal.description + "'"  +");", null,
                        (_t,_r)=> {});
                },
                (_err)=>{console.warn('error',_err)},
                () => {
                }
            );
        });

        //restore daily logs
        data.dailylogs.forEach(log => {
            db.transaction(
                tx => {
                    tx.executeSql("insert into dailylogs (id,date) values " +
                        "('" +log.id+"'"+ ",'"+ log.date + "');", null, (_t,_r)=> {
                    });
                },
                (_err)=>{console.warn('error',_err)},
                () => {
                }
            );
        });

        //restore mealquantity
        data.mealquantity.forEach(mealqty => {
            db.transaction(
                tx => {
                    tx.executeSql("insert into mealquantity (log_id, meal_type, meal_name, protein," +
                        "fat,carb,protein_percent,fat_percent,carb_percent,quantity,meal_id) values " +
                        "(" + mealqty.log_id + "," + mealqty.meal_type + ",'" +
                        mealqty.meal_name + "', " + mealqty.protein + "," + mealqty.fat
                        + "," + mealqty.carb + "," + mealqty.protein_percent + "," + mealqty.fat_percent + "," + mealqty.carb_percent
                        + "," + mealqty.quantity + ","+ mealqty.meal_id +");", null,
                        (_t,_r)=> console.log('kkkk', _r.insertId));
                },
                (_err)=>{console.warn('error',_err)},
                () => {
                }
            );
        });

        Alert.alert(
            "Data imported successfully",
            null,
            [
                {
                    text: "Ok",
                    onPress: () => {
                    }}
            ],
            { cancelable: true }
        );

    };
    openDocumentPicker = async () => {
        const perm = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        console.warn(perm.status);
        if (perm.status !== 'granted') {
            return;
        }
        await DocumentPicker.getDocumentAsync({type:'*/*'}).then( doc => {
            if (doc.type === 'success') {
                var re = /(?:\.([^.]+))?$/;
                if (doc.name) {
                    if (re.exec(doc.name)[1] === 'json') {
                        FileSystem.readAsStringAsync(doc.uri).then(json => {
                            const data = JSON.parse(json);
                            if (data.dailylogs && data.mealquantity && data.meals && data.recipe && data.profile) {
                                this.deleteAllData('recipe');
                                this.deleteAllData('mealquantity');
                                this.deleteAllData('dailylogs');
                                this.deleteAllData('meals');
                                this.restoreData(data);
                            } else {
                                Alert.alert(
                                    "Data format not supported!",
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
                            }
                        });
                    } else {
                        Alert.alert(
                            "File not supported!",
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
                    }
                } else {
                    Alert.alert(
                        "File not supported!",
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
                }
            }
        }).catch(error => {
            console.warn('error', error);
        });
    };
    export = () => {
        this.resetContent();
        this.fetchFromLocalStorage();
    };
    exportJsonFileUsingShare = async() => {
        const perm = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (perm.status !== 'granted') {
            return;
        }
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = mm + '_' + dd + '_' + yyyy +'_'+ today.getMilliseconds();
        let fileUri = FileSystem.documentDirectory +'Keto_Backup_'+today+".json";
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(this.content));
        await Sharing.shareAsync(fileUri);
    };
    test = async () => {
        const perm = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (perm.status !== 'granted') {
            return;
        }

        await DocumentPicker.getDocumentAsync({type:'*/*'}).then(doc=>{
            FileSystem.readAsStringAsync(doc.uri).then(str=>{console.warn(str)});
        });
        // const { status } = await Permissions.askAsync(Permissions.CAMERA);
        let fileUri = FileSystem.documentDirectory + "bilal.json";
        // await FileSystem.writeAsStringAsync(fileUri, "Hello World new");

        // await Sharing.shareAsync(fileUri);
        // await FileSystem.writeAsStringAsync(fileUri, "Hello World new");
        // FileSystem.readAsStringAsync(fileUri).then(str=>{console.warn(str)});
        // try {
        //     const asset = await MediaLibrary.createAssetAsync(fileUri);
        //     const album = await MediaLibrary.getAlbumAsync('Download');
        //     console.warn('check1');
        //     if (album == null) {
        //         console.warn('album null');
        //         await MediaLibrary.createAlbumAsync('Download', asset, false);
        //     } else {
        //         console.warn('album not null');
        //         await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        //     }
        // } catch (e) {
        //     console.warn('error', e);
        // }
        // console.warn(fileUri);
        // await FileSystem.writeAsStringAsync(fileUri, "Hello World", {encoding: FileSystem.EncodingType.UTF8});
        // FileSystem.readAsStringAsync(fileUri, {encoding: FileSystem.EncodingType.UTF8}).then(str=>{console.warn(str)});
        // console.warn('Hogya');
    };
    render () {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>

                    <View style={{height:1, backgroundColor:'#aaaaaa', marginTop:0}}/>

                    <TouchableOpacity onPress={this.export}>
                        <Text style={{margin:10, fontSize:19, color:'#0079FF'}}>Export to JSON file</Text>
                    </TouchableOpacity>
                    <View style={{height:1, backgroundColor:'#aaaaaa', marginTop:0}}/>

                    <TouchableOpacity onPress={this.import}>
                        <Text style={{margin:10, fontSize:19, color:'#0079FF'}}>Import from JSON file</Text>
                    </TouchableOpacity>
                    <View style={{height:1, backgroundColor:'#aaaaaa', marginTop:0}}/>

                    <TouchableOpacity onPress={()=>{
                        this.props.navigation.navigate('Links');
                    }
                    }>
                        <Text style={{margin:10, fontSize:19, color:'#0079FF'}}>Home</Text>
                    </TouchableOpacity>
                    <View style={{height:1, backgroundColor:'#aaaaaa', marginTop:0}}/>


                    <View style={styles.welcomeContainer}>
                        <Image

                            source={
                                __DEV__
                                    ? require('../assets/images/appLogo.png')
                                    : require('../assets/images/appLogo.png')
                            }
                            style={styles.welcomeImage}
                        />
                    </View>


                </View>
            </SafeAreaView>
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
        position: 'absolute', bottom: 0,
        width:'100%',
    },
    welcomeImage: {
        height: 100,
        resizeMode: 'contain',
        marginTop: 3,
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
