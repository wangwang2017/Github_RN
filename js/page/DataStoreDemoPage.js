/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View,TextInput,ScrollView,AsyncStorage} from 'react-native';
import {connect} from "react-redux";
import actions from '../action/index'
import DataStore from "../expand/dao/DataStore";

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});
const KEY = "saveKey";
type Props = {};
export default class DataStoreDemoPage extends Component<Props> {
    constructor(props){
        super(props);
        this.state={
            showText:''
        }
        this.dataStore = new DataStore();
    }

    loadData(){
        let url = `https://api.github.com/search/repositories?q=${this.searchKey}`;
        this.dataStore.fetchData(url)
            .then(data =>{
                let showData =`初次数据加载时间: ${new Date(data.timestamp)}\n${JSON.stringify(data.data)}`;
                this.setState({
                    showText:showData
                })
            })
            .catch(error => {
              error && console.log(error.toString());
            })
    }


    render() {
        const {navigation} = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>离线缓存框架</Text>
                <View style={styles.search}>
                    <TextInput
                        style={styles.input}
                        onChangeText={text=>{
                            this.value = text;
                        }}
                    />
                </View>
                <Text
                    onPress={()=> {
                        this.loadData();
                    }}
                >获取</Text>

                <Text style={styles.textContent}>{ this.state.showText }</Text>

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    input: {
        height: 40,
        width:300,
        borderColor:'black',
        borderWidth:1,
        marginRight: 10,
    },
    textContent:{
        flexDirection:'row',
        alignItems:'center',
        padding:10
    },
    search:{
        flexDirection: 'row',
        justifyContent:'center',
    },
    button:{
        width: 100,
        height: 30,
    },



});