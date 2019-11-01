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
import {Button,Table,Pagination,Tag,Row, Col,Icon as FontIcon,Divider} from "../ui"
import { getCurrCorp } from '../reducers/sys';
import { getCurrPartner } from '../reducers/partner';
import LogEventComponent from '../app/component/LogEventComponent'
import renderEmpty from 'antd/lib/config-provider/renderEmpty'
import { ModelAction } from '../app/mq/ModelAction'
import moment from 'moment'

export default class ModelLogView extends React.Component{
    constructor(props){
        super(props)
        this.state={
            pageIndex:1,
            eventLogs:[],
            totalCount:0,
            pageSize:10
        }
    }
    addDateControl(eventLogs){
        let nEventLogs = []
        if(eventLogs.length>0){
            let dateTag =  moment(eventLogs[0].date,"YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")
            nEventLogs.push({
                text:"日",
                title:dateTag
            })
            for(let el of eventLogs){
                let nDateTag = moment(el.date,"YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")
                if(nDateTag!=dateTag){
                    dateTag = nDateTag
                    nEventLogs.push({
                        text:"日",
                        title:dateTag
                    })
                }
                nEventLogs.push(el)
            }
        }
        return nEventLogs
    }
    loadPageData(page){
        let self = this
        const {app,model,modelID} = this.props
        new ModelAction("core","modelLog").call("loadPageData",{
            app,
            model,
            modelID,
            page
        },data=>{
            if(data.errorCode == 0){
                self.setState({
                    eventLogs: self.addDateControl(data.bag.eventLogs),
                    pageIndex:page,
                    totalCount:data.bag.totalCount?data.bag.totalCount:0
                })
            }
        },err=>{
            
        })
    }
    componentDidMount(){
        this.loadPageData(1)
    }
    render(){
        let self = this
        return <div className="bg-work-log-list-view">
                    <div className="area-header">
                        <span><FontIcon type="table" /> 操作日志 </span> 
                    </div>
                    <LogEventComponent eventLogs={self.state.eventLogs}/>
                    <div className="bg-model-list-view-body-control-footer">
                                            <Pagination
                                                total={self.state.totalCount} 
                                                pageSizeOptions={['10']}
                                                showSizeChanger={true}
                                                showQuickJumper={true}
                                                pageSize={self.state.pageSize} 
                                                current={self.state.pageIndex}
                                                onShowSizeChange={(size)=>{

                                                }}
                                                onChange={(page)=>{
                                                    self.loadPageData(page)
                                                }}
                                            />
                                    </div>
             </div>
    }
 
}