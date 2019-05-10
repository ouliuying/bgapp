import React from 'react'
import {connect} from 'react-redux'
import {
    withRouter,
    Switch,
    Route
} from 'react-router-dom'
import {push} from 'connected-react-router'
import {Button,Table,Pagination, Form, Layout,Tag} from 'element-react'
import hookView from '../../app/HookView'
import { goBack } from 'connected-react-router';
import Icon from '../../icon'
import ViewFieldTypeRegistry from './ViewFieldTypeRegistry'
import {getUIAppCache,corpModelsSelector} from '../../reducers/sys'
import {getDynamicRouterAppModelViewType} from '../../reducers/router'
import {getRoutePath} from '../routerHelper'
import {mapStateToProps} from './listViewMapStateToProps'
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
        const {ownerField} = (viewParam||{})
        let {criterias, triggerGroups} = viewData
        criterias=criterias||[]
        triggerGroups=triggerGroups||[]
        const {view} = viewData
        const subViews = (view && view.subViews)||[]
        const {columns,rows,currentPage,totalCount,pageSize} = self.cmmHost.getViewDatas(self,viewData)
        return <div className="bg-model-op-view bg-flex-full">
                {/* toolbar begin */}
                {

                        ownerField?null:<hookView.Hook hookTag="toolbar" render={()=>{
                            return <div className="bg-model-op-view-toolbar">
                                <button className="bg-model-op-view-toolbar-back"  onClick={()=>{
                                    self.props.dispatch(goBack())
                                }}>
                                <Icon.LocationGoBack></Icon.LocationGoBack>
                                </button>
                            </div>
                            }
                        }/>
                }
                    
                {/* toolbar end */}

                    
                {/* searchBox begin */}
                    <hookView.Hook hookTag="searchBox" render={()=>{
                       const {viewData} = this.props
                       const searchCriterias = criterias
                       const searchBox = subViews.find(x=>{
                           return x.refView.viewType == "searchBox"
                       })
                       const mainGroup = triggerGroups.find(x=>{
                           return x.name == "main"
                       })
                        var criteriaControlGroups=[]
                        if(this.searchBox){
                            var lineCnt=3
                            var lines=parseInt(searchBox.fields.length/lineCnt)
                            for(var i=0;i<lines;i++){
                                criteriaControlGroups.push(searchBox.fields.slice(lineCnt*i,lineCnt*(i+1)))
                            }
                            if(lines*4<searchBox.fields.length){
                                var rest=searchBox.fields.slice(lines*lineCnt)
                                rest.push(null)
                                criteriaControlGroups.push(rest)
                            }
                            else{
                                var btn=[]
                                btn.push(null)
                                criteriaControlGroups.push(btn)
                            }
                        }

                        return <div className="bg-model-list-view-search-box">
                                <div className="sub-body">
                                <Form>
                                    {
                                        criteriaControlGroups.length>0?criteriaControlGroups.map((fds,index)=>{
                                            return <Layout.Row gutter="2" key={index}>
                                                {
                                                    fds.map((fd,index)=>{
                                                            var Com=fd?ViewFieldTypeRegistry.getComponent(fd.type):null
                                                            var title=fd?fd.title:""
                                                            let cValue=criterias[fd.name]&&criterias[fd.name].value
                                                            return <Layout.Col span="8" key={index}>
                                                                    <Form.Item label={title} labelWidth={60}>
                                                                        {
                                                                            Com?<Com meta={fd.meta} name={fd.name} value={cValue} key={fd.name}  title={title} onCriteriaChange={(data)=>{
                                                                              self.cmmHost.onCriteriaValueChange(data)
                                                                            }}></Com>:<div><Button type="primary" onClick={
                                                                                ()=>{
                                                                                    self.cmmHost.doAction(self,{
                                                                                        name:"search"
                                                                                    })
                                                                                }
                                                                            }>确定</Button>&nbsp;
                                                                            {
                                                                                            mainGroup?mainGroup.triggers.map(t=>{
                                                                                                return <Button type="danger" onClick={()=>{
                                                                                                    self.cmmHost.doAction(self,t)
                                                                                                }}>{t.title}</Button>
                                                                                            }):null

                                                                            }
                                                                            </div>
                                                                        }    
                                                                    </Form.Item>
                                                            </Layout.Col>
                                                    })
                                                }
                                                </Layout.Row>
                                            
                                        }):<Layout.Row gutter="2">
                                            {
                                                mainGroup?<Form.Item>
                                                {
                                                    mainGroup.triggers.map(t=>{
                                                             return <Button type="danger" onClick={()=>{
                                                                 self.cmmHost.doAction(self,t)
                                                             }} key={t.name}>{t.title}</Button>
                                                    })
                                                }      
                                                </Form.Item>:null
                                            }
                                        </Layout.Row>
                                    }
                                </Form>
                            </div>
                            <div className="sub-search-tags">
                                        <Tag type="danger" closable={true} onClose={()=>{

                                        }}>搜索标签</Tag>
                            </div>
                        </div>
                    }}></hookView.Hook>
                {/* searchBox end */}


                {/* list view body begin*/}
                   <hookView.Hook hookTag="listViewBody" render={()=>{
                       //  style={{width:self.state.width-360}}
                        return <div className="bg-model-list-view-body bg-flex-full">
                                <div className="bg-model-list-view-body-control-header">
                                    <Button.Group>
                                        <Button type="primary" icon="search"></Button>
                                    </Button.Group>
                                </div>

                                <div className="bg-model-list-view-body-control">

                                    <Table style={{width: '100%'}}
                                           columns={columns}
                                            data={rows}
                                            border={true}
                                            highlightCurrentRow={true}
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