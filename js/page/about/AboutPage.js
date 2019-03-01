/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {View} from 'react-native';
import NavigationUtil from "../../navigation/NavigationUtil";

import {MORE_MENU} from "../../common/More_Menu";
import GlobalStyles from "../../res/styles/GlobalStyles";
import ViewUtil from "../../util/ViewUtil";
import config from "../../res/data/config";
import AboutCommon, {FLAG_ABOUT} from "./AboutCommon";


const THEME_COLOR ='#678';

type Props = {};
export default class AboutPage extends Component<Props> {

    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.aboutCommon = new AboutCommon({
                ...this.params,
                navigation: this.props.navigation,
                flagAbout: FLAG_ABOUT.flag_about,
            }, data => this.setState({...data})
        );
        this.state = {
            data: config,
        }
    }

    render() {
        const content = <View>
            {this.getItem(MORE_MENU.Tutorial)}
            <View style={GlobalStyles.line}/>
            {this.getItem(MORE_MENU.About_Author)}
            <View style={GlobalStyles.line}/>
            {this.getItem(MORE_MENU.Feedback)}
        </View>;
        return this.aboutCommon.render(content, this.state.data.app);
    }

    onClick(menu){
        let RouteName,params = {};
        switch (menu) {

        }
        if (RouteName){
            NavigationUtil.goPage(params,RouteName);
        }
    }

    getItem(menu){
        return ViewUtil.getMenuItem(() => this.onClick(menu),menu,THEME_COLOR);
    }
}


