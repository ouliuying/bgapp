
import React from 'react'
import { DepartmentListViewCMM } from '../cmm/DepartmentListViewCMM'
import {mapStateToProps} from '../../app/modelView/listViewMapStateToProps'
export function departmentListViewMapStateToProps(state,ownProps){
    let props=mapStateToProps(state,ownProps)
    let viewCMM = {}
    if(ownProps.cmmHost){
        viewCMM.cmmHost=ownProps.cmmHost
    }
    else{
        const {appModelViewType}  = props
        viewCMM.cmmHost=new DepartmentListViewCMM(appModelViewType.app,
            appModelViewType.model,
            appModelViewType.viewType)
    }
    return viewCMM.cmmHost.mapTo(state,Object.assign({},props,viewCMM))
}