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
import {DeviceInfo,FlatList, Platform, StyleSheet, Text, View,RefreshControl,ActivityIndicator,TouchableOpacity,DeviceEventEmitter} from 'react-native';
import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast';
import TrendingItem from '../common/TrendingItem';
import actions from '../action/index';
import NavigationBar from '../common/NavigationBar';
import TrendingDialog,{TimeSpans} from "../common/TrendingDialog";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NavigationUtil from "../navigation/NavigationUtil";
import FavoriteUtil from "../util/FavoriteUtil";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteDao from "../expand/dao/FavoriteDao";
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";


const URL = 'https://github.com/trending/';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);
const EVENT_TYPE_TIME_SPAN_CHANGE = "EVENT_TYPE_TIME_SPAN_CHANGE";

type Props = {};
export default class TrendingPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.tabNames = ['All', 'C',  'C#',  'PHP', 'Python', 'JavaScript'];
    this.state = {
      timeSpan:TimeSpans[0],
    }
  }

  _genTabs(){
    const tabs = {};
    this.tabNames.forEach((item,index) =>{
      tabs[`tab${index}`] ={
        screen:props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item} />,
        navigationOptions:{
          title:item
        }
      }
    })
    return tabs;
  }
  onSelectTimeSpan(tab){
      this.dialog.dismiss();
      this.setState({
        timeSpan:tab
      })
      DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE,tab)
  }
  renderTrendingDialog() {
    return <TrendingDialog
        ref={dialog => this.dialog = dialog}
        onSelect={tab => this.onSelectTimeSpan(tab)}
    />
  }

  renderTitleView(){
    return <View>
      <TouchableOpacity
          underlayColor='transparent'
          onPress={() => this.dialog.show()}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{
            fontSize: 18,
            color: '#FFFFFF',
            fontWeight: '400'
          }}>趋势 {this.state.timeSpan.showText}</Text>
          <MaterialIcons
              name={'arrow-drop-down'}
              size={22}
              style={{color: 'white'}}
          />
        </View>
      </TouchableOpacity>
    </View>
  }
    _tabNav() {
        if (!this.tabNav) {//topNav存在了  即不render了 提高效率
            this.tabNav = createAppContainer(createMaterialTopTabNavigator(
                this._genTabs(), {
                    tabBarOptions: {
                        tabStyle: styles.tabStyle,
                        upperCaseLabel: false,//标签小写
                        scrollEnabled: true,//选项卡滚动
                        style: {
                            backgroundColor: '#567',
                            height: 35 //安卓适配 导航栏开启滑动效果初次加载时的闪烁效果
                        },
                        indicatorStyle: styles.indicatorStyle,//标签指示器样式
                        labelStyle: styles.labelStyle,//文字的样式
                    }
                }
            ));
        }
        return this.tabNav;

    }

  render() {
    let statusBar={
      backgroundColor:'#678',
      barStyle:'light-content'

    }
    let navigationBar = <NavigationBar
        titleView={this.renderTitleView()}
        statusBar={statusBar}
        style={{backgroundColor:'#678'}}
    />
    const TabNavigator = this._tabNav();
    return <View style={{flex: 1,marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}}>
      {navigationBar}
      <TabNavigator/>
      {this.renderTrendingDialog()}
    </View>
  }
}
const pageSize = 10;//设为常量，防止修改
class TrendingTab extends Component<Props> {
  constructor(props){
    super(props);
    const {tabLabel,timeSpan} = this.props;
    this.storeName = tabLabel;
    this.timeSpan = timeSpan;
  }

  componentDidMount(): void {
    this.loadData();
    this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE,(timeSpan) =>{
        this.timeSpan = timeSpan;
        this.loadData();
      });
      EventBus.getInstance().addListener(EventTypes.favorite_changed_trending,this.favoriteChangeListener = () =>{
          this.isFavoriteChanged = true;
      });
      EventBus.getInstance().addListener(EventTypes.bottom_tab_select,this.bottomTabSelectListener = (data) =>{
          if (data.to === 1 && this.isFavoriteChanged) {
              this.loadData(null, true);
          }
      });
  }



  componentWillUnmount(): void {
      if (this.timeSpanChangeListener){
          this.timeSpanChangeListener.remove();
      }
      EventBus.getInstance().removeListener(this.favoriteChangeListener);
      EventBus.getInstance().removeListener(this.bottomTabSelectListener);
  }


    loadData(loadMore,refreshFavorite) {
    const {onRefreshTrending, onLoadMoreTrending,onFlushTrendingFavorite} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMoreTrending(this.storeName,++store.pageIndex,pageSize, store.items,favoriteDao,callback =>{
        this.refs.toast.show('没有更多了');
      });
    }else if(refreshFavorite){
        onFlushTrendingFavorite(this.storeName,store.pageIndex, pageSize,store.items,favoriteDao);
    } else{
      onRefreshTrending(this.storeName, url,pageSize,favoriteDao);
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
    return URL + key + '?' +this.timeSpan.searchText;
  }



  renderItem(data){
    const item = data.item;
    return <TrendingItem
        projectModels={item}
        onSelect ={(callback) =>{
            NavigationUtil.goPage({
                projectModels: item,
                flag:FLAG_STORAGE.flag_trending,
                callback
            },'DetailPage')
        }}
        onFavorite={(item,isFavorite) => FavoriteUtil.onFavorite(favoriteDao,item,isFavorite,FLAG_STORAGE.flag_trending)}
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
  onRefreshTrending:(storeName,url, pageSize,favoriteDao) => dispatch(actions.onRefreshTrending(storeName,url,pageSize,favoriteDao)),
  onLoadMoreTrending:(storeName,pageIndex, pageSize,items,favoriteDao,callback) => dispatch(actions.onLoadMoreTrending(storeName,pageIndex, pageSize,items,favoriteDao,callback)),
  onFlushTrendingFavorite: (storeName,pageIndex, pageSize,items,favoriteDao) =>  dispatch(actions.onFlushTrendingFavorite(storeName,pageIndex, pageSize,items,favoriteDao))
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
    marginTop:5,
  },
  ActivityIndicatorStyle:{
    color:'red',
    margin:10
  }
});
