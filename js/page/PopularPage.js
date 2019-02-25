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
import {FlatList, Platform, StyleSheet, Text, View,RefreshControl,ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import Toast from 'react-native-easy-toast';
import PopularItem from '../common/PopularItem';
import actions from '../action/index';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';

type Props = {};
export default class PopularPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.tabNames = ['Java', 'Android', 'Ios', 'React', 'React-Native', 'PHP', 'C', 'C++', 'C#', 'Python'];

    }

    _genTabs(){
        const tabs = {};
        this.tabNames.forEach((item,index) =>{
            tabs[`tab${index}`] ={
                screen:props => <PopularTabPage {...props} tabLabel={item} />,
                navigationOptions:{
                    title:item
                }
            }
        })
        return tabs;
    }
    render() {
        const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
            this._genTabs(),{
                tabBarOptions:{
                    tabStyle:styles.tabStyle,
                    upperCaseLabel:false,//标签小写
                    scrollEnabled:true,//选项卡滚动
                    style:{
                        backgroundColor: '#567'
                    },
                    indicatorStyle:styles.indicatorStyle,//标签指示器样式
                    labelStyle:styles.labelStyle,
                }
            }
        ));
        return <View style={{flex: 1, marginTop: 1}}>
            <TabNavigator/>
        </View>

    }
}
const pageSize = 10;//设为常量，防止修改
class PopularTab extends Component<Props> {
    constructor(props){
        super(props);
        const {tabLabel} = this.props;
        this.storeName = tabLabel;
    }

    componentDidMount(): void {
        this.loadData();
    }

    loadData(loadMore) {
        const {onRefreshPopular, onLoadMorePopular} = this.props;
        const store = this._store();
        const url = this.genFetchUrl(this.storeName);
        if (loadMore) {
            onLoadMorePopular(this.storeName,++store.pageIndex,pageSize, store.items,callback =>{
                this.refs.toast.show('没有更多了');
            });
        }else{
            onRefreshPopular(this.storeName, url,pageSize);
        }
    }

    /**
     * 获取与当前页面有关的数据
     * @returns {*}
     * @private
     */
    _store() {
        const {popular} = this.props;
        let store = popular[this.storeName];
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
        return URL + key + QUERY_STR;
    }

    renderItem(data){
        const item = data.item;
        return <PopularItem
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

        let store = this._store;
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModels}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item =>""+item.id}
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
    popular:state.popular
});

const mapDispatchToProps = dispatch => ({
  onRefreshPopular:(storeName,url, pageSize) =>dispatch(actions.onRefreshPopular(storeName,url,pageSize)),
  onLoadMorePopular:(storeName,pageIndex, pageSize,items,callback) =>dispatch(actions.onLoadMorePopular(storeName,pageIndex, pageSize,items,callback))
});
const PopularTabPage = connect(mapStateToProps,mapDispatchToProps)(PopularTab);

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
        marginTop: 6,
        marginBottom:6
    },
    ActivityIndicatorStyle:{
        color:'red',
        margin:10
    }
});
