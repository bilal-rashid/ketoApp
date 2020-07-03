import * as React from 'react';
import { StyleSheet, Text,View,TextInput} from 'react-native';

export default class MealLogItem extends React.Component {
    onChange = (value) => {
        this.props.onValueChange(+value, this.props.item.id);
    }

    render () {
        return (
                <View style={styles.container}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.item}>{this.props.item.name}</Text>
                        <View style={styles.valuesContainer}>
                            <Text style={[styles.valuesText,{marginLeft:10}]}>Kohlehydrate: </Text>
                            <Text style={styles.valuesText}>{this.props.item.carb}g</Text>
                            <Text style={styles.valuesText}>  Fett: </Text>
                            <Text style={styles.valuesText}>{this.props.item.fat}g</Text>
                            <Text style={styles.valuesText}>  Eiweiß: </Text>
                            <Text style={styles.valuesText}>{this.props.item.protein}g</Text>
                        </View>
                    </View>
                    <TextInput
                        style={styles.textInputStyle}
                        placeholder={'Amount in gram'}
                        keyboardType={'decimal-pad'}
                        onChangeText={this.onChange}

                    />

                </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        padding:5,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor:'#cdc9c9',
        borderBottomWidth:1
    },
    innerContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    valuesContainer: {
        marginTop:5,
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
        paddingLeft: 10,
        fontSize: 16,
        marginTop: 10
    },
    groupItem: {
        marginLeft: 10,
        fontSize: 14,
        color: '#007AFF'
    },
    valuesText: {
        fontSize: 12,
    },
    textInputStyle: { height: 40,width:120, borderColor: 'gray', borderWidth: 1, borderRadius: 4, margin: 5, padding: 4 }
});
