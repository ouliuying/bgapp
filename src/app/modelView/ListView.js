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
        window.addEventListener("resize", ()=>{this.windowSizeUpdate()});
        this.cmmHost.didMount(this)
    }
    componentWillUnmount(){
        window.removeEventListener("resize", ()=>{this.windowSizeUpdate()});
    }
    componentWillMount(){
        this.windowSizeUpdate();
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
        const {ownerField} = self.props
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
                       const searchBox = viewData.view.subViews.find(x=>{
                           x.refView.viewType == "searchBox"
                       })
                       const mainGroup = viewData.triggerGroup.find(x=>{
                           x.name == "main"
                       })
                        var criteriaControlGroups=[]
                        if(this.searchBox){
                            var lineCnt=3
                            var lines=parseInt(this.searchBox.fields.length/lineCnt)
                            for(var i=0;i<lines;i++){
                                criteriaControlGroups.push(this.searchBox.fields.slice(lineCnt*i,lineCnt*(i+1)))
                            }
                            if(lines*4<this.searchBox.fields.length){
                                var rest=this.searchBox.fields.slice(lines*lineCnt)
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
                                                            return <Layout.Col span="8" key={index}>
                                                                    <Form.Item label={title} labelWidth={60}>
                                                                        {
                                                                            Com?<Com meta={fd.meta} name={fd.name} value={fd.value} ckey={fd.key}  title={title} onCriteriaChange={(criteria,ckey)=>{
                                                                                var searchCriteria=this.state.searchCriteria
                                                                                searchCriteria[ckey]=criteria
                                                                                self.setState({searchCriteria})
                                                                            }}></Com>:<div><Button type="primary" onClick={
                                                                                ()=>{
                                                                                    self.cmmHost.doAction(self,{
                                                                                        name:"search"
                                                                                    })
                                                                                }
                                                                            }>确定</Button>&nbsp;
                                                                            {
                                                                                            mainGroup&&mainGroup.triggers.map(t=>{
                                                                                                <Button type="danger" onClick={()=>{
                                                                                                    self.cmmHost.doAction(self,t)
                                                                                                }}>{t.title}</Button>
                                                                                            })

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
                                                             <Button type="danger" onClick={()=>{
                                                                 self.cmmHost.doAction(self,t)
                                                             }}>{t.title}</Button>
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
                        return <div className="bg-model-list-view-body bg-flex-full"  style={{width:self.state.width-360}}>
                                <div className="bg-model-list-view-body-control-header">
                                    <Button.Group>
                                        <Button type="primary" icon="search"></Button>
                                    </Button.Group>
                                </div>

                                <div className="bg-model-list-view-body-control">
                              
                                    <Table style={{width: '100%'}}
                                           columns={self.columns}
                                            data={self.state.data}
                                            border={true}
                                            highlightCurrentRow={true}
                                            onCurrentChange={item=>{console.log(item)}}
                                            onSizeChange={()=>{}}
                                            >
                                    </Table>
                                   
                                </div>

                                <div className="bg-model-list-view-body-control-footer">
                                <Pagination layout="total, sizes, prev, pager, next, jumper" 
                                total={self.state.total} pageSizes={[10, 20, 30, 40]} 
                                pageSize={self.state.pageSize} 
                                currentPage={self.state.currentpage}
                                onSizeChange={(size)=>{this.onSizeChange(size)}}
                                onCurrentChange={(page)=>{this.onCurrentChange(page)}}
                                />
                                </div>
                        </div>
                   }}></hookView.Hook>
                {/* list view body end*/}

            
        </div>
    }
}

export default hookView.withHook(withRouter(connect(mapStateToProps)(ListView)))