import {TouchableOpacity, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React from "react";

export default class ViewUtil{


    /**
     * 左侧返回按钮
     * @param callBack
     * @returns {*}
     */
    static getLeftButton(callBack){
        return<View style={{padding:8,paddingLeft:12}}>
            <TouchableOpacity
                onPress={callBack}
            >
                <Ionicons
                    name={'ios-arrow-back'}
                    size={26}
                    style={{color:'white'}}
                />
            </TouchableOpacity>
        </View>
    }


    /**
     * 分享按钮
     * @param callBack
     */
    static getShareButton(callBack){
       return<TouchableOpacity
                underlayColor={'transparent'}
                onPress={callBack}
            >
                <Ionicons
                    name={'md-share'}
                    size={20}
                    style={{color:'white',opacity:0.9,marginRight:10}}
                />
            </TouchableOpacity>
    }

}