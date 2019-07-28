import React from 'react'
import {Avatar,Tabs} from '../ui'
import hook from './ctrltype/hook'
import {connect} from 'react-redux'
import {
    withRouter
} from 'react-router-dom'
import { ModelAction } from '../app/mq/ModelAction';
import ViewType from '../app/modelView/ViewType';
import ModelLogListView from './ModelLogListView';
import { getCurrCorp } from '../reducers/sys';
import { getCurrPartner } from '../reducers/partner';
class WorktableInContainer extends React.Component{
    render(){
        const{currCorp,currPartner} = this.props
        return <div className="bg-worktable">
        <div className="bg-worktable-header">
            <div className="p-logo">
            <Avatar size={100} src="/images/Avatar.jpg"></Avatar>
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
            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="日志" key="1">
                   <ModelLogListView app="core" model="modelLog" viewType="list">
                   </ModelLogListView>
                </Tabs.TabPane>
            </Tabs>
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
hook()
export default withRouter(connect(mapStateToProps)(WorktableInContainer))
