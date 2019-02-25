/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import NavigationUtil from "../navigation/NavigationUtil";

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class MyPage extends Component<Props> {
  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>MyPage</Text>
        <Button
            title='改变主题色'
            onPress={ () => {
              navigation.setParams({
                theme:{
                  tintColor: 'pink',
                  updateTime: new Date().getTime()
                }
              })
            }}
        />
          <Text
              style={{marginTop:10}}
              onPress={() => {
                  NavigationUtil.goPage({
                      navigation: this.props.navigation
                  }, "DetailPage")
              }}>跳转到详情页</Text>

          <View  style={{marginTop:20}}>
              <Button

                  title={'Fetch的使用'}
                  onPress={() => {
                      NavigationUtil.goPage({
                          navigation: this.props.navigation
                      }, "FetchDemoPage")
                  }}
              />
          </View>
          <View  style={{marginTop:20}}>
              <Button
                  style={{marginTop:20}}
                  title={'缓存的使用'}
                  onPress={() => {
                      NavigationUtil.goPage({
                          navigation: this.props.navigation
                      }, "AsyncStorageDemoPage")
                  }}
              />
          </View>
          <View  style={{marginTop:20}}>
              <Button
                  style={{marginTop:20}}
                  title={'离线缓存框架'}
                  onPress={() => {
                      NavigationUtil.goPage({
                          navigation: this.props.navigation
                      }, "DataStoreDemoPage")
                  }}
              />
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
    welcome:{
        fontSize: 26,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabStyle: {
        minWidth:50
    },
    indicatorStyle:{
        height:2,
        backgroundColor:'white'
    },
    labelStyle:{
        fontSize:13,
        marginTop: 6,
        marginBottom:6
    }

});
