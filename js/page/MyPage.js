/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,TouchableOpacity,ScrollView} from 'react-native';
import NavigationUtil from "../navigation/NavigationUtil";
import NavigationBar from "../common/NavigationBar";
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MORE_MENU} from "../common/More_Menu";
import GlobalStyles from "../res/styles/GlobalStyles";
import ViewUtil from "../util/ViewUtil";

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
const THEME_COLOR ='#678';

type Props = {};
export default class MyPage extends Component<Props> {


    onClick(menu){
        let RouteName,params = {};
        switch (menu) {
            case MORE_MENU.Tutorial:
                RouteName = 'WebviewPage';
                params.title = '教程';
                params.url = 'https://coding.m.imooc.com/classindex.html?cid=89';
                break;
            case MORE_MENU.About:
                RouteName = 'AboutPage';
                params.title = '关于';
                break;
        }
        if (RouteName){
            NavigationUtil.goPage(params,RouteName);
        }
    }

    getItem(menu){
        return ViewUtil.getMenuItem(() => this.onClick(menu),menu,THEME_COLOR);
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
        />;

    const {navigation} = this.props;
    return (
      <View style={GlobalStyles.root_container}>
          {navigationBar}
          <ScrollView>
              <TouchableOpacity
                  style={styles.item}
                  onPress={() => this.onClick(MORE_MENU.About)}
              >
                  <View style={styles.about_left}>
                      <Ionicons
                          name={MORE_MENU.About.icon}
                          size={40}
                          style={{
                              marginRight: 10,
                              color: THEME_COLOR,
                          }}
                      />
                      <Text>GitHub Popular</Text>
                  </View>
                  <Ionicons
                      name={'ios-arrow-forward'}
                      size={16}
                      style={{
                          marginRight: 10,
                          alignSelf: 'center',
                          color: THEME_COLOR,
                      }}/>
              </TouchableOpacity>
              <View style={GlobalStyles.line}/>
              {this.getItem(MORE_MENU.Tutorial)}

              <Text style={styles.groupTitle}>趋势管理</Text>
              {this.getItem(MORE_MENU.Custom_Language)}
              <View style={GlobalStyles.line}/>
              {this.getItem(MORE_MENU.Sort_Language)}

              <Text style={styles.groupTitle}>最热管理</Text>
              {this.getItem(MORE_MENU.Custom_Key)}
              <View style={GlobalStyles.line}/>
              {this.getItem(MORE_MENU.Sort_Key)}
              <View style={GlobalStyles.line}/>
              {this.getItem(MORE_MENU.Remove_Key)}

              <Text style={styles.groupTitle}>设置</Text>
              {this.getItem(MORE_MENU.Custom_Theme)}
              <View style={GlobalStyles.line}/>
              {this.getItem(MORE_MENU.About_Author)}
              <View style={GlobalStyles.line}/>
              {this.getItem(MORE_MENU.Feedback)}
          </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:30
    },
    about_left: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    item: {
        backgroundColor: 'white',
        padding: 10,
        height: 90,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    groupTitle: {
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 5,
        fontSize: 12,
        color: 'gray'
    }
});
