import {ModelActionViewCMM} from '../cmm/ModelActionViewCMM'
import {createModelActionParam} from './ViewParam'
export const mapStateToProps=(state,ownProps)=>{
    if(!ownProps){
        ownProps={}
    }
    let {viewParam} = ownProps
    if(viewParam){
        viewParam.orgState=state
    }
    else{
        viewParam = createModelActionParam(null,null,null,state)
    }
    let appModelViewType={
        app:ownProps.app,
        model:ownProps.model,
        viewType:ownProps.viewType
    }
    let viewCMM = {}
    if(ownProps.cmmHost){
        viewCMM.cmmHost=ownProps.cmmHost
    }
    else{
        viewCMM.cmmHost=new ModelActionViewCMM(appModelViewType.app,
            appModelViewType.model,
            appModelViewType.viewType)
    }
    return viewCMM.cmmHost.mapTo(state,Object.assign({},ownProps,{appModelViewType},viewCMM,{viewParam}))
}