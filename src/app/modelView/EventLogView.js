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
        const {ownerField} = (viewParam||{})
        let {criterias, triggerGroups,subViews} = viewData
        criterias=criterias||[]
        triggerGroups=triggerGroups||[]
        localData=localData||{}
        subViews=subViews||[]
        const {eventLogs,currentPage,totalCount,pageSize} = self.cmmHost.getViewDatas(self,viewData)
        const {searchBox} = localData
        const {visible:showSearchBox} = (searchBox||{})
        
        return <div className="bg-model-op-view bg-flex-full">

                {/* list action items*/}
                <hookView.Hook hookTag="list-view-action-items" render={()=>{
                    const searchBox = subViews.find(x=>{
                        return x.refView.viewType == "searchBox"
                    })
                    let searchFieldRows =[]
                    if(searchBox && searchBox.view && (searchBox.view.fields||[]).length>0){
                        let startIndex=0
                        let lastGFields=[]
                        let gfields=[]
                        let showFields = searchBox.view.fields.filter(x=>testCriteria(x.visibleCriteria,undefined))||[]
                        do{
                            gfields = showFields.slice(startIndex,startIndex+3)
                            if(gfields.length>0 ){
                                lastGFields=gfields
                                searchFieldRows.push(gfields)
                            }
                            startIndex = startIndex+3
                        }while(gfields.length>0)
                        lastGFields.push(null)
                    }
                    const groups=["main"]
                    let tGroups = triggerGroups.filter(x=>{
                        return groups.indexOf(x.name)>-1
                    })
                    return <div className="bg-list-view-action-search-section">
                            <div className="bg-list-view-action">
                            {
                                tGroups.map((g)=>{
                                    return <>
                                        {
                                             g.triggers.map(t=>{
                                                let IconCtrl = getIcon(t.icon)
                                                return <Button type="primary" onClick={()=>{
                                                    self.cmmHost.doAction(self,t)
                                                }} key={t.name}>{IconCtrl}{t.title}</Button>
                                            })
                                        }
                                    </>
                                })
                            }
                            </div>
                            <Divider className="bg-divider-line"></Divider>
                            <div className="bg-list-view-search-container">
                                {
                                    searchBox?<div className="bg-list-view-search-box">
                                    {
                                       searchFieldRows.map(row=>{
                                            return <>
                                            {
                                                showSearchBox?<Row>
                                                    {
                                                        row.map(fd=>{
                                                            let CCom = ViewFieldTypeRegistry.getComponent(fd&&fd.type)
                                                            let cValue = self.cmmHost.getSearchBoxFieldValue(self,fd,localData)
                                                            let enable = fd?testCriteria(fd.enableCriteria,undefined):true
                                                            return fd?<Col span={6}>
                                                                <div className="bg-list-view-search-box-item">
                                                                    <label>{fd.title}</label>
                                                                    <CCom field={fd} onChange={(value)=>self.cmmHost.onSearchBoxCriteriaChange(self,fd,value)} value={cValue} enable={enable}></CCom>
                                                                </div>
                                                            </Col>:<Col span={6}>
                                                            <Button  className="bg-list-view-search-box-btn" type="primary" icon="search" onClick={()=>{
                                                                self.cmmHost.doAction(self,{
                                                                    name:"search"
                                                                })
                                                            }}>确定</Button>
                                                            </Col>
                                                        })
                                                    }
                                                </Row>:<>
                                                    {
                                                        row.map(fd=>{
                                                            return fd?<span><Tag color="#108ee9" onClick={()=>{
                                                                self.cmmHost.toggleShowSearchBox(self)
                                                          }}>{fd.title}</Tag></span>:null
                                                        })
                                                    }
                                                </>
                                            }
                                            </>
                                       })
                                    }
                                    </div>:null
                                }
                            </div>
                           
                            <div className="bg-list-view-search-box-show-op">
                            {
                                showSearchBox?<span className="open" onClick={()=>{
                                    self.cmmHost.toggleShowSearchBox(self)
                                }}>
                                    <FontIcon type="down"></FontIcon>
                                </span>:<span onClick={()=>{
                                      self.cmmHost.toggleShowSearchBox(self)
                                }}>
                                    <FontIcon type="down"></FontIcon>
                                </span>
                            }
                            </div>
                    </div>
                }}>
                </hookView.Hook>
                {/* list action items end*/}
 
                    
                {/* list view body begin*/}
                   <hookView.Hook hookTag="listViewBody" render={()=>{
                       //  style={{width:self.state.width-360}}
                        return <div className="bg-model-list-view-body bg-flex-full">
                                    <div className="bg-model-list-view-body-control">
                                        <LogEventComponent eventLogs={eventLogs}></LogEventComponent>
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