import * as React from 'react';
import {Image, StyleSheet, Text, FlatList,TouchableOpacity,View} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {MonoText} from "./StyledText";

function Item({ item }) {
    return (
        <View style={styles.listItemContainer}>
            <View style={styles.listItemContainer3}>
                <Text style={{fontSize:16}}>{item.meal_name}</Text>
            </View>
            <View style={styles.listItemContainer2}>
                <Text>{item.protein}g</Text>
                <Text>{item.fat}g</Text>
                <Text>{item.carb}g</Text>
            </View>
        </View>
    );
}
function ListHeder(props) {
    return (
        <View style={styles.listItemContainer}>
            <View style={styles.listItemContainer3}>
            </View>
            <View style={styles.listItemContainer2}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{fontWeight:'bold'}}>E </Text>
                    <Text style={{fontSize:11, alignSelf: 'center'}}>({((props.proteinToday/props.proteinTarget)*100).toFixed(1)}%)</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{fontWeight:'bold'}}>F </Text>
                    <Text style={{fontSize:11, alignSelf: 'center'}}>({((props.fatToday/props.fatTarget)*100).toFixed(1)}%)</Text>
                </View>
                <View style={{flexDirection: 'row',marginLeft:5}}>
                    <Text style={{fontWeight:'bold'}}>K </Text>
                    <Text style={{fontSize:11, alignSelf: 'center'}}>({((props.carbToday/props.carbTarget)*100).toFixed(1)}%)</Text>
                </View>
            </View>
        </View>
    );
}

export default class MealComponent extends React.Component {
    constructor () {
        super();
        this.state = {
            show: false
        };
    }
    toggleShow = () => {
        this.setState({show:!this.state.show});
    }
    render () {
        var proteinToday = 0;
        var fatToday = 0;
        var carbToday = 0;
        this.props.mealQuantities.forEach(item => {
            proteinToday = proteinToday + item.protein;
            carbToday = carbToday + item.carb;
            fatToday = fatToday + item.fat;
        });
        return (
            <View>
                <View style={styles.container}>
                    <TouchableOpacity
                        onPress={this.toggleShow}>
                    <Image
                        source={this.props.imageSrc
                        }
                        style={styles.imageStyle}
                    />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{alignSelf: 'center'}}
                        onPress={this.toggleShow}>
                    <Text  style={styles.mealText}>{this.props.mealText}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{alignSelf: 'center'}}
                        onPress={() => this.props.callBackAdd(this.props.mealType)}>
                    <Text  style={styles.helpLinkText}>
                        Add
                    </Text>
                    </TouchableOpacity>
                </View>
                { this.state.show &&
                <View>
                    <FlatList
                        data={this.props.mealQuantities}
                        renderItem={({ item }) => <Item item={item} />}
                        keyExtractor={item => item.id.toString()}
                        ListHeaderComponent={<ListHeder
                            proteinToday={proteinToday}
                            fatToday={fatToday}
                            carbToday={carbToday}
                            proteinTarget={this.props.proteinTarget}
                            fatTarget={this.props.fatTarget}
                            carbTarget={this.props.carbTarget}
                        />}
                    />
                    {
                        this.props.mealQuantities.length === 0 &&
                        <View >
                            <View style={{flexDirection:'row', alignSelf: 'center'}}>
                                <Ionicons style={{alignSelf: 'center'}} name="md-information-circle" size={32} color="red" />
                                <MonoText style={{color:'red',marginLeft: 10, alignSelf:'center'}}>No Values</MonoText>
                            </View>
                        </View>
                    }
                    {
                        this.props.mealQuantities.length > 0 &&
                        <TouchableOpacity
                            onPress={() => this.props.callBackClear(this.props.mealQuantities)}>
                            <Text  style={styles.clearText}>
                                Clear
                            </Text>
                        </TouchableOpacity>
                    }
                </View>
                }
            </View>
        );
    }
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
    listItemContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor:'#e2e1e1',
        borderBottomWidth:1
    },
    listItemContainer2: {
        paddingLeft:5,
        paddingRight:5,
        paddingTop:2,
        paddingBottom:2,
        flex: 4,
        textAlign:'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight:10
    },
    listItemContainer3: {
        marginLeft: 5,
        paddingLeft:5,
        paddingRight:5,
        paddingTop:2,
        paddingBottom:2,
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        marginRight:40
    },
    helpLinkText: {
        fontSize: 16,
        color: '#2e78b7',
        alignSelf: 'center',
        marginRight:10
    },
    clearText: {
        fontSize: 16,
        marginTop: 5,
        color: '#2e78b7',
        alignSelf: 'flex-end',
        marginRight:10
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    }
});
