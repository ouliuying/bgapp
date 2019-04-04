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
class ListView extends React.Component{
    constructor(props){
        super(props)
        const {uiAppCache,models,...rest}=this.props
        const {app,model,viewType}=this.props.appModelViewType
        this.app=app
        this.model=model
        this.viewType=viewType
        const modelViews=uiAppCache[app].modelViews[model].views
        this.modelView=modelViews[viewType]
        this.searchBox=modelViews["searchBox"]
        if(this.searchBox){
            var key=0
            for(var fd of this.searchBox.fields){
                fd.key=key
                key++
            }
        }
        this.restProps=rest
        this.columns=[]
        var data={}
        this.modelView.fields.map((fd)=>{
            if(!fd.relationData){
                this.columns.push({
                    label:fd.title,
                    prop:fd.name,
                })
            }
            else{
                const relModelData=this.getModelData(fd.relationData.targetApp,fd.relationData.targetModel)
                const targetField=relModelData.fields[fd.relationData.targetField]
                this.columns.push({
                    label:relModelData.title+"/"+relModelData.fields[fd.relationData.toName].title,
                    render:()=>{
                        const rFd=fd
                        return <span>{rFd.title}</span>
                    }
                })
            }

            data[fd.name]="x"
        })
        this.state={
            data:[data],
            pageSize:30,
            currentPage:1,
            total:0,
            pageSizes:[10,20,30,40,50],
            searchTags:[],
            searchCriteria:{},
            width:100
        }
    }
    fetchModelPageData(opts){
        opts=Object.assign({},this.state,opts)
        
    }
    onSizeChange(size){
        this.setState({pageSize:size,currentPage:1})
        this.fetchModelPageData({pageSize:size,currentPage:1})
    }
    onCurrentChange(currentPage){
        this.setState({currentPage:currentPage})
        this.fetchModelPageData({currentPage:currentPage})
    }
    getModelData(app,model){
        const {models}=this.props
        return models[app][model]
    }
    doAdd(){
        var path=getRoutePath(this.app,this.model,"create")
        this.props.dispatch(push(path))
    }
    componentDidMount(){
        window.addEventListener("resize", ()=>{this.windowSizeUpdate()});
        this.fetchModelPageData()
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
        return <div className="bg-model-op-view bg-flex-full">
                {/* toolbar begin */}
                    <hookView.Hook hookTag="toolbar" render={()=>{
                        return <div className="bg-model-op-view-toolbar">
                            <button className="bg-model-op-view-toolbar-back"  onClick={()=>{
                                self.props.dispatch(goBack())
                            }}>
                            <Icon.LocationGoBack></Icon.LocationGoBack>
                            </button>
                        </div>
                        }
                    }/>
                {/* toolbar end */}


                {/* searchBox begin */}
                    <hookView.Hook hookTag="searchBox" render={()=>{
                       if(!self.searchBox){
                           return <div className="bg-model-list-view-search-box">
                           <div className="sub-body"><Form>
                               <Form.Item>
                                            <Button type="danger" onClick={()=>{
                                                                                self.doAdd()
                                                                            }}>添加</Button>
                                            </Form.Item>
                           </Form>
                           </div>
                           </div>
                       }
                        var criteriaControlGroups=[]
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
                                                                            }}></Com>:<div><Button type="primary">确定</Button>&nbsp;<Button type="danger" onClick={()=>{
                                                                                self.doAdd()
                                                                            }}>添加</Button></div>
                                                                        }    
                                                                    </Form.Item>
                                                            </Layout.Col>
                                                    })
                                                }
                                                </Layout.Row>
                                            
                                        }):<Layout.Row gutter="2">
                                            <Form.Item>
                                            <Button type="danger" onClick={()=>{
                                                                                self.doAdd()
                                                                            }}>添加</Button>
                                            </Form.Item>
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

function mapStateToProps(state){
     let props= getUIAppCache(state)
    let routerLocationState=getDynamicRouterAppModelViewType(state)
    let models=corpModelsSelector(state)
    return Object.assign({},props,routerLocationState,models)
}
export default hookView.withHook(withRouter(connect(mapStateToProps)(ListView)))