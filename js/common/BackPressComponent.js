import React,{PropTypes} from "react";
import {BackHandler} from "react-native";

export default class BackPressComponent{
    constructor(props){
        this._hardwareBackPress = this.onHardwareBackPress.bind(this);
        this.props = props;
    }

    componentDidMount(): void {
        if (this.props.backPress) BackHandler.addEventListener("hardwareBackPress",this.onBackPress);
    }

    componentWillUnmount(): void {
        if (this.props.backPress) BackHandler.removeEventListener("hardwareBackPress",this.onBackPress);
    }

    onHardwareBackPress(e){
        return this.props.backPress(e);
    }
}