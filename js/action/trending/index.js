import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {handleData} from '../ActionUtil'
/**
 *
 * @param storeName
 * @param url
 * @param pageSize
 * @returns {Function}
 */
export function onRefreshTrending(storeName,url,pageSize){
    return dispatch =>{
        dispatch({type:Types.TRENDING_REFRESH,storeName});
        let dataStore = new DataStore();
        dataStore.fetchData(url,FLAG_STORAGE.flag_trending)
            .then(data =>{
                handleData(Types.TRENDING_REFRESH_SUCCESS,dispatch,storeName,data,pageSize)
            })
            .catch(error =>{
                console.log(error)
                dispatch({
                    type:Types.POPULAR_REFRESH_FAIL,
                    storeName,
                    error
                });
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
export function onLoadMoreTrending(storeName,pageIndex,pageSize,dataArray = [], callback){
    return dispatch =>{
        setTimeout(() => {
            if ((pageIndex - 1) * pageSize >= dataArray.length) {
                if (typeof callback === 'function') {
                    callback('no more')
                }
                dispatch({
                    type: Types.TRENDING_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName: storeName,
                    pageIndex: --pageIndex,
                    projectModels: dataArray
                })
            }else{
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
                dispatch({
                    type:Types.TRENDING_LOAD_MORE_SUCCESS,
                    storeName,
                    pageIndex,
                    projectModels:dataArray.slice(0, max),
                })
            }
        },500);
    }
}

