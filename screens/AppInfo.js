import * as React from 'react';
import {Image, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from "expo-sharing";
export default class AppInfo extends React.Component {
    constructor () {
        super();
        this.state = {
            items: [],
            filteredItems: [],
            selectedItems: []
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
    goToDisclaimer = () => {
        WebBrowser.openBrowserAsync('http://danrit.net/KetoAppDisclaimer.htm');
    };
    goToErste = () => {
        WebBrowser.openBrowserAsync('http://danrit.net/KetoAppErsteSchritte.htm');
    };
    goToSpende = () => {
        WebBrowser.openBrowserAsync('https://glut1.de/so-helfen-sie-uns/spendenkonto/');
    };
    goToWebAddress = () => {
        WebBrowser.openBrowserAsync('http://glut1.de/');
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
        // console.warn(this.props.route.params.date.getDate());
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
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
                    <View style={{height:1, backgroundColor:'#aaaaaa', marginTop:-10}}/>
                    {/*<TouchableOpacity>*/}
                    {/*    <Text style={{margin:10, fontSize:19, color:'#0079FF'}}>FAQ</Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<View style={{height:1, backgroundColor:'#aaaaaa', marginTop:0}}/>*/}

                    {/*<TouchableOpacity>*/}
                    {/*    <Text style={{margin:10, fontSize:19, color:'#0079FF'}}>Contact Us</Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<View style={{height:1, backgroundColor:'#aaaaaa', marginTop:0}}/>*/}

                    <TouchableOpacity onPress={this.goToDisclaimer}>
                        <Text style={{margin:10, fontSize:19, color:'#0079FF'}}>Disclaimer</Text>
                    </TouchableOpacity>
                    <View style={{height:1, backgroundColor:'#aaaaaa', marginTop:0}}/>

                    <TouchableOpacity onPress={this.goToErste}>
                        <Text style={{margin:10, fontSize:19, color:'#0079FF'}}>Erste Schritte</Text>
                    </TouchableOpacity>
                    <View style={{height:1, backgroundColor:'#aaaaaa', marginTop:0}}/>

                    <TouchableOpacity onPress={this.goToSpende}>
                        <Text style={{margin:10, fontSize:19, color:'#0079FF'}}>Spende</Text>
                    </TouchableOpacity>
                    <View style={{height:1, backgroundColor:'#aaaaaa', marginTop:0}}/>

                    {/*<TouchableOpacity>*/}
                    {/*    <Text style={{margin:10, fontSize:19, color:'#0079FF'}}>Licenses</Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<View style={{height:1, backgroundColor:'#aaaaaa', marginTop:0}}/>*/}

                    <TouchableOpacity onPress={()=>{
                        this.props.navigation.navigate('Links');
                    }
                    }>
                        <Text style={{margin:10, fontSize:19, color:'#0079FF'}}>Home</Text>
                    </TouchableOpacity>
                    <View style={{height:1, backgroundColor:'#aaaaaa', marginTop:0}}/>

                    {/*bottom views below*/}
                    <View style={{position: 'absolute', bottom: 20,
                        width:'100%',
                        flex:1,alignItems: 'center'}}>
                        <Text style={{fontSize:13, color: '#7d7c7c',marginRight:20, flex:1}}>Keto</Text>
                    </View>
                    <View style={{position: 'absolute', bottom: 0,
                        width:'100%',
                        flex:1,alignItems: 'center'}}>
                        <Text style={{fontSize:13, color: '#7d7c7c',marginRight:20, flex:1}}>Version 1.0.0</Text>
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
        marginTop: 10,
        marginBottom: 20,
    },
    welcomeImage: {
        height: 300,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: 30,
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
