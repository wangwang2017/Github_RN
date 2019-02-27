import {AsyncStorage} from "react-native";

const FAVORITE_KEY_PREFIX = 'favorite_';

export default class FavoriteDao{
    constructor(flag){
        this.favoriteKey = FAVORITE_KEY_PREFIX + flag;
    }

    /**
     * 收藏项目
     * @param key 项目id
     * @param value 收藏的项目
     * @param callback
     */
    saveFavoriteItem(key,value,callback){
        AsyncStorage.setItem(key,value,(error,result) =>{
            if (!error){
                this.updateFavoriteKeys(key,true);
            }
        })
    }

    updateFavoriteKeys(key,isAdd){
        AsyncStorage.getItem(this.favoriteKey,(error,result) =>{
            if (!error){
                let favoriteKeys = [];
                if (result){
                    favoriteKeys = JSON.parse(result);
                }
                let index = favoriteKeys.indexOf(key);
                if (isAdd){//如果是添加且key不存在则添加
                    if (index === -1){
                        favoriteKeys.push(key);
                    }
                } else{//如果是删除且key存在则删除
                    if (index !== -1){
                        favoriteKeys.splice(index,1);
                    }
                }
                AsyncStorage.setItem(this.favoriteKey,JSON.stringify(favoriteKeys));//更新
            }
        });
    }

    /**
     * 界面获取收藏的所有的key
     * @returns {Promise<any> | Promise<*>}
     */
    getFavoriteKeys(){
        return new Promise((resolve,reject) =>{
            AsyncStorage.getItem(this.favoriteKey,(error,result) =>{
                if (!error){
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(error);
                    }
                } else {
                    reject(error);
                }
            });
        });
    }

    /**
     * 取消收藏
     * @param key
     */
    removeFavoriteItem(key){
        AsyncStorage.removeItem(key,(error,result) =>{
            if (!error){
                this.updateFavoriteKeys(key,false);
            }
        });
    }

    /**
     * 获取所有收藏的项目
     * @returns {Promise<any> | Promise<*>}
     */
    getAllItems(){
        return new Promise((resolve,reject) =>{
            this.getFavoriteKeys().then((keys) =>{
                let items= [];
                if (keys){
                    AsyncStorage.multiGet(keys,(err,stores) =>{
                        try {
                            stores.map((result, i, store) => {
                                let key = store[i][0];
                                let value = store[i][1];
                                if (value) items.push(JSON.parse(value));
                            });
                            resolve(items);
                        } catch (e) {
                            reject(e);
                        }
                    });
                }else{
                    resolve(items);
                }
            }).catch((e) =>{
                reject(e);
            })
        })
    }
}