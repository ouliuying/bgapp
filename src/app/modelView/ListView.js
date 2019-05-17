import React from 'react'
import {connect} from 'react-redux'
import {
    withRouter,
    Switch,
    Route
} from 'react-router-dom'
import {push} from 'connected-react-router'
import {Button,Table,Pagination,Tag,Row, Col,Icon as FontIcon,Divider} from "../../ui"
import hookView from '../../app/HookView'
import { goBack } from 'connected-react-router';
import Icon from '../../icon'
import ViewFieldTypeRegistry from './ViewFieldTypeRegistry'
import {getUIAppCache,corpModelsSelector} from '../../reducers/sys'
import {getDynamicRouterAppModelViewType} from '../../reducers/router'
import {getRoutePath} from '../routerHelper'
import {mapStateToProps} from './listViewMapStateToProps'
import { RECORD_TAG } from '../ReservedKeyword';
class ListView extends React.Component{
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
        console.log("listview componentDidMount")
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
        const {columns,rows,currentPage,totalCount,pageSize} = self.cmmHost.getViewDatas(self,viewData)
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
                        do{
                            gfields = searchBox.view.fields.slice(startIndex,startIndex+3)
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
                                                return <Button type="danger" onClick={()=>{
                                                    self.cmmHost.doAction(self,t)
                                                }} key={t.name}>{t.title}</Button>
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
                                                            return fd?<Col span={6}>
                                                                <div className="bg-list-view-search-box-item">
                                                                    <label>{fd.title}</label>
                                                                    <CCom field={fd} onChange={(value)=>self.cmmHost.onSearchBoxCriteriaChange(self,fd,value)} value={cValue}></CCom>
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
                                {
                                    showSearchBox && searchFieldRows.length>0?<Divider className="bg-divider-line"></Divider>:null
                                }
                                <div className="bg-list-view-search-tag">
                                    {
                                        (showSearchBox || !searchBox || searchFieldRows.length<1)?criterias.map((c)=>{
                                            return <Tag closable onClose={(e)=>{
                                                self.cmmHost.removeCriteriaTag(c)
                                            }}>
                                                <span>{c.name}</span>
                                            </Tag>
                                        }):null 
                                    }
                                    <>
                                    {
                                        (showSearchBox || !searchBox || searchFieldRows.length<1)?<Tag color="#108ee9" onClick={()=>{
                                            self.cmmHost.addCriteriaTag()
                                        }}><FontIcon type="plus"/>添加快捷条件</Tag>:null
                                    }
                                    </>
                                </div>
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

                                    <Table style={{width: '100%'}}
                                           columns={columns}
                                           dataSource={rows}
                                            bordered={true}
                                            rowKey={(record)=>{
                                                return record[RECORD_TAG]
                                            }}
                                            pagination={false}
                                            >
                                    </Table>
                                </div>
                                <div className="bg-model-list-view-body-control-footer">
                                    <Pagination layout="total, sizes, prev, pager, next, jumper" 
                                    total={totalCount} pageSizes={[10, 20, 30, 40]} 
                                    pageSize={pageSize} 
                                    currentPage={currentPage}
                                    onSizeChange={(size)=>{self.cmmHost.onSizeChange(size)}}
                                    onCurrentChange={(page)=>{self.cmmHost.onCurrentChange(page)}}
                                    />
                                </div>
                        </div>
                   }}></hookView.Hook>
                {/* list view body end*/}

            
        </div>
    }
}

export default hookView.withHook(withRouter(connect(mapStateToProps)(ListView)))