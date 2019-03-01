import {TouchableOpacity, View,StyleSheet,Text} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React from "react";

export default class ViewUtil{

    /**
     *
     * @param callback 单击Item的回调
     * @param text  显示的文本
     * @param color 图标着色
     * @param Icons react-native-vector-icons组件
     * @param icon  左侧图标
     * @param expandableIco 右侧图标
     */
    static getSettingItem(callback,text,color,Icons,icon,expandableIco){
        return(<TouchableOpacity
                onPress={callback}
                style={styles.setting_item_container}
            >
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                    {Icons && icon ?
                        <Icons
                            name={icon}
                            size={16}
                            style={{color: color, marginRight: 10}}
                        /> :
                        <View style={{opacity: 1, width: 16, height: 16, marginRight: 10,}}/>
                    }
                    <Text>{text}</Text>
                </View>
                <Ionicons
                    name={expandableIco ? expandableIco : 'ios-arrow-forward'}
                    size={16}
                    style={{
                        marginRight: 10,
                        alignSelf: 'center',
                        color: color || 'black',
                    }}/>
            </TouchableOpacity>
        )
    }

    /**
     * 获取设置页的Item
     * @param callBack 单击item的回调
     * @param menu @MORE_MENU
     * @param color 图标着色
     * @param expandableIco 右侧图标
     * @return {XML}
     */
    static getMenuItem(callBack, menu, color, expandableIco) {
        return ViewUtil.getSettingItem(callBack, menu.name, color, menu.Icons, menu.icon, expandableIco)
    }


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

const styles = StyleSheet.create({
    setting_item_container: {
        backgroundColor: 'white',
        padding: 10, height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
});