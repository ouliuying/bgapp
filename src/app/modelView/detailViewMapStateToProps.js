
import {getDynamicRouterAppModelViewType} from '../../reducers/router'
import {DetailViewCMM} from '../cmm/DetailViewCMM'
import {createDetailParam} from './ViewParam'
export const mapStateToProps=(state,ownProps)=>{
    if(!ownProps){
        ownProps={}
    }
    let {viewParam} = ownProps
    if(viewParam){
        viewParam.orgState=state
    }
    else{
        viewParam = createDetailParam(undefined,undefined,undefined,undefined,undefined,state)
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
        viewCMM.cmmHost=new DetailViewCMM(appModelViewType.app,
            appModelViewType.model,
            appModelViewType.viewType)
    }
    return viewCMM.cmmHost.mapTo(state,Object.assign({},ownProps,{appModelViewType},viewCMM,{viewParam}))
}