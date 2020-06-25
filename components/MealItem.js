import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import {Image, Platform, StyleSheet, Text, TouchableOpacity,View} from 'react-native';
import Colors from '../constants/Colors';
import {useEffect} from "react";

export default class MealItem extends React.Component {
    constructor () {
        super();
        this.state = {
            selected: false
        };
    }
    select = () => {
        const selected = this.state.selected;
        this.setState({selected:!selected});
    };

    render () {
        const backgroundColor = (this.state.selected)? '#cdcccc' : '#fff';
        return (
            <TouchableOpacity style={{backgroundColor: backgroundColor}} onPress={this.select}>
                <View style={styles.container}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.item}>{this.props.item.name}</Text>
                        <View style={styles.valuesContainer}>
                            <Text style={[styles.valuesText,{marginLeft:10}]}>Carb: </Text>
                            <Text style={styles.valuesText}>{this.props.item.carb}g</Text>
                            <Text style={styles.valuesText}>  Fat: </Text>
                            <Text style={styles.valuesText}>{this.props.item.fat}g</Text>
                            <Text style={styles.valuesText}>  Protein: </Text>
                            <Text style={styles.valuesText}>{this.props.item.protein}g</Text>
                        </View>
                    </View>
                    <View style={{alignSelf:'center'}}>
                        {this.state.selected && (
                            <Ionicons name="md-checkmark" size={32} color='#077bac'/>)
                        }
                    </View>

                </View>
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        padding:5,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor:'#6f6e6e',
        borderBottomWidth:1
    },
    innerContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    valuesContainer: {
        flex: 1,
        flexDirection: 'row',
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
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    valuesText: {
        fontSize: 12,
    }
});
