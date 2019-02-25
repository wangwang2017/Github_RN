import Types from '../types';
import DataStore from '../../expand/dao/DataStore';

/**
 *
 * @param storeName
 * @param url
 * @param pageSize
 * @returns {Function}
 */
export function onRefreshPopular(storeName,url,pageSize){
    return dispatch =>{
        dispatch({type:Types.POPULAR_REFRESH,storeName});
        let dataStore = new DataStore();
        dataStore.fetchData(url)
            .then(data =>{
                handleData(dispatch,storeName,data,pageSize)
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
export function onLoadMorePopular(storeName,pageIndex,pageSize,dataArray = [], callback){
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
                dispatch({
                    type:Types.POPULAR_LOAD_MORE_SUCCESS,
                    storeName,
                    pageIndex,
                    projectModels:dataArray.slice(0, max),
                })
            }
        },500);
    }
}

function handleData(dispatch,storeName,data,pageSize) {
    let fixItems =[];
    if (data && data.data && data.data.items){
        fixItems = data.data.items;
    }
    dispatch({
        type:Types.POPULAR_REFRESH_SUCCESS,
        items:fixItems,
        projectModels: pageSize > fixItems.length?fixItems:fixItems.slice(0,pageSize),//第一次要加载的数据
        storeName,
        pageIndex:1
    })
}