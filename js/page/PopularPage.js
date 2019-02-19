/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {
  createMaterialTopTabNavigator,
  createAppContainer
} from "react-navigation";
import {Platform, StyleSheet, Text, View} from 'react-native';
import NavigationUtil from '../navigation/NavigationUtil'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class PopularPage extends Component<Props> {
  render() {
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator({
          PopularTab1:{
            screen:PopularTab,
            navigationOptions:{
              title:'Tab1',
            }
          },
          PopularTab2:{
            screen:PopularTab,
            navigationOptions:{
              title:'Tab2',
            }
          },
          PopularTab3:{
            screen:PopularTab,
            navigationOptions:{
              title:'Tab3',
            }
          }
    }));
    return <View style={{flex:1,marginTop:1}}>
        <TabNavigator/>
      </View>

  }
}

class PopularTab extends Component<Props> {
  render() {
    const {tabLabel} = this.props;
    return (
        <View style={styles.container}>
          <Text style={styles.welcome}>{tabLabel}</Text>
          <Text onPress={() => {
            NavigationUtil.goPage({
              navigation:this.props.navigation
            },"DetailPage")
          }} >跳转到详情页</Text>
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  }

});
