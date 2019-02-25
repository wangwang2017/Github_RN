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

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});
const KEY = "saveKey";
type Props = {};
export default class AsyncStorageDemoPage extends Component<Props> {
    constructor(props){
        super(props);
        this.state={
            showText:''
        }
    }



    render() {
        const {navigation} = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>AsyncStorageDemoPage</Text>
                <View style={styles.search}>
                    <TextInput
                        style={styles.input}
                        onChangeText={text=>{
                            this.value = text;
                        }}
                    />
                </View>
                <View style={styles.input_container}>
                    <Text
                        onPress={()=> {
                            this.doSave();
                        }}
                    >保存</Text>
                    <Text
                        onPress={()=> {
                            this.getAsyncStorage();
                        }}
                    >获取</Text>
                    <Text
                        onPress={()=> {
                            this.doRemove();
                        }}
                    >删除</Text>
                </View>
                <ScrollView style={styles.scrollview}>
                    <Text style={styles.textContent}>{ this.state.showText }</Text>
                </ScrollView>
            </View>
        );
    }

    async doSave() {
        //用法1
        AsyncStorage.setItem(KEY, this.value, error => {
            error && console.log(error.toString());
        })
        // //用法2
        // AsyncStorage.setItem(KEY, this.value)
        //     .catch(error => {
        //         error && console.log(error.toString());
        //     });
        // //用法3
        // try {
        //     await AsyncStorage.setItem(KEY, this.value);
        // } catch (e) {
        //     e && console.log(e.toString());
        // }
    }

    async getAsyncStorage() {
        AsyncStorage.getItem(KEY, (error, value) => {
            this.setState({
                showText: value
            });
            console.log(value);
            error && console.log(error.toString());
        });

        // //用法2
        // AsyncStorage.getItem(KEY)
        //     .then(value => {
        //         this.setState({
        //             showText: value
        //         });
        //         console.log(value);
        //     })
        //     .catch(error => {
        //         error && console.log(error.toString());
        //     });
        // //用法3
        // try {
        //     const value = await AsyncStorage.getItem(KEY);
        //     this.setState({
        //         showText: value
        //     });
        //     console.log(value);
        // } catch (e) {
        //     e && console.log(e.toString());
        // }
    }

    async doRemove() {
        //用法1
        AsyncStorage.removeItem(KEY, error => {
            error && console.log(error.toString());
        })

        // //用法2
        // AsyncStorage.removeItem(KEY)
        //     .catch(error => {
        //         error && console.log(error.toString());
        //     })
        //
        // //用法3
        // try {
        //     await AsyncStorage.removeItem(KEY);
        // } catch (e) {
        //     error && console.log(error.toString());
        // }
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
    scrollview:{
        padding:10
    },
    input_container:{
        flexDirection: 'row',
        alignItems:'center',
         justifyContent:'space-around'
    }

});