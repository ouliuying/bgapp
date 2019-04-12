
import {getDynamicRouterAppModelViewType} from '../../reducers/router'
import {EditViewCMM} from '../cmm/EditViewMM'
export const mapStateToProps=(state,ownProps)=>{
    if(!ownProps){
        ownProps={}
    }
    let routerLocationState=getDynamicRouterAppModelViewType(state)
    let appModelViewType=routerLocationState.appModelViewType
    if(ownProps.app){
        appModelViewType.app=ownProps.app
    }
    if(ownProps.model){
        appModelViewType.model=ownProps.model
    }
    if(ownProps.viewType){
        appModelViewType.viewType=ownProps.viewType
    }
    let viewCMM = {}
    if(ownProps.cmmHost){
        viewCMM.cmmHost=ownProps.cmmHost
    }
    else{
        viewCMM.cmmHost=new EditViewCMM(appModelViewType.app,
            appModelViewType.model,
            appModelViewType.viewType)
    }
    const innerStore={state,ownProps,__inner_store__:1}
    return viewCMM.cmmHost.mapTo(state,Object.assign({},ownProps,{appModelViewType},viewCMM,{__inner_store__:innerStore}))
}