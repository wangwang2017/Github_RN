/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View,TextInput,ScrollView} from 'react-native';
import {connect} from "react-redux";
import actions from '../action/index'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class FetchDemoPage extends Component<Props> {
  constructor(props){
    super(props);
    this.state={
      showText:''
    }
  }
  loadData() {
    let url = `https://api.github.com/search/repositories?q=${this.searchKey}`;
    fetch(url)
        .then(response =>
            {
                if (response.ok){
                    return response.text();
                }
            }
        )
        .then(responseText => {
          this.setState({
            showText: responseText
          })
        })
        .catch(e=>{
            this.setState({
                showText:e.toString()
            })
        })
  }
  

  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>FetchDemoPage</Text>
        <View style={styles.search}>
            <TextInput
                style={styles.input}
                onChangeText={text=>{
                  this.searchKey = text;
                }}
            />
            <Button
                style={styles.button}
                title='获取'
                onPress={ () => {
                    this.loadData();
                }}
            />
        </View>
          <ScrollView style={styles.scrollview}>
            <Text style={styles.textContent}>{ this.state.showText }</Text>
          </ScrollView>
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
    scrollview:{
      padding:10
    }

});


