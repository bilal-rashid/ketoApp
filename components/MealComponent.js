import * as React from 'react';
import {Image, StyleSheet, Text, FlatList,TouchableOpacity,View} from 'react-native';
const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First Item',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
    },
];

function Item({ title }) {
    return (
        <View style={styles.item}>
            <Text style={styles.title}>{title}</Text>
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
                <FlatList
                    data={DATA}
                    renderItem={({ item }) => <Item title={item.title} />}
                    keyExtractor={item => item.id}
                />}
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
    item: {
        backgroundColor: '#f9c2ff',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
});
