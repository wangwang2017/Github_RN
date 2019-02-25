/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Provider} from 'react-redux';
import AppNavigator from './navigation/AppNavigators';
import store from './store';

import {Platform, StyleSheet, Text, View} from 'react-native';



type Props = {};
export default class App extends Component<Props> {
  render() {
    return <Provider store={store}>
      <AppNavigator/>
    </Provider>
  }
}

