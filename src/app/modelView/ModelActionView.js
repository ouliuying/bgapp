import React from 'react'
import {connect} from 'react-redux'
import {
    withRouter,
    Switch,
    Route
} from 'react-router-dom'
import ViewFieldTypeRegistry from './ViewFieldTypeRegistry'
import {push} from 'connected-react-router'
import {Button,Table,Pagination,Tag,Row, Col,Icon as FontIcon,Divider,Form,Tabs} from "../../ui"
import hookView from '../../app/HookView'
import ViewFieldStyle from './ViewFieldStyle'
import {mapStateToProps} from './modelActionViewMapStateToProps'
import { testCriteria } from './ViewFieldCriteria';
class ModelActionView extends React.Component{
    constructor(props){
        super(props)
        const {cmmHost,parent,actionName}=this.props
        if(!parent){
            this.cmmHost=cmmHost
            this.cmmHost.init(this)
        }
        else{
            this.parent=parent
            this.cmmHost=cmmHost
        }
        this.actionName = actionName
    }
    componentDidMount(){
        this.cmmHost.didMount(this)
    }
    onFieldValueChange(fd,value){
        this.cmmHost.onFieldValueChange(fd,value,this)
    }
    render(){
        let self = this
        self.cmmHost.update(this)
        const host= self.cmmHost
        const {viewData,viewParam}=self.props
        const {ownerField} = (viewParam||{})
        const  {view:viewMeta,data,triggerGroups,subViews}=viewData
        const editData = data && data.record
        let showFields = ((viewMeta&&viewMeta.fields)||[]).filter(x=>testCriteria(x.visibleCriteria,editData))||[]
        return  <hookView.HookProvider value={{cmmHost:self.cmmHost,parent:self}}>
                <div className="bg-model-op-view bg-flex-full ">
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
                                            let mainFields = showFields.filter(x=>x.style==ViewFieldStyle.HEAD)||[]
                                            let subMainFields = showFields.filter(x=>x.style==ViewFieldStyle.SUB_HEAD)||[]
                                            return <div className="bg-model-op-view-body-main-h">
                                                        <div className="bg-model-op-view-body-main-h1">
                                                            <Form>
                                                            {
                                                                
                                                                mainFields.map((field,index)=>{
                                                                        let type=field.type
                                                                        let meta=field.meta
                                                                        let ctrlProps = field.ctrlProps
                                                                        let nValue=editData&&editData[field.name]!==undefined?editData[field.name]:""
                                                                        let enable = testCriteria(field.enableCriteria,editData)
                                                                        const FieldComponent=ViewFieldTypeRegistry.getComponent(type)
                                                                        let key=`${field.app}_${field.model}_${field.name}`
                                                                        return <Form.Item label={field.title} key={`form-item${key}`}>
                                                                                    <FieldComponent onChange={(value)=>{
                                                                                        self.onFieldValueChange(field,value)
                                                                                    }} value={nValue } key={key} meta={meta} enable={enable} ctrlProps={ctrlProps} title={field.title} relationData={field.relationData} field={field}></FieldComponent>    
                                                                            </Form.Item>
                                                                    })
                                                            }
                                                            </Form>
                                                        </div>

                                                        <div className="bg-model-op-view-body-main-h2">
                                                            <Form >
                                                            {
                                                                    
                                                                    subMainFields.map((field,index)=>{
                                                                        let type=field.type
                                                                        let meta=field.meta
                                                                        let ctrlProps = field.ctrlProps
                                                                        const FieldComponent=ViewFieldTypeRegistry.getComponent(type)
                                                                        let nValue=editData&&editData[field.name]!==undefined?editData[field.name]:""
                                                                        let key=`${field.app}_${field.model}_${field.name}`
                                                                        let enable = testCriteria(field.enableCriteria,editData)
                                                                        return <Form.Item label={field.title} key={`form-item${key}`}>
                                                                                <FieldComponent onChange={(value)=>{
                                                                                        self.onFieldValueChange(field,value)
                                                                                    }} value={nValue} key={key} meta={meta} enable={enable} ctrlProps={ctrlProps} title={field.title} relationData={field.relationData} field={field}></FieldComponent>    
                                                                            </Form.Item>
                                                                    })
                                                            } 
                                                            </Form>
                                                        </div>
                                                </div>
                                        }}></hookView.Hook>
                                        {/*  body-main-h end  */}


                                        {/*  body-main-label begin  */}
                                        <hookView.Hook hookTag="body-main-label"  render={()=>{
                                            let fields=(showFields.filter(x=>{
                                                return x.style==ViewFieldStyle.LABEL
                                            })||[])
                                            return <div className="bg-model-op-view-body-main-label">
                                                {
                                                    fields.map(field=>{
                                                                    let type=field.type
                                                                    let key=`${field.app}_${field.model}_${field.name}`
                                                                    let ctrlProps = field.ctrlProps
                                                                    let meta = field.meta
                                                                    const FieldComponent=ViewFieldTypeRegistry.getComponent(type)
                                                                    let enable = testCriteria(field.enableCriteria,editData)
                                                                    return <FieldComponent 
                                                                            title={field.title} 
                                                                            icon={field.icon} 
                                                                            ctrlProps={ctrlProps}
                                                                            enable={enable}
                                                                            meta={meta}
                                                                            className="bg-op-label" 
                                                                            iconClassName="bg-op-label-icon"
                                                                            key={key}></FieldComponent>   
                                                        })
                                                }
                                            </div>
                                        }}></hookView.Hook>
                                        {/*  body-main-label end  */}
                                </div>
                            }}>
                            </hookView.Hook>
                    </div>

                    }}></hookView.Hook>
                    {/*  body end  */}



                    {/*  common start  */}
                    <hookView.Hook  hookTag="body-common"  render={()=>{
                                                let commonGroupFields=[]
                                                for(var fd of showFields){
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
                                                                    let ctrlProps1=null
                                                                    let ctrlProps2=null
                                                                    let enable1 =true
                                                                    let enable2 =true
                                                                    const  Com2=gfs.components.length>1?gfs.components[1]:null
                                                                    if(Com1){
                                                                        let fd=gfs.fields[0]
                                                                        enable1 = testCriteria(fd.enableCriteria,editData)
                                                                        meta1=fd.meta
                                                                        ctrlProps1=fd.ctrlProps
                                                                        key1=`${fd.app}_${fd.model}_${fd.name}`
                                                                        value1=editData&&editData[fd.name]!==undefined?editData[fd.name]:""
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
                                                                        enable2 = testCriteria(fd.enableCriteria,editData)
                                                                        meta2=fd.meta
                                                                        ctrlProps2=fd.ctrlProps
                                                                        value2=editData&&editData[fd.name]!==null?editData[fd.name]:""
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
                                                                                                    self.onFieldValueChange(gfs.fields[0],value)
                                                                                                }} key={key1} value={value1} enable={enable1} meta={meta1} ctrlProps={ctrlProps1} relationData={gfs.fields[0].relationData} field={gfs.fields[0]}></Com1>
                                                                                    </Form.Item>
                                                                                    </div>
                                                                                    <div className="bg-model-op-view-body-common-two-col-second">
                                                                                    {Com2!=null && (<Form.Item label={gfs.fields[1].title}>
                                                                                        <Com2 {...props2} onChange={(value)=>{
                                                                                                    self.onFieldValueChange(gfs.fields[1],value)
                                                                                                }} key={key2} value={value2} meta={meta2} enable={enable2}  ctrlProps={ctrlProps2} relationData={gfs.fields[1].relationData} field={gfs.fields[1]}></Com2>
                                                                                    </Form.Item>)
                                                                                }
                                                                                    </div>
                                                                                </div>
                                                                            </Form.Item>):(
                                                                            
                                                                                <div className="bg-model-op-view-body-common-one-col" key={`fi-${key1}`}>
                                                                        
                                                                                <Form.Item label={gfs.fields[0].title}>
                                                                                        <Com1 {...props1} onChange={(value)=>{
                                                                                                    self.onFieldValueChange(gfs.fields[0],value)
                                                                                                }} key={key1} value={value1} meta={meta1} enable={enable1} ctrlProps={ctrlProps1} relationData={gfs.fields[0].relationData} field={gfs.fields[0]}></Com1>
                                                                                    </Form.Item>  
                                                                                </div>
                                                                            
                                                                            
                                                                        )         
                                                            })
                                                        }
                                                        </Form>
                                                </div>
                                            }}>

                                            </hookView.Hook>
                                            {/* common end */}
                                            
                          

            </div>
        </hookView.HookProvider>
    }
}

export default hookView.withHook(withRouter(connect(mapStateToProps)(ModelActionView)))