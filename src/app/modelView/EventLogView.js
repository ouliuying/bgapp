import React from 'react'
import {connect} from 'react-redux'
import {ReducerRegistry} from '../../ReducerRegistry'
import {
    withRouter,
    Switch,
    Route
} from 'react-router-dom'
import hookView from '../HookView'
import { goBack,push } from 'connected-react-router';
import Icon from '../../icon'
import {Button,Table,Pagination,Tag,Row, Col,Icon as FontIcon,Divider} from "../../ui"
import ViewFieldStyle from './ViewFieldStyle'
import ViewFieldTypeRegistry from './ViewFieldTypeRegistry'
import {mapStateToProps} from './eventLogViewMapStateToProps'
import {getModelView} from './ModelViewRegistry'
import {produce} from 'immer'
import { VIEW_COMMON_FIELDS_TAB_TITLE, VIEW_COMMON_FIELDS_TAB_KEY, RECORD_TAG } from '../ReservedKeyword';
import { testCriteria } from './ViewFieldCriteria';
import { getIcon } from '../../svg'
import LogEventComponent from '../component/LogEventComponent'
import moment from 'moment'
import { ModelAction } from '../mq/ModelAction'
import { ModalSheetManager } from './ModalSheetManager'


class EventLogView extends React.Component{
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
   
    componentDidMount(){
       // console.log("listview componentDidMount")
       // window.addEventListener("resize", ()=>{this.windowSizeUpdate()});
        this.cmmHost.didMount(this)
    }
    componentWillUnmount(){
       // window.removeEventListener("resize", ()=>{this.windowSizeUpdate()});
    }
    componentWillMount(){
      //  this.windowSizeUpdate();
    }
    windowSizeUpdate(){
        try
        {
            var w = window,
            d = document,
            documentElement = d.documentElement,
            body = d.getElementsByTagName('body')[0],
            width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
            height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight;
            this.setState({width: width, height: height});
        }
        catch(err){

        }
    }
    
    render(){
        const self=this
        const {viewParam,viewData} = self.props
        let {localData} = self.props
        const {ownerField,ownerModelID} = (viewParam||{})
        let {triggerGroups} = viewData
        triggerGroups = triggerGroups||[]
        localData=localData||{}
        const {eventLogs,currentPage,totalCount,pageSize} = self.cmmHost.getViewDatas(self,viewData)
        const {searchBox} = localData
        const {visible:showSearchBox} = (searchBox||{})
        
        return <div className="bg-model-op-view bg-flex-full">

                {/* list action items*/}
               
                {/* list action items end*/}
 
                {/* list view body begin*/}
                   <hookView.Hook hookTag="listViewBody" render={()=>{
                       //  style={{width:self.state.width-360}}
                        let controlActions = (((ownerField||{}).meta||{}).controlActions||[])
                        return <div className="bg-model-list-view-body bg-flex-full">
                                    <div className="bg-model-list-view-body-control">
                                        <LogEventComponent eventLogs={eventLogs} controlActions={controlActions} onSaveEventLog={
                                            (controlTypeEditor,controlType,icon,data)=>{
                                             new ModelAction("core","modelLog").call("addControlTypeData",{
                                                 app:ownerField.app,
                                                 model:ownerField.model,
                                                 controlType,
                                                 icon,
                                                 data,
                                                 modelID:ownerModelID
                                             },res=>{
                                                if(res.errorCode==0){
                                                    self.cmmHost.didMount(self)
                                                }
                                                else{
                                                    ModalSheetManager.alert("添加失败")
                                                }
                                             },err=>{

                                             })
                                            }
                                        }></LogEventComponent>
                                    </div>
                                    <div className="bg-model-list-view-body-control-footer">
                                            <Pagination
                                                total={totalCount} 
                                                pageSizeOptions={['10', '20', '30', '40']}
                                                showSizeChanger={true}
                                                showQuickJumper={true}
                                                pageSize={pageSize} 
                                                current={currentPage}
                                                onShowSizeChange={(size)=>{self.cmmHost.onSizeChange(self,size)}}
                                                onChange={(page)=>{self.cmmHost.onCurrentChange(self,page)}}
                                            />
                                    </div>
                        </div>
                   }}></hookView.Hook>
                {/* list view body end*/}

            
        </div>
    }
}


export default hookView.withHook(withRouter(connect(mapStateToProps)(EventLogView)))