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
import {Button,Form,Tabs,Table, MessageBox} from "../../ui"
import ViewFieldStyle from './ViewFieldStyle'
import ViewFieldTypeRegistry from './ViewFieldTypeRegistry'
import {mapStateToProps} from './detailViewMapStateToProps'
import {getModelView} from './ModelViewRegistry'
import {produce} from 'immer'
import { Divider } from "../../ui"
class DetailView extends React.Component{
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
        this.subViewStatus=[]
    }
    componentDidMount(){
        let {cmmHost} = this.props
        cmmHost.didMount(this)
      
    }
    
    componentWillMount(){
        
    }
   
    componentWillReceiveProps(){

    }
    render(){
        const self=this
        self.cmmHost.update(this)
        const host= self.cmmHost
        if(host){
            console.log("host 不为空")
            console.log(JSON.stringify(host))
        }
        else{
            console.log("host 为空")
        }
        const {viewData,viewParam}=self.props
        const {ownerField} = (viewParam||{})
        const  {view:viewMeta,data,triggerGroups,subViews}=viewData
        const detailData = data && data.record
        let relationViews = (subViews||[]).filter((subView)=>{
            return subView.refView.style===ViewFieldStyle.RELATION
        })
        return <hookView.HookProvider value={{cmmHost:self.cmmHost,parent:self}}>
                <div className="bg-model-op-view bg-flex-full ">
                {
                    // ownerField?null:<hookView.Hook hookTag="toolbar"  render={()=>{
                    //     return <div className="bg-model-op-view-toolbar">
                    //         <button className="bg-model-op-view-toolbar-back"  onClick={()=>{
                    //             self.props.dispatch(goBack())
                    //         }}>
                    //         <Icon.LocationGoBack></Icon.LocationGoBack>
                    //         </button>
                    // </div>
                    // }
                    // }/>
                }
                <hookView.Hook hookTag="actions"  render={()=>{
                        return <div className="bg-model-op-view-actions">
                                    <hookView.Hook hookTag="actions-main-group"  render={()=>{
                                        let mainActionGroup=triggerGroups&&triggerGroups.find(x=>{
                                           return   x.name=="main"
                                        })//ViewActionProvider.getActionGroup(host.app,host.model,host.viewType,"main")
                                            return mainActionGroup?<div className="bg-model-op-view-actions-main-group">
                                        {
                                        mainActionGroup.triggers?(
                                            mainActionGroup.triggers.map(t=>{
                                                    return <Button onClick={()=>{
                                                        host.doAction(self, t)
                                                    }} key={t.name}>{
                                                        t.title
                                                    }
                                                    </Button>  
                                            })
                                        ):null 
                                        }
                                    </div>:null
                                    }}>
                                    </hookView.Hook>
                                    
                                    <hookView.Hook hookTag="actions-sub-group"   render={
                                        ()=>{
                                            return <div className="bg-model-op-view-actions-sub-group">
                                            
                                            </div>
                                        }
                                    }>
                                    </hookView.Hook>
                                    
                                </div>
                    }}>

                    </hookView.Hook>

                    {/*  body begin  */}
                    <hookView.Hook hookTag="body"  render={()=>{
                    return <div className="bg-model-op-view-body">
                            <hookView.Hook hookTag="body-main"  render={()=>{
                                return <div className="bg-model-op-view-body-main">
                                        {/*  body-main-h begin  */}
                                        <hookView.Hook hookTag="body-main-h"  render={()=>{
                                            return <div className="bg-model-op-view-body-main-h">
                                                        <div className="bg-model-op-view-body-main-h1">
                                                        <Form  >
                                                        {
                                                            
                                                            viewMeta&&viewMeta.fields.map((field,index)=>{
                                                                    let type=field.type
                                                                    let meta=field.meta
                                                                    let nValue=detailData&&detailData[field.name]!==undefined?detailData[field.name]:""
                                                                    const FieldComponent=ViewFieldTypeRegistry.getComponent(type)
                                                                    let key=`${field.app}_${field.model}_${field.name}`
                                                                    return field.style===ViewFieldStyle.HEAD?(
                                                                        <Form.Item label={field.title} key={`form-item${key}`}>
                                                                                <FieldComponent onChange={(value)=>{
                                                                                    host.onFieldValueChange(field,value)
                                                                                }} value={nValue } key={key} meta={meta} title={field.title} relationData={field.relationData}></FieldComponent>    
                                                                        </Form.Item>
                                                                    ):null
                                                                })
                                                        }
                                                        </Form>
                                                    
                                                        </div>

                                                        <div className="bg-model-op-view-body-main-h2">
                                                        <Form  >
                                                        {
                                                                
                                                                viewMeta&&viewMeta.fields.map((field,index)=>{
                                                                    let type=field.type
                                                                    let meta=field.meta
                                                                    const FieldComponent=ViewFieldTypeRegistry.getComponent(type)
                                                                    let nValue=detailData&&detailData[field.name]!==undefined?detailData[field.name]:""
                                                                    let key=`${field.app}_${field.model}_${field.name}`
                                                                    return field.style===ViewFieldStyle.SUB_HEAD?(
                                                                        <Form.Item label={field.title} key={`form-item${key}`}>
                                                                            <FieldComponent onChange={(value)=>{
                                                                                    host.onFieldValueChange(field,value)
                                                                                }} value={nValue} key={key} meta={meta} title={field.title} relationData={field.relationData}></FieldComponent>    
                                                                        </Form.Item>
                                                                    ):null
                                                                })
                                                        } 
                                                        </Form>
                                                        </div>
                                                </div>
                                        }}></hookView.Hook>
                                        {/*  body-main-h end  */}


                                        {/*  body-main-label begin  */}
                                        <hookView.Hook hookTag="body-main-label"  render={()=>{
                                            return <div className="bg-model-op-view-body-main-label">
                                                {
                                                    viewMeta&&viewMeta.fields.map((field,index)=>{
                                                                    let type=field.type
                                                                    let key=`${field.app}_${field.model}_${field.name}`
                                                                    const FieldComponent=ViewFieldTypeRegistry.getComponent(type)
                                                                    return field.style===ViewFieldStyle.LABEL?(
                                                                        
                                                                            <FieldComponent 
                                                                            title={field.title} 
                                                                            icon={field.icon} 
                                                                            className="bg-op-label" 
                                                                            iconClassName="bg-op-label-icon"
                                                                            key={key}></FieldComponent>
                                                                        
                                                                        
                                                                    ):null
                                                        })
                                                }
                                            </div>
                                        }}></hookView.Hook>
                                        {/*  body-main-label end  */}
                                </div>
                            }}>
                            </hookView.Hook>

                            <hookView.Hook  hookTag="body-common"  render={()=>{
                                let commonGroupFields=[]
                                for(var fd of (viewMeta||{}).fields||[]){
                                    if(fd.style===ViewFieldStyle.NORMAL){
                                        let currGF=null
                                        if(fd.colSpan>1){
                                            currGF={fields:[],components:[],colCount:0,rowSpan:0,colSpan:0}
                                            commonGroupFields.push(currGF)
                                        }
                                        else{
                                            if(commonGroupFields.length>0){
                                                currGF=commonGroupFields[commonGroupFields.length-1]
                                                if(currGF.colCount>1){
                                                    currGF={fields:[],components:[],colCount:0,rowSpan:0,colSpan:0}
                                                    commonGroupFields.push(currGF)
                                                }
                                            }
                                            else{
                                                currGF={fields:[],components:[],colCount:0,rowSpan:0,colSpan:0}
                                                commonGroupFields.push(currGF)
                                            }
                                        }
                                        currGF.fields.push(fd)
                                        currGF.components.push(ViewFieldTypeRegistry.getComponent(fd.type))
                                        currGF.colCount=currGF.colCount+fd.colSpan
                                        if(currGF.rowSpan<fd.rowSpan){
                                            currGF.rowSpan=fd.rowSpan
                                        }
                                    }
                                }
                                return <div className="bg-model-op-view-body-common">
                                        <Form>
                                        {
                                            commonGroupFields.map((gfs,index)=>
                                            {
                                                    const Com1=gfs.components[0]
                                                    let props1=null
                                                    let props2=null
                                                    let key1=null
                                                    let key2=null
                                                    let value1=null
                                                    let value2=null
                                                    let meta1=null
                                                    let meta2=null
                                                    const  Com2=gfs.components.length>1?gfs.components[1]:null
                                                    if(Com1){
                                                        let fd=gfs.fields[0]
                                                        meta1=fd.meta
                                                        key1=`${fd.app}_${fd.model}_${fd.name}`
                                                        value1=detailData&&detailData[fd.name]!==undefined?detailData[fd.name]:""
                                                        props1={
                                                            name:fd.name
                                                        }
                                                        if(fd.relationData){
                                                            props1.relationData=fd.relationData
                                                            props1.orgSelData={}
                                                        }
                                                    }
                                                    if(Com2){
                                                        let fd=gfs.fields[1]
                                                        meta2=fd.meta
                                                        value2=detailData&&detailData[fd.name]!==null?detailData[fd.name]:""
                                                        key2=`${fd.app}_${fd.model}_${fd.name}`
                                                        props2={
                                                            name:fd.name
                                                        }
                                                        if(fd.relationData){
                                                            props2.relationData=fd.relationData
                                                            props2.orgSelData={}
                                                        }
                                                    }
                                                    return (gfs.fields.length>1||gfs.colCount===1)?(
                                                            <Form.Item key={`fi-${key1}`}>
                                                                <div className="bg-model-op-view-body-common-two-col">
                                                                    <div className="bg-model-op-view-body-common-two-col-first">
                                                                    <Form.Item label={gfs.fields[0].title}>
                                                                        <Com1 {...props1} onChange={(value)=>{
                                                                                    host.onFieldValueChange(gfs.fields[0],value)
                                                                                }} key={key1} value={value1} meta={meta1} relationData={gfs.fields[0].relationData}></Com1>
                                                                    </Form.Item>
                                                                    </div>
                                                                    <div className="bg-model-op-view-body-common-two-col-second">
                                                                    {Com2!=null && (<Form.Item label={gfs.fields[1].title}>
                                                                        <Com2 {...props2} onChange={(value)=>{
                                                                                    host.onFieldValueChange(gfs.fields[1],value)
                                                                                }} key={key2} value={value2} meta={meta2} relationData={gfs.fields[1].relationData}></Com2>
                                                                    </Form.Item>)
                                                                }
                                                                    </div>
                                                                </div>
                                                            </Form.Item>):(
                                                                <div className="bg-model-op-view-body-common-one-col" key={`fi-${key1}`}>
                                                                    <Form.Item label={gfs.fields[0].title}>
                                                                        <Com1 {...props1} onChange={(value)=>{
                                                                                    host.onFieldValueChange(gfs.fields[0],value)
                                                                                }} key={key1} value={value1} meta={meta1} relationData={gfs.fields[0].relationData}></Com1>
                                                                    </Form.Item>  
                                                                </div>
                                                            
                                                        )         
                                            })
                                        }
                                        </Form>
                                </div>
                            }}>

                            </hookView.Hook>

                            {/**  create model dont support add target model same time  */}
                            {
                                //(relationViews && relationViews.length>0)?<div className="bg-big-line"></div>:null
                                //(relationViews && relationViews.length>0)?<Divider className="bg-big-line"></Divider>:null
                            }


                           

                    </div>

                    }}></hookView.Hook>
                    {/*  body end  */}



                    {/*  relation start  */}
                    <hookView.Hook hookTag="body-relation" render={()=>{
                                    let subViewStatus = produce(self.subViewStatus,draft=>{
                                        if(draft.length<1 && relationViews.length>0){
                                            if(!ownerField){
                                                let subView = relationViews[0]
                                                draft.push({
                                                    subView,
                                                    show:true
                                                })
                                            }
                                        }
                                    })
                                    return relationViews.length>0?(<div className="bg-model-op-view-body-relation">
                                    <div className="bg-model-op-view-body-relation-nav">
                                        <Tabs type="card">
                                           {
                                               relationViews.map(v=>{
                                                   return <Tabs.TabPane tab={v.refView.title} key={v.refView.fieldName} onChange={
                                                       activekey=>{
                                                        for(let svs of subViewStatus){
                                                            svs.show=false
                                                        }
                                                        let rSelf = subViewStatus.find(x=>x.subView.refView.fieldName == v.refView.fieldName)
                                                        if(rSelf){
                                                            rSelf.show=true
                                                        }
                                                        else{
                                                            subViewStatus.push({
                                                                subView:v,
                                                                show:true
                                                            })
                                                        }
                                                        self.subViewStatus=subViewStatus
                                                        self.forceUpdate()
                                                       }
                                                   }>

                                                   </Tabs.TabPane>
                                               })
                                           }
                                       </Tabs>

                                    </div>

                                    <div className="bg-model-op-view-body-relation-body">
                                        {
                                            subViewStatus.map(function(svs){
                                                let showStyle = svs.show?{display:"block"}:{display:"none"}
                                                let v = svs.subView
                                                let  VComponent  = v.refView && getModelView(v.refView.app,v.refView.model,v.refView.viewType)
                                         
                                                return <div style={showStyle} key={v.refView.fieldName}>
                                                    {
                                                        VComponent?(
                                                            <hookView.HookProvider value={{cmmHost:undefined,parent:undefined}}>
                                                              <VComponent app={v.refView.app} 
                                                                  model={v.refView.model} 
                                                                  viewType={v.refView.viewType}
                                                                  viewParam={host.getSubRefViewParam(self, v, v.refView.fieldName)}
                                                                  >
                                                              </VComponent>
                                                            </hookView.HookProvider>
                                                          
                                                        ):null
                                                    }
                                                </div>
                                            })
                                        }
                                    </div>
                                  
                                    </div>):null
                                }
                            }>
                            </hookView.Hook>
                             {/*  relation end  */}

            </div>
    </hookView.HookProvider>
    }
}
export default hookView.withHook(withRouter(connect(mapStateToProps)(DetailView)))

