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
import {mapStateToProps} from './editViewMapStateToProps'
import {getModelView} from './ModelViewRegistry'
import {produce} from 'immer'
import { VIEW_COMMON_FIELDS_TAB_TITLE, VIEW_COMMON_FIELDS_TAB_KEY } from '../ReservedKeyword';
import { testCriteria } from './ViewFieldCriteria';
import { getIcon } from '../../svg'
class EditView extends React.Component{
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
    onFieldValueChange(fd,value){
        this.cmmHost.onFieldValueChange(fd,value,this)
    }
    render(){
        const self=this
        self.cmmHost.update(this)
        const host= self.cmmHost
        const {viewData,viewParam}=self.props
        const {ownerField} = (viewParam||{})
        const  {view:viewMeta,data,triggerGroups,subViews}=viewData
        const editData = data && data.record
        let relationViews = (subViews||[]).filter((subView)=>{
            return subView.refView.style===ViewFieldStyle.RELATION
        })
        let showFields = ((viewMeta&&viewMeta.fields)||[]).filter(x=>testCriteria(x.visibleCriteria,editData))||[]
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
                                                let IconCtrl = getIcon(t.icon)
                                                    return <Button type="primary" onClick={()=>{
                                                        host.doAction(self, t)
                                                    }} key={t.name}>
                                                    {IconCtrl}
                                                    {
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
                                            let mainFields = showFields.filter(x=>{
                                                return x.style==ViewFieldStyle.HEAD
                                            })||[]
                                            let subMainFields = showFields.filter(x=>{
                                                return x.style==ViewFieldStyle.SUB_HEAD
                                            })||[]
                                            return <div className="bg-model-op-view-body-main-h">
                                                        <div className="bg-model-op-view-body-main-h1">
                                                            <Form>
                                                            {
                                                                
                                                                mainFields.map((field,index)=>{
                                                                        let type=field.type
                                                                        let meta=field.meta
                                                                        let enable = testCriteria(field.enableCriteria,editData)
                                                                        let ctrlProps = field.ctrlProps
                                                                        let nValue=editData&&editData[field.name]!==undefined?editData[field.name]:""
                                                                        const FieldComponent=ViewFieldTypeRegistry.getComponent(type)
                                                                        let key=`${field.app}_${field.model}_${field.name}`
                                                                        return <Form.Item label={field.title} key={`form-item${key}`}>
                                                                                    <FieldComponent onChange={(value)=>{
                                                                                        self.onFieldValueChange(field,value)
                                                                                    }} value={nValue } key={key} meta={meta} enable={enable} ctrlProps={ctrlProps} title={field.title} relationData={field.relationData}  field={field}>></FieldComponent>    
                                                                            </Form.Item>
                                                                    })
                                                            }
                                                            </Form>
                                                        </div>

                                                        <div className="bg-model-op-view-body-main-h2">
                                                            <Form>
                                                            {
                                                                    subMainFields.map((field,index)=>{
                                                                        let type=field.type
                                                                        let enable = testCriteria(field.enableCriteria,editData)
                                                                        let meta=field.meta
                                                                        let ctrlProps = field.ctrlProps
                                                                        const FieldComponent=ViewFieldTypeRegistry.getComponent(type)
                                                                        let nValue=editData&&editData[field.name]!==undefined?editData[field.name]:""
                                                                        let key=`${field.app}_${field.model}_${field.name}`
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
                                            let fields =  viewMeta&&viewMeta.fields.filter(x=>{
                                                return x.style==ViewFieldStyle.LABEL
                                            })||[]
                                            return <div className="bg-model-op-view-body-main-label">
                                                {
                                                    fields.map((field,index)=>{
                                                                    let enable = testCriteria(field.enableCriteria,editData)
                                                                    let type=field.type
                                                                    let key=`${field.app}_${field.model}_${field.name}`
                                                                    let meta = field.meta
                                                                    let ctrlProps = field.ctrlProps
                                                                    const FieldComponent=ViewFieldTypeRegistry.getComponent(type)
                                                                    return <FieldComponent 
                                                                            title={field.title} 
                                                                            icon={field.icon} 
                                                                            meta={meta}
                                                                            enable={enable}
                                                                            ctrlProps={ctrlProps}
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


                    {/*  relation start  */}
                    <hookView.Hook hookTag="body-relation" render={()=>{ 
                                return <div className="bg-model-op-view-body-relation">
                                            <div className="bg-model-op-view-body-relation-nav">
                                                <Tabs type="card"  onTabClick={
                                                            fieldName=>{
                                                                for(let svs of self.subViewStatus){
                                                                    svs.show=false
                                                                }
                                                                let rSelf = self.subViewStatus.find(x=>x.subView.refView.fieldName == fieldName)
                                                                if(rSelf){
                                                                    rSelf.show=true
                                                                }
                                                                else{
                                                                    let v = relationViews.find(x=>x.refView.fieldName == fieldName)
                                                                    if(v){
                                                                        self.subViewStatus.push({
                                                                            subView:v,
                                                                            show:true,
                                                                            fieldName:fieldName
                                                                        })
                                                                    }
                                                                }
                                                                self.forceUpdate()
                                                            }
                                                        }>
                                                            <Tabs.TabPane tab={VIEW_COMMON_FIELDS_TAB_TITLE} key={VIEW_COMMON_FIELDS_TAB_KEY}>

                                                            </Tabs.TabPane>
                                                {
                                                    relationViews.map(v=>{
                                                        return <Tabs.TabPane tab={v.refView.title} key={v.refView.fieldName}>

                                                        </Tabs.TabPane>
                                                    })
                                                }
                                            </Tabs>
                                    </div>
                                    <div className="bg-model-op-view-body-relation-body">
                                        {
                                            self.subViewStatus.map(function(svs){
                                                let showStyle = svs.show?{display:"block"}:{display:"none"}
                                                let v = svs.subView
                                                let  VComponent  = v.refView && getModelView(v.refView.app,v.refView.model,v.refView.viewType)
                                                let ownerField = viewMeta.fields.find(x=>x.name==v.refView.fieldName)
                                                let viewRefType = v.refView.refTypes.join(",")
                                                return <div style={showStyle} key={v.refView.fieldName}>
                                                    {
                                                        VComponent?(
                                                            <hookView.HookProvider value={{cmmHost:undefined,parent:undefined}}>
                                                            <VComponent app={v.refView.app} 
                                                                model={v.refView.model} 
                                                                viewType={v.refView.viewType}
                                                                viewParam={host.getSubRefViewParam(self, v,ownerField)}
                                                                viewRefType={viewRefType}
                                                                >
                                                            </VComponent>
                                                            </hookView.HookProvider>
                                                        
                                                        ):null
                                                    }
                                                </div>
                                            })
                                        }
                                        {
                                            self.subViewStatus.findIndex(x=>x.show==true)<0?<>
                                              {/* common start */}
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
                                                                        let enable1 = true
                                                                        let enable2 = true
                                                                        const  Com2=gfs.components.length>1?gfs.components[1]:null
                                                                        if(Com1){
                                                                            let fd=gfs.fields[0]
                                                                            enable1=testCriteria(fd.enableCriteria,editData)
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
                                                                            enable1=testCriteria(fd.enableCriteria,editData)
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
                                                                                                    }} key={key1} value={value1} meta={meta1} enable={enable1} ctrlProps={ctrlProps1} relationData={gfs.fields[0].relationData} field={gfs.fields[0]}></Com1>
                                                                                        </Form.Item>
                                                                                        </div>
                                                                                        <div className="bg-model-op-view-body-common-two-col-second">
                                                                                        {Com2!=null && (<Form.Item label={gfs.fields[1].title}>
                                                                                            <Com2 {...props2} onChange={(value)=>{
                                                                                                        self.onFieldValueChange(gfs.fields[1],value)
                                                                                                    }} key={key2} value={value2} meta={meta2} enable={enable2} ctrlProps={ctrlProps2} relationData={gfs.fields[1].relationData} field={gfs.fields[1]}></Com2>
                                                                                        </Form.Item>)
                                                                                    }
                                                                                        </div>
                                                                                    </div>
                                                                                </Form.Item>):(
                                                                                    <div className="bg-model-op-view-body-common-one-col" key={`fi-${key1}`}>
                                                                                        <Form.Item label={gfs.fields[0].title}>
                                                                                            <Com1 {...props1} onChange={(value)=>{
                                                                                                        self.onFieldValueChange(gfs.fields[0],value)
                                                                                                    }} key={key1} value={value1} meta={meta1} enable={enable1} ctrlProps={ctrlProps1} relationData={gfs.fields[0].relationData}  field={gfs.fields[0]}></Com1>
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
                                            </>:null
                                        }
                                    </div>
                              
                                </div>
                                }
                            }>
                            </hookView.Hook>
                           {/*  relation end  */}

            </div>
    </hookView.HookProvider>
    }
}
export default hookView.withHook(withRouter(connect(mapStateToProps)(EditView)))

