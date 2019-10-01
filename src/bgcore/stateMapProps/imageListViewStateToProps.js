
import React from 'react'
import { ImageListViewCMM } from '../cmm/ImageListViewCMM'
import {mapStateToProps} from '../../app/modelView/listViewMapStateToProps'
export function imageListViewMapStateToProps(state,ownProps){
    let props=mapStateToProps(state,ownProps)
    let viewCMM = {}
    if(ownProps.cmmHost){
        viewCMM.cmmHost=ownProps.cmmHost
    }
    else{
        const {appModelViewType}  = props
        viewCMM.cmmHost=new ImageListViewCMM(appModelViewType.app,
            appModelViewType.model,
            appModelViewType.viewType)
    }
    return viewCMM.cmmHost.mapTo(state,Object.assign({},props,viewCMM))
}