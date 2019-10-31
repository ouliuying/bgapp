import React from 'react'
import {connect} from 'react-redux'
import {
    withRouter,
    Redirect,
    Route,
    matchPath
} from 'react-router-dom'
import ListView from '../app/modelView/ListView'
import hookView from '../app/HookView'
import {mapStateToProps} from '../app/modelView/listViewMapStateToProps'
import { regModelView } from '../app/modelView/ModelViewRegistry'
import {List,Icon,Avatar} from '../ui'
import { getCurrCorp } from '../reducers/sys';
import { getCurrPartner } from '../reducers/partner';
import LogEventComponent from '../app/component/LogEventComponent'

export default function ModelLogView(){
  return <div className="bg-work-log-list-view">

            <div className="area-header">
                <span><Icon type="table" /> 操作日志 </span> 
            </div>
            <LogEventComponent/>
    </div>
}