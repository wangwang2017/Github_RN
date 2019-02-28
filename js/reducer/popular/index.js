import Types from '../../action/types'

const defaultState = {

}

/**
 * popular:{
 *     java:{
 *         items:[],
 *         isLoading:false
 *     },
 *     ios:{
 *         items:[],
 *         isLoading:false
 *     }
 *     ....
 * }
 *  0.state树，横向扩展
 *  1.如何动态的设置store，和动态的获取store（难点：storeKey不固定）；
 * @param state
 * @param action
 * @returns {{theme: ({comment: string, content: string, prop: string, tag: string, value: string}|onAction|theme|{tintColor, updateTime}|string|*)}}
 */

export default function onAction(state= defaultState, action) {
    switch(action.type){
        case Types.POPULAR_REFRESH_SUCCESS:
            return{
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    items:action.items,//原始数据
                    projectModels:action.projectModels,//此次要展示的数据
                    isLoading:false,
                    hideLoadingMore:false,
                    pageIndex:action.pageIndex
                }
            };
        case Types.POPULAR_REFRESH:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading:true,
                    hideLoadingMore:true,
                }
            };
        case Types.POPULAR_REFRESH_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading:false,
                }
            };
        case Types.POPULAR_LOAD_MORE_SUCCESS:
            return {
                ...state,//延展操作符也可以使用Object.assign
                [action.storeName]:{
                    ...state[action.storeName],
                    projectModels:action.projectModels,
                    hideLoadingMore:false,
                    pageIndex:action.pageIndex,
                }
            };
        case Types.POPULAR_LOAD_MORE_FAIL:
            return {
                ...state,//延展操作符也可以使用Object.assign
                [action.storeName]:{
                    ...state[action.storeName],
                    projectModels:action.projectModels,
                    hideLoadingMore:true,
                    pageIndex:action.pageIndex,
                }
            };
        case Types.POPULAR_FLUSH_FAVORITE:
            return {
                ...state,//延展操作符也可以使用Object.assign
                [action.storeName]:{
                    ...state[action.storeName],
                    projectModels:action.projectModels,
                }
            };
        default:
            return state;
    }
}