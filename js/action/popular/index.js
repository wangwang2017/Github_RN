import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import {_projectModels, handleData} from '../ActionUtil'
/**
 *
 * @param storeName
 * @param url
 * @param pageSize
 * @returns {Function}
 */
export function onRefreshPopular(storeName,url,pageSize,favoriteDao){
    return dispatch =>{
        dispatch({type:Types.POPULAR_REFRESH,storeName});
        let dataStore = new DataStore();
        dataStore.fetchData(url,FLAG_STORAGE.flag_popular)
            .then(data =>{
                handleData(Types.POPULAR_REFRESH_SUCCESS,dispatch,storeName,data,pageSize,favoriteDao)
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
export function onLoadMorePopular(storeName,pageIndex,pageSize,dataArray = [], favoriteDao,callback) {
    return dispatch => {
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
            } else {
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
                _projectModels(dataArray.slice(0, max), favoriteDao, data => {
                    dispatch({
                        type: Types.POPULAR_LOAD_MORE_SUCCESS,
                        storeName,
                        pageIndex,
                        projectModels: data,
                    })
                })

            }
        }, 500);
    }
}



/**
 *
 * @param storeName
 * @param pageIndex 第几页
 * @param pageSize 每页展示条数
 * @param dataArray 原始数据
 * @param favoriteDao
 */
export function onFlushPopularFavorite(storeName, pageIndex, pageSize, dataArray = [], favoriteDao) {
    return dispatch => {
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
        _projectModels(dataArray.slice(0, max), favoriteDao, data => {
            dispatch({
                type: Types.POPULAR_FLUSH_FAVORITE,
                storeName,
                pageIndex,
                projectModels: data,
            })
        })
    }
}


