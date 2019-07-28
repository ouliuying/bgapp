import React from 'react'
import {connect} from 'react-redux'
import {
    withRouter,
    Redirect,
    Route,
    matchPath
} from 'react-router-dom'
import {Descriptions} from '../ui'

import hookView from '../app/HookView'
import {mapStateToProps} from '../app/modelView/editViewMapStateToProps'
import EditView from '../app/modelView/EditView';
import { SmsSettingEditViewCMM } from './cmm/SmsSettingEditViewCMM';
class SmsSettingEditView extends React.Component{
    constructor(props){
        super(props)
        const {cmmHost,parent}=this.props
        if(!parent){
            this.cmmHost=cmmHost
            this.cmmHost.init(this)
        }
        else{
            this.parent=parent
            this.cmmHost=cmmHost
        }
    }
    overrideRender(hookTag,props){
        switch(hookTag){
            case "body-main-label":
                {
                    return   <div className="bg-model-op-view-body-main-label"><Descriptions title="八优短信网" column={1}>
                                <Descriptions.Item label="网址"><a href="http://www.c8686.com/" target="blank">http://www.c8686.com/</a></Descriptions.Item>
                                <Descriptions.Item label="简介">八优短信通为<strong>bg.work</strong>框架内置短信提供商，主要提供行业及营销等业务！</Descriptions.Item>
                            </Descriptions>
                            </div>
                }

            default:
                    return null
        }
    }
    render(){
        const self=this
        self.cmmHost.update(this)
        const host= self.cmmHost
        const {viewData,viewParam}=self.props
        const ownerField= (viewParam||{}).ownerField
        const  {view,data,triggerGroups,subViews}=(viewData||{})
        const edit = data && data.record

        return  <hookView.HookProvider value={{cmmHost:self.cmmHost,parent:self}}>
                    <EditView {...self.props}></EditView>
                </hookView.HookProvider>
    }
}

function selfMapStateToProps(state,ownProps){
    let props=mapStateToProps(state,ownProps)
    let viewCMM = {}
    if(ownProps.cmmHost){
        viewCMM.cmmHost=ownProps.cmmHost
    }
    else{
        const {appModelViewType}  = props
        viewCMM.cmmHost=new SmsSettingEditViewCMM(appModelViewType.app,
            appModelViewType.model,
            appModelViewType.viewType)
    }
    return viewCMM.cmmHost.mapTo(state,Object.assign({},props,viewCMM))
}
export default hookView.withHook(withRouter(connect(selfMapStateToProps)(SmsSettingEditView)))


