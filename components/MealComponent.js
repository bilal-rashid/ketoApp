import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import {Image, Platform, StyleSheet, Text, TouchableOpacity,View} from 'react-native';
import Colors from '../constants/Colors';
import {useEffect} from "react";

export default function MealComponent(props) {
    useEffect(() => {

    }, [])
    return (
        <View style={styles.container}>
            <Image
                source={props.imageSrc
                }
                style={styles.imageStyle}
            />
            <Text style={styles.mealText}>{props.mealText}</Text>
            <Text onPress={() => props.callBackAdd(43)} style={styles.helpLinkText}>
                Add
            </Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        padding:10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor:'#b1afaf',
        borderBottomWidth:3
    },
    imageStyle: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: -10,
    },
    mealText: {
        fontSize:20,
        fontWeight:'bold',
        alignSelf: 'center',
        marginRight:40
    },
    helpLinkText: {
        fontSize: 16,
        color: '#2e78b7',
        alignSelf: 'center',
        marginRight:10
    }
});
