import React from 'react'
import {Avatar,Tabs, Row, Col} from '../ui'

import {connect} from 'react-redux'
import {
    withRouter
} from 'react-router-dom'
import { ModelAction } from '../app/mq/ModelAction';
import ViewType from '../app/modelView/ViewType';
import ModelLogListView from './ModelLogListView';
import { getCurrCorp } from '../reducers/sys';
import { getCurrPartner } from '../reducers/partner';
import CrmStatisticSummaryView from './CrmStatisticSummaryView'
import CrmSalesFunnelView from './CrmSalesFunnelView'
import CrmSalesTopListView from './CrmSalesTopListView'
import NotifyListView from './NotifyListView'
class WorktableInContainer extends React.Component{
    render(){
        const{currCorp,currPartner} = this.props
        return <div className="bg-worktable">
        <div className="bg-worktable-header">
            <div className="p-logo">
                <Avatar size={50} src={"/storage/file/"+currPartner.icon}></Avatar>
            </div>
            <div>
                <span className="p-name">
                    {currPartner.userName}
                </span>
               <h4 className="p-corp-name">
                   {currCorp.name}
               </h4>
            </div>
        </div>
        <div className="bg-worktable-body">
           <CrmStatisticSummaryView></CrmStatisticSummaryView>
            <div className="bg-worktable-sales-container">
                <CrmSalesFunnelView></CrmSalesFunnelView>
                <CrmSalesTopListView></CrmSalesTopListView>
            </div>
            <div className="bg-work-log-notify-container">
                    <ModelLogListView/>
                   {/* <NotifyListView app="core" model="modelLog" viewType="list"></NotifyListView> */}
            </div>
        </div>
        <div className="bg-worktable-footer">
            
        </div>
    </div>
    }
}
function mapStateToProps(state){
    let currCorp = getCurrCorp(state)
    let currPartner = getCurrPartner(state)
    return {currCorp,currPartner}
}
export default withRouter(connect(mapStateToProps)(WorktableInContainer))
