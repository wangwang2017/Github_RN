/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View,TouchableOpacity} from 'react-native';
import NavigationUtil from "../navigation/NavigationUtil";
import NavigationBar from "../common/NavigationBar";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
const THEME_COLOR ='#678';

type Props = {};
export default class MyPage extends Component<Props> {

    getRightButton(){
        return<View style={{flexDirection:'row'}}>
            <TouchableOpacity
                onPress={()=>{

                }}
            >
                <View style={{padding:5,marginLeft:8}}>
                    <Feather
                        name={'search'}
                        size={24}
                        style={{color:'white'}}
                    />
                </View>
            </TouchableOpacity>
        </View>
    }

    getLeftButton(callBack){
        return<View style={{padding:8,paddingLeft:12}}>
            <TouchableOpacity
                onPress={callBack}
            >
                <Ionicons
                    name={'ios-arrow-back'}
                    size={26}
                    style={{color:'white'}}
                />
            </TouchableOpacity>
        </View>
    }


  render() {
    let statusBar = {
        backgroundColor:THEME_COLOR,
        barStyle:'light-content',
    };
    let navigationBar =
        <NavigationBar
            title={'我的'}
            statusBar={statusBar}
            style={{backgroundColor:THEME_COLOR}}
            rightButton={this.getRightButton()}
            leftButton={this.getLeftButton()}
        />;

    const {navigation} = this.props;
    return (
      <View style={styles.container}>
          {navigationBar}

          <View style={styles.content}>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    },
    content: {
       flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:20,
    },

});
