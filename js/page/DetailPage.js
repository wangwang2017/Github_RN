/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, WebView, DeviceInfo, BackHandler} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import NavigationUtil from '../navigation/NavigationUtil';
import ViewUtil from '../util/ViewUtil';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BackPressComponent from "../common/BackPressComponent";
import {NavigationActions} from "react-navigation";
import FavoriteDao from "../expand/dao/FavoriteDao";

const TRENDING_URL = 'http://github.com/';
type Props = {};
const THEME_COLOR = '#678';

export default class DetailPage extends Component<Props> {
  constructor(props){
    super(props);
    this.params = this.props.navigation.state.params;
    const {projectModels,flag} = this.params;
    this.favoriteDao = new FavoriteDao(flag);
    this.url = projectModels.item.html_url || TRENDING_URL + projectModels.item.fullName;
    const title = projectModels.item.full_name || projectModels.item.fullName;
    this.state={
      title:title,
      url:this.url,
      canGoBack:false,
      isFavorite:projectModels.isFavorite
    };
    this.backPress = new BackPressComponent({backPress:() => this.onBackPress()});
  }

  componentDidMount(): void {
    this.backPress.componentDidMount();
  }

  componentWillUnmount(): void {
    this.backPress.componentWillUnmount();
  }

  /**
   * 处理android的物理返回键
   *
   * @returns {boolean}
   */

  onBackPress() {
    this.onBack();
    return true;
  }


  onBack(){
    if (this.state.canGoBack){
      this.webView.goBack();
    } else{
      NavigationUtil.goBack(this.props.navigation);
    }
  }

  onFavoriteButtonClick(){
    const {projectModels,callback} = this.params;
    const isFavorite = projectModels.isFavorite =! projectModels.isFavorite;
    callback(isFavorite);//更新Item的收藏状态
    this.setState({
      isFavorite:isFavorite,
    });
    let key = projectModels.item.fullName ? projectModels.item.fullName : projectModels.item.id.toString();
    if (projectModels.isFavorite){
      this.favoriteDao.saveFavoriteItem(key,JSON.stringify(projectModels.item))
    } else {
      this.favoriteDao.removeFavoriteItem(key);
    }
  }

  renderRightButton(){
    return(<View style={{flexDirection:'row'}}>
          <TouchableOpacity
              onPress={()=>
                  this.onFavoriteButtonClick()
              }
          >
            <FontAwesome
              name={this.state.isFavorite ? 'star' : 'star-o'}
              size={20}
              style={{color:'white',marginRight:10}}
            />
          </TouchableOpacity>
          {ViewUtil.getShareButton(() => {

          })}
        </View>
      )
  }
  onNavigationStateChange(navState){
      this.setState({
        canGoBack:navState.canGoBack,
        url:navState.url
      })
  }
  render() {
      const titleLayoutStyle = this.state.title.length >20 ? {paddingRight:30} :null;
    let navigationBar = <NavigationBar
        leftButton={ViewUtil.getLeftButton(() => this.onBack())}
        titleLayoutStyle={titleLayoutStyle}
        title={this.state.title}
        style={{backgroundColor:THEME_COLOR}}
        rightButton={this.renderRightButton()}
    />
    return (
      <View style={styles.container}>
        {navigationBar}
        <WebView
          ref={webView => this.webView = webView}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
          source={{uri: this.state.url}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0
  },


});
