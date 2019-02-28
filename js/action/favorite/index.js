import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {_projectModels, handleData} from '../ActionUtil'
import FavoriteDao from "../../expand/dao/FavoriteDao";
import ProjectModel from "../../mo/ProjectModel";
/**
 *
 * @param flag
 * @param favoriteDao
 * @returns {Function}
 */
export function onLoadFavoriteData(flag,isShowLoading){
    return dispatch =>{
        if (isShowLoading) {
            dispatch({type:Types.FAVORITE_LOAD_DATA,storeName:flag});
        }
        new FavoriteDao(flag).getAllItems()
            .then(items =>{
                let resultData = [];
                for (let i = 0,len = items.length; i < len; i++) {
                    resultData.push(new ProjectModel(items[i],true));
                }
                dispatch({type:Types.FAVORITE_LOAD_SUCCESS,projectModels:resultData,storeName:flag});
            })
            .catch(e =>{
                console.log(e);
                dispatch({type:Types.FAVORITE_LOAD_FAIL,error:e,storeName:flag});
            })
    }
}

/**
 *
 * @param storeName
 * @param pageIndex 第几页
 * @param pageSize 每页展示条数
 * @param dataArray 原始数据
 * @param callback 回调函数，可以通过回调函数来向调用页面通信：比如异常信息展示，没有更多等待
 */
export function onLoadMorePopular(storeName,pageIndex,pageSize,dataArray = [], favoriteDao,callback){
    return dispatch =>{
        setTimeout(() => {
            if ((pageIndex - 1) * pageSize >= dataArray.length) {
                if (typeof callback === 'function') {
                    callback('no more')
                }
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName: storeName,
                    pageIndex: --pageIndex,
                    projectModels: dataArray
                })
            }else{
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
                _projectModels(dataArray.slice(0,max),favoriteDao,data=>{
                    dispatch({
                        type:Types.POPULAR_LOAD_MORE_SUCCESS,
                        storeName,
                        pageIndex,
                        projectModels:data,
                    })
                })

            }
        },500);
    }
}

