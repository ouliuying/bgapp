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
import {Button,Form,Tabs,Table, MessageBox} from 'element-react'
import {getUIAppCache} from '../../reducers/sys'
import ViewFieldTypeRegistry from './ViewFieldTypeRegistry'
import ViewFieldStyle from './ViewFieldStyle'
import {getDynamicRouterAppModelViewType} from '../../reducers/router'
//import {modelDataFromCreateContext} from '../reducers/createContext'
// import {
//     setCreateContextFieldValue,
//     clearCreateContextFieldValue,
//     setCreateContextFeededViewField
// } from '../actions/createContext'
import produce from "immer"
import {getAppsSelector,corpModelsSelector} from '../../reducers/sys'
import ViewType from './ViewType';
import {ViewFieldType} from './ViewFieldType'
import { ModelAction } from '../mq/ModelAction';
//import {CREATE_VIEW_FEEDED_DATA,CREATE_VIEW_SERVER_FEED_DATA} from '../ReservedKeyword'
import { getRoutePath,goRoute } from '../routerHelper';
class EditView extends React.Component{
    constructor(props){
        super(props)
        // const {uiAppCache}=this.props
        // const {app,model,viewType}=this.props.appModelViewType
        // this.app=app
        // this.model=model
        // this.viewType=viewType
        // const theApp=uiAppCache[app]
        // const theModelViews=theApp["modelViews"]
        // const theModel=theModelViews[model]
        // const theViews=theModel["views"]
        // this.modelView=theViews[viewType]
        // const {installApps,models}=this.props
        // this.shadowFields=produce(this.modelView.fields,draft=>{
        //     draft.map(fd=>{
        //         fd.appMeta=installApps[fd.app]
        //         fd.modelMeta=models[fd.app][fd.model]
        //         if(fd.fieldView){
        //             fd.fieldView.fields.map(ffd=>{
        //                 ffd.appMeta=installApps[ffd.app]
        //                 ffd.modelMeta=models[ffd.app][ffd.model]
        //                 ffd.parentField=fd
        //                 return ffd
        //             })
        //         }

        //         return fd
        //     })
        // })
    }
    componentDidMount(){
    //    var feededViewFields=this.getFeededViewFields()
    //    var self=this
    //    if(feededViewFields.length>0){
    //        new ModelAction(this.app,this.model).call("feedViewField",feededViewFields,function(data){
    //         data.bag && setCreateContextFeededViewField({
    //             app:self.app,
    //             model:self.model,
    //             feededData:data.bag[CREATE_VIEW_SERVER_FEED_DATA]||[]
    //         })
    //        },function(err){
    //             console.log(err)
    //        })
    //    }
    }
    // getFeededViewFields(){
    //     var feededViewFields=[]
    //     this.shadowFields.map(fd=>{
    //         if(fd.type===ViewFieldType.Many2OneDataSetSelectField){
    //             var obj={
    //                 viewFieldType:ViewFieldType.Many2OneDataSetSelectField,
    //                 app:fd.app,
    //                 model:fd.model,
    //                 name:fd.name
    //             }
    //             feededViewFields.push(obj)
    //         }
    //         if(fd.fieldView){
    //             fd.fieldView.fields.map(sfd=>{
    //                 if(sfd.type===ViewFieldType.Many2OneDataSetSelectField){
    //                     var obj={
    //                         viewFieldType:ViewFieldType.Many2OneDataSetSelectField,
    //                         app:sfd.app,
    //                         model:sfd.model,
    //                         name:sfd.name,
    //                         parentName:fd.name
    //                     }
    //                     feededViewFields.push(obj)
    //                 }
    //             })
    //         }
    //     })
    //     return feededViewFields
    // }
    // getViewFieldMeta(field){
    //     const {modelData}=this.props
    //     const feededData=modelData[CREATE_VIEW_FEEDED_DATA]||[]
    //     let meta={s:field.meta}
    //     for(let data of feededData){
    //         if(data.app===field.app &&
    //              data.model===field.model && 
    //              data.name===field.name && 
    //              data.viewFieldType===field.type){
    //                 meta.d=data[CREATE_VIEW_SERVER_FEED_DATA]
    //              }
    //     }
    //     return meta
    // }
    componentWillMount(){
        
    }
    onFieldValueChange(fd,value){
        //setCreateContextFieldValue([[fd,value]])
    }
    doSave(){
    //     let self=this
    //     const {modelData}=this.props
    //     let createData={
    //         app:self.app,
    //         model:self.model
    //     }
    //    this.buildCreateData(createData,modelData)
    //    new ModelAction(this.app,this.model).call("create",createData,function(res){
    //      if(res.errorCode==0){
    //         var newID=res.bag["id"]
    //         var editPath=getRoutePath(self.app,self.model,"edit")
    //         goRoute(editPath,{id:newID})
    //      }
    //      else{
    //          MessageBox.alert(res.description)
    //      }
    //     },function(err){
    //         MessageBox.alert("通讯失败！")
    //     })

    }

    // buildCreateData(createData,modelData){
    //     let self=this
    //     createData.record={}
    //     Object.keys(modelData).map(key=>{
    //         let kv=modelData[key]
    //         if(!self.isChildModel(kv)){
    //             createData.record[key]=kv
    //         }
    //         else{
    //             let subModelData=modelData.fieldValues
    //             let subCreateData={
    //                 app:kv.app,
    //                 model:kv.model
    //             }
    //             createData[key]=subCreateData
    //             self.buildCreateData(subCreateData,subModelData)
    //         }
    //         return kv
    //     })
    //     return createData
    // }
    // isChildModel(v){
    //     if(v instanceof Object){
    //         return (v.app!==undefined && v.app!==null) && 
    //         (v.model!==undefined && v.model!==null) && 
    //         (v.fieldValues!==undefined && v.fieldValues!==null)
    //     }
    //     return false
    // }
    // doCancel(){
    //     clearCreateContextFieldValue(this.app,this.model)
    // }
    render(){
        let self=this
        return <div>edit</div>
        // const {modelData}=this.props
        // return <div className="bg-model-op-view bg-flex-full ">
        //     <hookView.Hook hookTag="toolbar" render={()=>{
        //             return <div className="bg-model-op-view-toolbar">
        //                 <button className="bg-model-op-view-toolbar-back"  onClick={()=>{
        //                     self.props.dispatch(goBack())
        //                 }}>
        //                 <Icon.LocationGoBack></Icon.LocationGoBack>
        //                 </button>
        //         </div>
        //         }
        //     }/>

        //     <hookView.Hook hookTag="actions" render={()=>{
        //         return <div className="bg-model-op-view-actions">
        //                     <hookView.Hook hookTag="actions-main-group" render={()=>{
        //                         return <div className="bg-model-op-view-actions-main-group">
        //                         <Button type="success" onClick={()=>{
        //                             self.doSave()
        //                         }}>
        //                             保存
        //                         </Button>
        //                         &nbsp;
        //                         <Button type="danger" onClick={()=>{
        //                             self.doCancel()
        //                         }}>
        //                             取消
        //                         </Button>
        //                     </div>
        //                     }}>
        //                     </hookView.Hook>
                            
        //                     <hookView.Hook hookTag="actions-sub-group" render={
        //                         ()=>{
        //                             return <div className="bg-model-op-view-actions-sub-group">
                                            
        //                             </div>
        //                         }
        //                     }>
        //                     </hookView.Hook>
                            
        //                 </div>
        //     }}>

        //     </hookView.Hook>

        //     {/*  body begin  */}
        //     <hookView.Hook hookTag="body" render={()=>{
        //        return <div className="bg-model-op-view-body">
        //             <hookView.Hook hookTag="body-main" render={()=>{
        //                 return <div className="bg-model-op-view-body-main">
        //                         {/*  body-main-h begin  */}
        //                         <hookView.Hook hookTag="body-main-h" render={()=>{
        //                             return <div className="bg-model-op-view-body-main-h">
        //                                         <div className="bg-model-op-view-body-main-h1">
        //                                         <Form labelPosition="top" >
        //                                         {
        //                                             self.shadowFields.map((field,index)=>{
        //                                                     let type=field.type
        //                                                     let meta=self.getViewFieldMeta(field)
        //                                                     let nValue=modelData[field.name]!==undefined?modelData[field.name]:""
        //                                                    // nValue=this.state.value
        //                                                     const FieldComponent=ViewFieldTypeRegistry.getComponent(type)
        //                                                     let key=`${field.app}_${field.model}_${field.name}`
        //                                                     return field.style===ViewFieldStyle.HEAD?(
        //                                                         <Form.Item label={field.title} key={`form-item${key}`}>
        //                                                                   <FieldComponent onChange={(value)=>{
        //                                                                       self.onFieldValueChange(field,value)
        //                                                                   }} value={nValue} key={key} meta={meta} title={field.title}></FieldComponent>    
        //                                                         </Form.Item>
        //                                                     ):null
        //                                                 })
        //                                         }
        //                                         </Form>
                                             
        //                                         </div>

        //                                         <div className="bg-model-op-view-body-main-h2">
        //                                         <Form labelPosition="top" >
        //                                         {
                                                        
        //                                                 self.shadowFields.map((field,index)=>{
        //                                                     let type=field.type
        //                                                     let meta=self.getViewFieldMeta(field)
        //                                                     const FieldComponent=ViewFieldTypeRegistry.getComponent(type)
        //                                                     let nValue=modelData[field.name]!==undefined?modelData[field.name]:""
        //                                                     let key=`${field.app}_${field.model}_${field.name}`
        //                                                     return field.style===ViewFieldStyle.SUB_HEAD?(
        //                                                         <Form.Item label={field.title} key={`form-item${key}`}>
        //                                                             <FieldComponent onChange={(value)=>{
        //                                                                       self.onFieldValueChange(field,value)
        //                                                                   }} value={nValue} key={key} meta={meta} title={field.title}></FieldComponent>    
        //                                                         </Form.Item>
        //                                                     ):null
        //                                                 })
        //                                         } 
        //                                         </Form>
        //                                         </div>
        //                                 </div>
        //                         }}></hookView.Hook>
        //                         {/*  body-main-h end  */}


        //                         {/*  body-main-label begin  */}
        //                         <hookView.Hook hookTag="body-main-label" render={()=>{
        //                             return <div className="bg-model-op-view-body-main-label">
        //                                   {
        //                                       self.shadowFields.map((field,index)=>{
        //                                                     let type=field.type
        //                                                     let key=`${field.app}_${field.model}_${field.name}`
        //                                                     const FieldComponent=ViewFieldTypeRegistry.getComponent(type)
        //                                                     return field.style===ViewFieldStyle.LABEL?(
                                                                
        //                                                             <FieldComponent 
        //                                                             title={field.title} 
        //                                                             icon={field.icon} 
        //                                                             className="bg-op-label" 
        //                                                             iconClassName="bg-op-label-icon"
        //                                                             key={key}></FieldComponent>
                                                                
                                                                
        //                                                     ):null
        //                                         })
        //                                   }
        //                             </div>
        //                         }}></hookView.Hook>
        //                         {/*  body-main-label end  */}
        //                 </div>
        //             }}>
        //             </hookView.Hook>

        //             <hookView.Hook  hookTag="body-common" render={()=>{
        //                 let commonGroupFields=[]
        //                 for(var fd of self.shadowFields){
        //                     if(fd.style===ViewFieldStyle.NORMAL){
        //                         let currGF=null
        //                         if(fd.colSpan>1){
        //                             currGF={fields:[],components:[],colCount:0,rowSpan:0,colSpan:0}
        //                             commonGroupFields.push(currGF)
        //                         }
        //                         else{
        //                             if(commonGroupFields.length>0){
        //                                 currGF=commonGroupFields[commonGroupFields.length-1]
        //                                 if(currGF.colCount>1){
        //                                     currGF={fields:[],components:[],colCount:0,rowSpan:0,colSpan:0}
        //                                     commonGroupFields.push(currGF)
        //                                 }
        //                             }
        //                             else{
        //                                 currGF={fields:[],components:[],colCount:0,rowSpan:0,colSpan:0}
        //                                 commonGroupFields.push(currGF)
        //                             }
        //                         }
        //                         currGF.fields.push(fd)
        //                         currGF.components.push(ViewFieldTypeRegistry.getComponent(fd.type))
        //                         currGF.colCount=currGF.colCount+fd.colSpan
        //                         if(currGF.rowSpan<fd.rowSpan){
        //                             currGF.rowSpan=fd.rowSpan
        //                         }
        //                     }
        //                 }
        //                 return <div className="bg-model-op-view-body-common">
        //                          <Form labelPosition="top">
        //                         {
        //                             commonGroupFields.map((gfs,index)=>
        //                             {
        //                                     const Com1=gfs.components[0]
        //                                     let props1=null
        //                                     let props2=null
        //                                     let key1=null
        //                                     let key2=null
        //                                     let value1=null
        //                                     let value2=null
        //                                     let meta1=null
        //                                     let meta2=null
        //                                     const  Com2=gfs.components.length>1?gfs.components[1]:null
        //                                     if(Com1){
        //                                         let fd=gfs.fields[0]
        //                                         meta1=self.getViewFieldMeta(fd)
        //                                         key1=`${fd.app}_${fd.model}_${fd.name}`
        //                                         value1=modelData[fd.name]!==undefined?modelData[fd.name]:""
        //                                         props1={
        //                                             name:fd.name
        //                                         }
        //                                         if(fd.relationData){
        //                                             props1.relationData=fd.relationData
        //                                             props1.orgSelData={}
        //                                         }
        //                                     }
        //                                     if(Com2){
        //                                         let fd=gfs.fields[1]
        //                                         meta2=self.getViewFieldMeta(fd)
        //                                         value2=modelData[fd.name]!==null?modelData[fd.name]:""
        //                                         key2=`${fd.app}_${fd.model}_${fd.name}`
        //                                         props2={
        //                                             name:fd.name
        //                                         }
        //                                         if(fd.relationData){
        //                                             props2.relationData=fd.relationData
        //                                             props2.orgSelData={}
        //                                         }
        //                                     }
        //                                     return (gfs.fields.length>1||gfs.colCount===1)?(
        //                                              <Form.Item key={`fi-${key1}`}>
        //                                                  <div className="bg-model-op-view-body-common-two-col">
        //                                                      <div className="bg-model-op-view-body-common-two-col-first">
        //                                                      <Form.Item label={gfs.fields[0].title}>
        //                                                         <Com1 {...props1} onChange={(value)=>{
        //                                                                       self.onFieldValueChange(gfs.fields[0],value)
        //                                                                   }} key={key1} value={value1} meta={meta1}></Com1>
        //                                                     </Form.Item>
        //                                                      </div>
        //                                                      <div className="bg-model-op-view-body-common-two-col-second">
        //                                                      {Com2!=null && (<Form.Item label={gfs.fields[1].title}>
        //                                                          <Com2 {...props2} onChange={(value)=>{
        //                                                                       self.onFieldValueChange(gfs.fields[1],value)
        //                                                                   }} key={key2} value={value2} meta={meta2}></Com2>
        //                                                     </Form.Item>)
        //                                                 }
        //                                                      </div>
        //                                                  </div>
        //                                              </Form.Item>):(
        //                                                  <div className="bg-model-op-view-body-common-one-col" key={`fi-${key1}`}>
        //                                                     <Form.Item label={gfs.fields[0].title}>
        //                                                         <Com1 {...props1} onChange={(value)=>{
        //                                                                       self.onFieldValueChange(gfs.fields[0],value)
        //                                                                   }} key={key1} value={value1} meta={meta1}></Com1>
        //                                                     </Form.Item>  
        //                                                  </div>
                                                    
        //                                          )         
        //                               })
        //                         }
        //                          </Form>
        //                 </div>
        //             }}>

        //             </hookView.Hook>

        //             <hookView.Hook hookTag="body-one2one-field-view" render={()=>{
        //                 return self.shadowFields.map(pfd=>{
        //                     if(pfd.style!==ViewFieldStyle.ONE2ONE_VIEW){
        //                         return null
        //                     }
        //                     let commonGroupFields=[]
        //                     for(var fd of pfd.fieldView.fields){
                                
        //                         let currGF=null
        //                         if(fd.colSpan>1){
        //                             currGF={fields:[],components:[],colCount:0,rowSpan:0,colSpan:0}
        //                             commonGroupFields.push(currGF)
        //                         }
        //                         else{
        //                             if(commonGroupFields.length>0){
        //                                 currGF=commonGroupFields[commonGroupFields.length-1]
        //                                 if(currGF.colCount>1){
        //                                     currGF={fields:[],components:[],colCount:0,rowSpan:0,colSpan:0}
        //                                     commonGroupFields.push(currGF)
        //                                 }
        //                             }
        //                             else{
        //                                 currGF={fields:[],components:[],colCount:0,rowSpan:0,colSpan:0}
        //                                 commonGroupFields.push(currGF)
        //                             }
        //                         }
        //                         currGF.fields.push(fd)
        //                         currGF.components.push(ViewFieldTypeRegistry.getComponent(fd.type))
        //                         currGF.colCount=currGF.colCount+fd.colSpan
        //                         if(currGF.rowSpan<fd.rowSpan){
        //                             currGF.rowSpan=fd.rowSpan
        //                         }
                                
        //                     }

        //                     const o2oModelData=modelData[pfd.name]||{}
        //                     const fieldValues=o2oModelData["fieldValues"]||{}
        //                             return <div className="bg-model-op-view-body-common">
        //                                 <h3>fd.title</h3>
        //                                 <div>


        //                                 <Form labelPosition="top">
        //                                 {
        //                                     commonGroupFields.map((gfs,index)=>
        //                                     {
        //                                             const Com1=gfs.components[0]
        //                                             let props1=null
        //                                             let props2=null
        //                                             let key1=null
        //                                             let key2=null
        //                                             let value1=null
        //                                             let value2=null
        //                                             let meta1=null
        //                                             let meta2=null
        //                                             const  Com2=gfs.components.length>1?gfs.components[1]:null
        //                                             if(Com1){
        //                                                 let fd=gfs.fields[0]
        //                                                 meta1=self.getViewFieldMeta(fd)
        //                                                 key1=`${fd.app}_${fd.model}_${fd.name}`
        //                                                 value1=fieldValues[fd.name]!==undefined?fieldValues[fd.name]:""
        //                                                 props1={
        //                                                     name:fd.name
        //                                                 }
        //                                                 if(fd.relationData){
        //                                                     props1.relationData=fd.relationData
        //                                                     props1.orgSelData={}
        //                                                 }
        //                                             }
        //                                             if(Com2){
        //                                                 let fd=gfs.fields[1]
        //                                                 meta2=self.getViewFieldMeta(fd)
        //                                                 value2=fieldValues[fd.name]!==undefined?fieldValues[fd.name]:""
        //                                                 key2=`${fd.app}_${fd.model}_${fd.name}`
        //                                                 props2={
        //                                                     name:fd.name
        //                                                 }
        //                                                 if(fd.relationData){
        //                                                     props2.relationData=fd.relationData
        //                                                     props2.orgSelData={}
        //                                                 }
        //                                             }
        //                                             return (gfs.fields.length>1||gfs.colCount===1)?(
        //                                                     <Form.Item key={`fi-${key1}`}>
        //                                                         <div className="bg-model-op-view-body-common-two-col">
        //                                                             <div className="bg-model-op-view-body-common-two-col-first">
        //                                                             <Form.Item label={gfs.fields[0].title}>
        //                                                                 <Com1 {...props1} onChange={(value)=>{
        //                                                                             self.onFieldValueChange(gfs.fields[0],value)
        //                                                                         }} key={key1} value={value1} meta={meta1}></Com1>
        //                                                             </Form.Item>
        //                                                             </div>
        //                                                             <div className="bg-model-op-view-body-common-two-col-second">
        //                                                             {Com2!=null && (<Form.Item label={gfs.fields[1].title}>
        //                                                                 <Com2 {...props2} onChange={(value)=>{
        //                                                                             self.onFieldValueChange(gfs.fields[1],value)
        //                                                                         }} key={key2} value={value2} meta={meta2}>></Com2>
        //                                                             </Form.Item>)
        //                                                         }
        //                                                             </div>
        //                                                         </div>
        //                                                     </Form.Item>):(
        //                                                         <div className="bg-model-op-view-body-common-one-col" key={`fi-${key1}`}>
        //                                                             <Form.Item label={gfs.fields[0].title}>
        //                                                                 <Com1 {...props1} onChange={(value)=>{
        //                                                                             self.onFieldValueChange(gfs.fields[0],value)
        //                                                                         }} key={key1} value={value1} meta={meta1}>></Com1>
        //                                                             </Form.Item>  
        //                                                         </div>
                                                            
        //                                                 )         
        //                                     })
        //                                 }
        //                          </Form>

        //                                 </div>
        //                             </div>
                            
        //                 })
        //             }}>

        //             </hookView.Hook>
        //             {/**  create model dont support add target model same time  */}
        //              <div className="bg-big-line">

        //             </div>

        //             <hookView.Hook hookTag="body-relation" render={()=>{
        //                      let firstField=self.shadowFields.find((field)=>{
        //                             return field.style===ViewFieldStyle.RELATION
        //                      })
                             
        //                     return firstField?(<div className="bg-model-op-view-body-relation">
        //                        <Tabs activeName={firstField?firstField.name:""} onTabClick={ (tab) => console.log(tab.props.name) }>
        //                        {
        //                             self.shadowFields.map((field,index)=>{
        //                                         return field.style===ViewFieldStyle.RELATION?(
        //                                                 <Tabs.Pane label={field.title} name={field.name}>
        //                                                         <div className="bg-model-op-view-body-relation-work-area">
        //                                                                 <div className="sub-toolbar">
        //                                                                     <Button type="primary">添加</Button>
        //                                                                 </div>
        //                                                                 <div className="sub-body">
        //                                                                 <Table style={{width: '100%'}}
        //                                                                         // columns={this.state.columns}
        //                                                                         // data={this.state.data}
        //                                                                         border={true}
        //                                                                         height={250}
        //                                                                         highlightCurrentRow={true}
        //                                                                         onCurrentChange={item=>{console.log(item)}}
        //                                                                         />
        //                                                                 </div>
        //                                                         </div>
        //                                                 </Tabs.Pane>
        //                                         ):null
        //                             })
        //                         }
        //                     </Tabs>
        //                     </div>):null
        //                 }
        //             }>
        //             </hookView.Hook> 

        //        </div>



        //     }}></hookView.Hook>
        //     {/*  body end  */}
        // </div>
    }
}
function mapStateToProps(state){
    // let props= getUIAppCache(state)
    // let routerLocationState=getDynamicRouterAppModelViewType(state)
    // let installApps=getAppsSelector(state)
    // let models=corpModelsSelector(state)
    // const {app,model}=routerLocationState.appModelViewType
    // let modelData=modelDataFromCreateContext(state)({app,model})
    // return Object.assign({},props,routerLocationState,installApps,models,{modelData})
    return state
}
export default hookView.withHook(withRouter(connect(mapStateToProps)(EditView)))
