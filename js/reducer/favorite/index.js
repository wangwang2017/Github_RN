import Types from '../../action/types'

const defaultState = {

}

/**
 * favorite:{
 *     popular:{
 *         projectModels:[],
 *         isLoading:false
 *     },
 *     trending:{
 *         projectModels:[],
 *         isLoading:false
 *     }
 *
 * }
 *  0.state树，横向扩展
 *  1.如何动态的设置store，和动态的获取store（难点：storeKey不固定）；
 * @param state
 * @param action
 * @returns {{theme: ({comment: string, content: string, prop: string, tag: string, value: string}|onAction|theme|{tintColor, updateTime}|string|*)}}
 */

export default function onAction(state= defaultState, action) {
    switch(action.type){
        case Types.FAVORITE_LOAD_DATA:
            return{
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading:true,
                }
            };
        case Types.FAVORITE_LOAD_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModels:action.projectModels,
                    isLoading:false,

                }
            };
        case Types.FAVORITE_LOAD_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModels:action.projectModels,
                    isLoading:false,
                }
            };
        default:
            return state;
    }
}