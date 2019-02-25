/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import { BackHandler } from 'react-native';
import { NavigationActions } from 'react-navigation';
import NavigationUtil from '../navigation/NavigationUtil';
import DynamicTabNavigator from '../navigation/DynamicTabNavigator';
import {Platform, StyleSheet, Text, View} from 'react-native';
import actions from "../action";
import {connect} from "react-redux";


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
class HomePage extends Component<Props> {

  componentDidMount(): void {
      BackHandler.addEventListener("hardwareBackPress",this.onBackPress);
  }

  componentWillUnmount(): void {
      BackHandler.removeEventListener("hardwareBackPress",this.onBackPress);
  }

  /**
   * 处理android的物理返回键
   *
   * @returns {boolean}
   */

  onBackPress = () =>{
    const {dispatch,nav} = this.props;
    if (nav.routes[1].index ===0){//如果RootNavigator中的MainNavigator的index是1   当前是最上层界面  也就是index是0的时候
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  };

  render() {
      const {theme} = this.props;
      NavigationUtil.navigation = this.props.navigation;
      return <DynamicTabNavigator/>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }

});

const mapStateToProps = state =>({
  nav:state.nav
});

export default connect(mapStateToProps)(HomePage);