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
import {DeviceInfo,FlatList, Platform, StyleSheet, Text, View,RefreshControl,ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast';
import TrendingItem from '../common/TrendingItem';
import actions from '../action/index';
import NavigationBar from '../common/NavigationBar';


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
      'Double tap R on your keyboard to reload,\n' +
      'Shake or press menu button for dev menu',
});

const URL = 'https://github.com/trending/';
const QUERY_STR = '&sort=stars';

type Props = {};
export default class TrendingPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.tabNames = ['All', 'C',  'C#',  'PHP', 'Python', 'JavaScript'];

  }

  _genTabs(){
    const tabs = {};
    this.tabNames.forEach((item,index) =>{
      tabs[`tab${index}`] ={
        screen:props => <TrendingTabPage {...props} tabLabel={item} />,
        navigationOptions:{
          title:item
        }
      }
    })
    return tabs;
  }
  render() {
    let statusBar={
      backgroundColor:'#678',
      barStyle:'light-content'

    }
    let navigationBar = <NavigationBar
        title={'趋势'}
        statusBar={statusBar}
        style={{backgroundColor:'#678'}}
    />
    const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
        this._genTabs(),{
          tabBarOptions:{
            tabStyle:styles.tabStyle,
            upperCaseLabel:false,//标签小写
            scrollEnabled:true,//选项卡滚动
            style:{
              backgroundColor: '#567',
              height:30 //安卓适配 导航栏开启滑动效果初次加载时的闪烁效果
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
const pageSize = 10;//设为常量，防止修改
class TrendingTab extends Component<Props> {
  constructor(props){
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
  }

  componentDidMount(): void {
    this.loadData();
  }

  loadData(loadMore) {
    const {onRefreshTrending, onLoadMoreTrending} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMoreTrending(this.storeName,++store.pageIndex,pageSize, store.items,callback =>{
        this.refs.toast.show('没有更多了');
      });
    }else{
      onRefreshTrending(this.storeName, url,pageSize);
    }
  }

  /**
   * 获取与当前页面有关的数据
   * @returns {*}
   * @private
   */
  _store() {
    const {trending} = this.props;
    let store = trending[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [],//要显示的数据
        hideLoadingMore: true,//默认隐藏加载更多
      }
    }
    return store;
  }

  genFetchUrl(key){
    return URL + key + '?since=daily';
  }

  renderItem(data){
    const item = data.item;
    return <TrendingItem
        item={item}
        onSelect ={() =>{

        }}
    />

  }

  genIndicator() {
    return this._store().hideLoadingMore ? null :
        <View style={styles.indicatorContainer}>
          <ActivityIndicator
              style={styles.ActivityIndicatorStyle}
          />
          <Text>正在加载更多</Text>
        </View>
  }

  render() {
    let store = this._store();
    return (
        <View style={styles.container}>
          <FlatList
              data={store.projectModels}
              renderItem={data => this.renderItem(data)}
              keyExtractor={item =>"" +(item.id || item.fullName)}
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
              ListFooterComponent={ () => this.genIndicator() }
              onEndReached={() => {
                setTimeout(() => {
                  if (this.canLoadMore) {
                    this.loadData(true);
                    this.canLoadMore = false;
                  }
                }, 100);
              }}
              onMomentumScrollBegin={() =>{
                this.canLoadMore = true; //fix 初始化滚动也调用onEndReached的问题
              }}
              onEndReachedThreshold={0.5}

          />
          <Toast ref={'toast'}
                 position={'center'}
          />
        </View>
    );
  }


}
const mapStateToProps = state => ({
  trending:state.trending
});

const mapDispatchToProps = dispatch => ({
  onRefreshTrending:(storeName,url, pageSize) =>dispatch(actions.onRefreshTrending(storeName,url,pageSize)),
  onLoadMoreTrending:(storeName,pageIndex, pageSize,items,callback) =>dispatch(actions.onLoadMoreTrending(storeName,pageIndex, pageSize,items,callback))
});
const TrendingTabPage = connect(mapStateToProps,mapDispatchToProps)(TrendingTab);

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
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
    margin: 0,
  },
  ActivityIndicatorStyle:{
    color:'red',
    margin:10
  }
});
