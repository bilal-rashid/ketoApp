import * as React from 'react';
import {Image, StyleSheet, Text, FlatList,TouchableOpacity,View,TextInput} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {MonoText} from "./StyledText";

function Item(props) {
    const select = () => {
        props.onItemSelected(!props.selected,props.item);
    };
    const onQtyChange = (value) => {
        props.onQuantityChange(props.item, +value);
    };
    let mealName = '';
    if (props.item.meal_name.length > 15) {
        mealName = props.item.meal_name.substring(0,14) + '...';
    } else {
        mealName = props.item.meal_name;
    }
    const backgroundColor = (props.selected)? '#cdcccc' : 'rgba(255,255,255,0)';
    return (
        <TouchableOpacity style={{backgroundColor: backgroundColor}} onPress={select}>
            <View style={styles.listItemContainer}>
                <View style={styles.listItemContainer3}>
                    <Text style={{fontSize:16}}>{mealName}</Text>
                    {props.selected && <TextInput keyboardType={'decimal-pad'} onChangeText={onQtyChange} value={props.item.quantity.toString()} style={{borderColor: 'gray',backgroundColor:'#fff', borderWidth: 1, borderRadius: 4,width:40,height:20}}/>}
                </View>
                {/*<View style={{flex:2, backgroundColor:'#a8a7a7'}}>*/}
                {/*    <TextInput style={{borderColor: 'gray', borderWidth: 1, borderRadius: 4}}/>*/}
                {/*</View>*/}
                <View style={styles.listItemContainer2}>
                    <Text>{props.item.protein}g</Text>
                    <Text>{props.item.fat}g</Text>
                    <Text>{props.item.carb}g</Text>
                </View>
            </View>
        </TouchableOpacity>
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
                    <Text style={{fontSize:11, alignSelf: 'center'}}>({(props.proteinToday.toFixed(1))})g</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{fontWeight:'bold'}}>F </Text>
                    <Text style={{fontSize:11, alignSelf: 'center'}}>({((props.fatToday)).toFixed(1)})g</Text>
                </View>
                <View style={{flexDirection: 'row',marginLeft:5}}>
                    <Text style={{fontWeight:'bold'}}>K </Text>
                    <Text style={{fontSize:11, alignSelf: 'center'}}>({((props.carbToday)).toFixed(1)})g</Text>
                </View>
            </View>
        </View>
    );
}

export default class MealComponent extends React.Component {
    constructor () {
        super();
        this.state = {
            show: false,
            selectedItems:[]
        };
    }
    toggleShow = () => {
        this.setState({show:!this.state.show});
    }
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
    }
    onIncrement = () => {
        let selectedItems = [...this.state.selectedItems];
        selectedItems[0].quantity = selectedItems[0].quantity + 1;
        this.setState({selectedItems: selectedItems});
        this.props.onQuantityChange(selectedItems[0], selectedItems[0].quantity);
    }
    onDecrement = () => {
        let selectedItems = [...this.state.selectedItems];
        selectedItems[0].quantity = selectedItems[0].quantity - 1;
        this.setState({selectedItems: selectedItems});
        this.props.onQuantityChange(selectedItems[0], selectedItems[0].quantity);
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
        let ratio = -1;
        if (proteinToday + carbToday > 0) {
            ratio = (fatToday/(proteinToday+carbToday)).toFixed(2);
        }
        let caloriesToday = ((proteinToday * 4.1) + (carbToday * 4.1) + (fatToday * 9.3)).toFixed(2);
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
                        {(this.props.mealText === 'Snack')?
                            <Text  style={styles.mealTextSnack}>{this.props.mealText}</Text>:
                            <Text  style={styles.mealText}>{this.props.mealText}</Text>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{alignSelf: 'center'}}
                        onPress={this.toggleShow}>
                        <Text  style={styles.kalText}> kCal: {caloriesToday}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{alignSelf: 'center'}}
                        onPress={this.toggleShow}>
                        {(ratio !== -1)?<Text  style={styles.ratioText}> Ratio: {ratio}</Text>:
                            <Text  style={styles.ratioText}> Ratio: 0.00</Text>}
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
                        renderItem={({ item }) => <Item
                            onItemSelected={this.onItemSelected}
                            onQuantityChange = {this.props.onQuantityChange}
                            selected={this.state.selectedItems.filter(p=>p.id === item.id).length === 1}
                            item={item} />}
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
                        <View style={{backgroundColor: '#d0cfcf'}}>
                            <View style={{flexDirection:'row', alignSelf: 'center'}}>
                                <Ionicons style={{alignSelf: 'center'}} name="md-information-circle" size={32} color="red" />
                                <MonoText style={{color:'red',marginLeft: 10, alignSelf:'center'}}>No Values</MonoText>
                            </View>
                        </View>
                    }

                    <View style={{flexDirection:'row', flex:1, textAlign:'center', paddingLeft:5,marginTop:5, borderBottomWidth:1,
                    borderBottomColor:'#b1afaf',paddingBottom:3}}>
                            {
                                this.state.selectedItems.length === 1 &&
                                <TouchableOpacity
                                    onPress={this.onDecrement}
                                    style={styles.controlButtonStyle}>
                                    <Text style={{color: '#fff', fontSize: 19}}>-1</Text>
                                </TouchableOpacity>
                            }
                            {
                                this.state.selectedItems.length === 1 &&
                                <TouchableOpacity
                                    onPress={this.onIncrement}
                                    style={styles.controlButtonStyle}>
                                    <Text style={{color: '#fff', fontSize: 19}}>+1</Text>
                                </TouchableOpacity>
                            }
                            {this.state.selectedItems.length > 0 &&
                                <TouchableOpacity
                                    onPress={() =>{
                                        this.props.callBackClear(this.state.selectedItems);
                                        this.setState({selectedItems: []});
                                    }}
                                    style={styles.controlButtonStyle}>
                                    <Image
                                        source={require('../assets/images/trash.png')
                                        }
                                        style={{width:25,height:25,resizeMode: 'contain'}}
                                    />
                                </TouchableOpacity>
                            }
                            <TouchableOpacity
                                onPress={() => this.props.callBackAdd(this.props.mealType)}
                                style={styles.controlButtonStyle}>
                                <Image
                                    source={require('../assets/images/search.png')
                                    }
                                    style={{width:25,height:25,resizeMode: 'contain'}}
                                />
                            </TouchableOpacity>
                            {this.state.selectedItems.length > 0 &&
                            <TouchableOpacity
                                onPress={() =>{
                                    this.props.callBackAddMeal(this.state.selectedItems);
                                    this.setState({selectedItems: []});
                                }}
                                style={styles.controlTextButtonStyle}>
                                <Text style={{color: '#fff', fontSize: 17}}>Create Meal</Text>
                            </TouchableOpacity>}
                        </View>

                </View>
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    controlButtonStyle: {
        width:35,height:35, backgroundColor: '#4a83f1',
        borderRadius: 4,marginLeft: 5, justifyContent: 'center',
        alignItems: 'center'
    },
    controlTextButtonStyle: {
        width:110,height:35, backgroundColor: '#4a83f1',
        borderRadius: 4,marginLeft: 5, justifyContent: 'center',
        alignItems: 'center'
    },
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
        width: 50,
        height: 50,
        resizeMode: 'contain',
        marginTop: 3,
    },
    mealTextSnack: {
        width: 90,
        fontSize:17,
        fontWeight:'bold'
    },
    mealText: {
        fontSize:17,
        fontWeight:'bold'
    },
    kalText: {
        fontSize:15,
        marginRight:10
    },
    ratioText: {
        fontSize:15,
        marginRight:10
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
    },
    textInputStyle: {
        width:200,
        flex: 1,
        marginRight:5,
        height: 35, borderColor: 'gray', borderWidth: 1, borderRadius: 4, margin: 5, padding: 4 }
});
