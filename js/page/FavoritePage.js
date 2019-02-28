/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component, EventHandler} from 'react';
import {
  createMaterialTopTabNavigator,
  createAppContainer
} from "react-navigation";
import {DeviceInfo,FlatList, Platform, StyleSheet, Text, View,RefreshControl,ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast';
import PopularItem from '../common/PopularItem';
import actions from '../action/index';
import NavigationBar from '../common/NavigationBar';
import NavigationUtil from "../navigation/NavigationUtil";
import BaseItem from '../common/BaseItem';
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import TrendingItem from "../common/TrendingItem";
import EventBus from 'react-native-event-bus';
import EventTypes from "../util/EventTypes";

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
      'Double tap R on your keyboard to reload,\n' +
      'Shake or press menu button for dev menu',
});


type Props = {};
export default class FavoritePage extends Component<Props> {
  constructor(props) {
    super(props);
  }


  render() {
    let statusBar={
      backgroundColor:'#678',
      barStyle:'light-content'

    }
    let navigationBar = <NavigationBar
        title={'收藏'}
        statusBar={statusBar}
        style={{backgroundColor:'#678'}}
    />
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
        {
          'Popular':{
            screen:props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular}/>,//初始化Component时携带默认参数 @https://github.com/react-navigation/react-navigation/issues/2392
            navigationOptions:{
              title:'最热',
            },
          },
          'Trending':{
            screen:props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending}/>,//初始化Component时携带默认参数 @https://github.com/react-navigation/react-navigation/issues/2392
            navigationOptions:{
              title:'趋势',
            },
          },
        },{
          tabBarOptions:{
            tabStyle:styles.tabStyle,
            upperCaseLabel:false,//标签小写
            style:{
              backgroundColor: '#567',
              height:35 //安卓适配 导航栏开启滑动效果初次加载时的闪烁效果
            },
            indicatorStyle:styles.indicatorStyle,//标签指示器样式
            labelStyle:styles.labelStyle,
          }
        }
    ));
    return <View style={{flex: 1,marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}}>
      {navigationBar}
      <TabNavigator/>
    </View>

  }
}

class FavoriteTab extends Component<Props> {
  constructor(props){
    super(props);
    const {flag} = this.props;
    this.storeName = flag;
    this.favoriteDao = new FavoriteDao(flag);
  }

  componentDidMount(): void {
    this.loadData(true);
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select,this.listener = data => {
      if (data.to === 2) {
        this.loadData(false);
      }
    })
  }

  componentWillUnmount() {
    EventBus.getInstance().removeListener(this.listener);
  }

  loadData(isShowLoading) {
    const {onLoadFavoriteData} = this.props;
    onLoadFavoriteData(this.storeName, isShowLoading);
  }

  /**
   * 获取与当前页面有关的数据
   * @returns {*}
   * @private
   */
  _store() {
    const {favorite} = this.props;
    let store = favorite[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [],//要显示的数据
      }
    }
    return store;
  }

  onFavorite(item,isFavorite){
    FavoriteUtil.onFavorite(this.favoriteDao,item,isFavorite,this.props.flag);
    if (this.storeName === FLAG_STORAGE.flag_popular){
      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_popular);
    } else {
      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_trending);
    }
  }


  renderItem(data){
    const item = data.item;
    const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
    return <Item
        projectModels={item}
        onSelect ={(callback) =>{
          NavigationUtil.goPage({
            projectModels: item,
            flag:this.storeName,
            callback
          },'DetailPage')
        }}
        onFavorite={(item,isFavorite) => this.onFavorite(item,isFavorite)}
    />
  }



  render() {
    let store = this._store();
    return (
        <View style={styles.container}>
          <FlatList
              data={store.projectModels}
              renderItem={data => this.renderItem(data)}
              keyExtractor={item => "" +(item.item.id || item.item.fullName)}
              refreshControl={
                <RefreshControl
                    title={'Loading'}
                    titleColor={'red'}
                    colors={['red']}
                    refreshing={store.isLoading}
                    onRefresh={() => this.loadData()}
                    tintColor={'red'}
                />
              }
          />
          <Toast ref={'toast'}
                 position={'center'}
          />
        </View>
    );
  }


}
const mapStateToProps = state => ({
  favorite:state.favorite
});

const mapDispatchToProps = dispatch => ({
  onLoadFavoriteData:(storeName,isShowLoading) =>dispatch(actions.onLoadFavoriteData(storeName,isShowLoading)),

});
const FavoriteTabPage = connect(mapStateToProps,mapDispatchToProps)(FavoriteTab);

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#F5FCFF',
  },
  welcome:{
    fontSize: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabStyle: {
    //minWidth:50
    padding: 0
  },
  indicatorStyle:{
    height:2,
    backgroundColor:'white'
  },
  indicatorContainer:{
    alignItems:'center',
  },
  labelStyle:{
    fontSize:13,
    marginTop:5,
  },
  ActivityIndicatorStyle:{
    color:'red',
    margin:10
  }
});
