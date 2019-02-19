export default class NavigationUtil{
    /**
     * goPage
     * @param params 要传递的参数
     * @param page 要跳转的页面
     */
    static goPage(params,page){
        const navigation = NavigationUtil.navigation;
        if(!navigation){
            console.log('naviagtion can not be null')
            return;
        }
        navigation.navigate(page,{
            ...params
        });
    }


    /**
     * 返回首页
     * @param params
     */
    static resetToHomePage(params){
        const {navigation} = params;
        navigation.navigate("Main");
    }
    /**
     * 返回上一页
     * @param navigaiton
     */
    static goBack(navigation){
        navigation.goBack();
    }
}