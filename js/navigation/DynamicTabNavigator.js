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
  createBottomTabNavigator,
  createAppContainer
} from "react-navigation";
import NavigationUtil from '../navigation/NavigationUtil';
import {Platform, StyleSheet, Text, View} from 'react-native';
import PopularPage from '../page/PopularPage';
import TrendingPage from '../page/TrendingPage';
import FavoritePage from '../page/FavoritePage';
import MyPage from '../page/MyPage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { BottomTabBar } from 'react-navigation-tabs';
import {connect} from 'react-redux';


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
const TABS = {//这里配置路由页面
    PopularPage:{
        screen:PopularPage,
        navigationOptions:{
            tabBarLabel:'最热',
            tabBarIcon:({tintColor,focused}) =>(
                <MaterialIcons
                    name={'whatshot'}
                    size={26}
                    style={{color:tintColor}}
                />
            )
        }
    },
    TrendingPage:{
        screen:TrendingPage,
        navigationOptions:{
            tabBarLabel:'趋势',
            tabBarIcon:({tintColor,focused}) =>(
                <Ionicons
                    name={'md-trending-up'}
                    size={26}
                    style={{color:tintColor}}
                />
            )
        }
    },
    FavoritePage:{
        screen:FavoritePage,
        navigationOptions:{
            tabBarLabel:'收藏',
            tabBarIcon:({tintColor,focused}) =>(
                <MaterialIcons
                    name={'favorite'}
                    size={26}
                    style={{color:tintColor}}
                />
            )
        }
    },
    MyPage:{
        screen:MyPage,
        navigationOptions:{
            tabBarLabel:'我的',
            tabBarIcon:({tintColor,focused}) =>(
                <Entypo
                    name={'user'}
                    size={26}
                    style={{color:tintColor}}
                />
            )
        }
    }
}

class DynamicTabNavigator extends Component<Props> {
    constructor(props){
        super(props);
        console.disableYellowBox = true;
    }

  _tabNavigator(){
        if (this.TABS){
            return this.TABS;
        }
        const {PopularPage,TrendingPage,FavoritePage,MyPage} = TABS;
        const tabs = {PopularPage,TrendingPage,FavoritePage,MyPage};//根据需要来定制显示tab
        PopularPage.navigationOptions.tabBarLabel='最热';  //动态配置tab属性
        return this.TABS = createAppContainer(createBottomTabNavigator(tabs,{
                    tabBarComponent:props =>{
                        return <TabBarComponent theme={this.props.theme}  {...props}/>
                    }
                }
            ))
  }
  render() {
      const {theme} = this.props;
      const Tab = this._tabNavigator();
      return <Tab/>
  }
}

class TabBarComponent extends React.Component{
    constructor(props){
        super(props);
        this.theme={
            tintColor:props.activeTintColor,
            updateTime:new Date().getTime(),
        }
    }
    render(){

        return <BottomTabBar
            {...this.props}
            activeTintColor = {this.props.theme}
        />
    }
}



const mapStateToProps = state => ({
    theme:state.theme.theme,
});

export default connect(mapStateToProps)(DynamicTabNavigator);


