import React from "react"
import {ViewCMM} from './ViewCMM'
import {getDynamicRouterAppModelViewType} from '../../reducers/router'
import {getAppsSelector,corpModelsSelector} from '../../reducers/sys'
import {
    setListContextCriteria,
    setListContextData,
    removeListContextViewDataRecord,
    updateListContextViewDataRecord
} from '../actions/appContext'
import { goBack,push } from 'connected-react-router';
import {ViewFieldType} from '../modelView/ViewFieldType'
import { ModelAction } from '../mq/ModelAction'
import {CREATE_VIEW_DATA, RECORD_TAG,ARGS} from '../ReservedKeyword'
import { getRoutePath,goRoute } from '../routerHelper'
import {viewDataFromListContext} from '../reducers/appContext'
import {Button,Form,Tabs,Table, MessageBox} from 'element-react'
import {createDetailParam,createViewParam} from '../modelView/ViewParam'
import { and } from '../../criteria'
import ViewType from "../modelView/ViewType"
import {produce} from 'immer'
import {bindRecordTag} from '../fieldHelper'
import {nextRecordTag} from '../../lib/tag-helper'
export class ListViewCMM extends  ViewCMM{
    constructor(app,model,viewType){
        super(app,model,viewType)
    }

    static get s_viewType(){
        return ViewType.LIST
    }

    mapTo(state, ownProps){
        let baseProps= super.mapTo(state, ownProps);
        const {appModelViewType,viewParam} = ownProps
        const {ownerField} = (viewParam||{})
        let installApps=getAppsSelector(state)
        const {app,model,viewType}=appModelViewType
        let viewData=viewDataFromListContext(state)({app,model,viewType,ownerField})
        let newProps= Object.assign({},installApps,{viewData})
        return Object.assign({},baseProps,newProps,ownProps)
    }


    init(view){
   
    }

    update(view){
       
            
    }
    // const {columns,rows,currentPage,totalCount,pageSize} = self.cmmHost.getViewDatas(self,viewData)
    getViewDatas(view,viewData){
        let self =this
        let {pageData,data,totalCount,view:viewMeta,triggerGroups} = viewData
        const {app,model}=view
        let pageSize = pageData && pageData.pageSize||10
        let currentPage =  pageData && pageData.pageIndex||1
        totalCount = totalCount||0
        let columns = []
        let rows = []
        for(let d of ((data||{}).record||[])){
            rows.push(d)
        }
        for(let f of ((viewMeta||{}).fields||[])){
            if(!f.relationData){
                columns.push({
                    label:f.title,
                    prop:f.name
                    })
            }
            else{
                columns.push({
                    label:f.title,
                    prop:f.name,
                    render:(row, column, index)=>{
                        let d =row[column.prop]
                        if(d instanceof Object && d.record){
                            if(d.record instanceof Array){
                                return (d.record[0]||{})[f.relationData.toName]
                            }
                            else{
                                return d.record[f.relationData.toName]
                            }
                        }
                        else{
                            return ""
                        }
                    }
                })
            }
           
        }
     
        columns.push({
            label: "操作",
            width: 120,
            render: (row, column, index)=>{
                let tg= triggerGroups.find(x=>x.name=="opAction")
                let selSingleItemActionTg = triggerGroups.find(x=>x.name=="selSingleItemAction")
                return <span>
                    {
                        tg && tg.triggers.map(t=>{
                            return <Button type="text" size="small" onClick={()=>{
                                produce(t,draft=>{
                                    if(!draft.app || draft.app=="*"){
                                        draft.app = self.app
                                    }
                                    if(!draft.model || draft.model=="*"){
                                        draft.model = self.model
                                    }
                                    draft[ARGS]={id:row["id"],tag:row[RECORD_TAG]}
                                    self.doAction(view,draft)
                                })
                               
                            }} key={t.name}>{t.title}</Button>
                        })
                    }
                    {
                        selSingleItemActionTg && selSingleItemActionTg.triggers.map(t=>{
                            return <Button type="text" size="small" onClick={()=>{
                                produce(t,draft=>{
                                    if(!draft.app || draft.app=="*"){
                                        draft.app = self.app
                                    }
                                    if(!draft.model || draft.model=="*"){
                                        draft.model = self.model
                                    }
                                    draft[ARGS]={id:row["id"],tag:row[RECORD_TAG],data:row}
                                    self.doAction(view,draft)
                                    const {external} = view.props
                                    external && external.close && external.close()
                                })
                               
                            }} key={t.name}>{t.title}</Button>
                        })
                    }
                </span>
            }
        })
     
        return {columns,rows,currentPage,totalCount,pageSize}

    }

    getCriteria(viewData){
        const {criterias} = viewData
        if(criterias){
            let expArr=[]
            Object.keys(criterias).map(key=>{
                let v = criterias[key]
                expArr.push(v.expression)
            })
            if(expArr.length>0){
                return and(...expArr)
            }
        }
    }

    getOwnerFieldRawFieldValue(app,model,ownerField,ownerFieldValue){
        if(ownerField && ownerFieldValue!=null && ownerFieldValue!=undefined){
          if(ownerFieldValue instanceof Object){
             if(ownerFieldValue.record){
                 if(app==ownerField.relationData.targetApp && model==ownerField.relationData.targetModel){
                     return ownerFieldValue.record[ownerField.relationData.targetField]
                 }
                 else if(app == ownerField.relationData.relationApp && model == ownerField.relationApp.relationModel){
                  return ownerFieldValue.record[ownerField.relationData.relationField]
                 }
             }
             else{
                if(app==ownerField.relationData.targetApp && model==ownerField.relationData.targetModel){
                  return ownerFieldValue[ownerField.relationData.targetField]
                }
                else if(app == ownerField.relationData.relationApp && model == ownerField.relationApp.relationModel){
                return ownerFieldValue[ownerField.relationData.relationField]
                }
             }
          }
          else{
            return ownerFieldValue
          }
        }
    }

    didMount(view){
        let {viewParam,viewData,viewRefType}= view.props
        const {ownerField,ownerFieldValue}=viewParam||{}
        const {pageData} = viewData
        let criteria = this.getCriteria(viewData)
        let rawOwnerFieldValue = this.getOwnerFieldRawFieldValue(this.app,this.model,ownerField,ownerFieldValue)
        var reqParam={
            viewType:this.viewType,
            viewRefType:viewRefType,
            ownerField:ownerField?{
                app:ownerField.app,
                model:ownerField.model,
                name:ownerField.name,
                value:rawOwnerFieldValue,
            }:undefined,
            reqData:{
                app:this.app,
                model:this.model,
                criteria,
                pageIndex:(pageData&&pageData.pageIndex)||1,
                pageSize:(pageData&&pageData.pageSize)||10,
            }
        }
        var self=this
        new ModelAction(this.app,this.model).call("loadModelViewType",reqParam,function(data){
        data.bag && setListContextData(
            self.app,
            self.model,
            self.viewType,
            data.bag,
            ownerField,
        )
        },function(err){
            console.log(err)
        })
    }

    onCriteriaValueChange(data){
        let self=this
        setListContextCriteria(self.app,self.model,self.viewType,data.name,data)
    }

 

    doAction(view,trigger){
        if(this[trigger.name]){
            this[trigger.name].call(this,view,trigger)
        }
    }

    search(view){
        
    }

    onSizeChange(view,size){
        
    }

    onCurrentChange(view,currentPage){
      
    }

    toDetail(view,trigger){
        let self =this
        const {viewParam,viewRefType} = view.props
        let arg = trigger[ARGS]
        let id = arg.id
        if((viewParam||{}).ownerField){
            if(id){
                const {ownerField,ownerFieldValue,orgState} = viewParam
                let dViewParam = createDetailParam(ownerField,ownerFieldValue,undefined,orgState,id)
                this.showAppModelViewInModalQueue(trigger.app,trigger.model,trigger.viewType,viewRefType,dViewParam)
            }
            else{
                const {ownerField,ownerFieldValue,orgState} = viewParam
                const external={
                  getDatasource:(tag)=>{return self.getDatasource(view,tag)},
                  setDatasource:(datasource)=>{self.setDatasource(view,datasource)}
                }
                let tag =arg.tag
                let bindOwnerField = bindRecordTag(ownerField,tag)
                let dViewParam = createViewParam(bindOwnerField,ownerFieldValue,external,orgState)
                this.showAppModelViewInModalQueue(this.app,this.model,ViewType.CREATE,viewRefType,dViewParam)
            }
        }
        else{
            let routerPath = getRoutePath(trigger.app,trigger.model,trigger.viewType)
            goRoute(routerPath+"/"+arg.id,{modelID:id})
        }
    }

    doDelete(view,trigger){
        let arg = trigger[ARGS]
        let {id,tag}=arg
        let self=this
        const {viewParam} = view.props
        const {ownerField,orgState}=(viewParam||{})
        if(id){
            new ModelAction(this.app,this.model).call("delete",{
                id
            },function(res){
            if(res.errorCode==0){
                removeListContextViewDataRecord(self.app,self.model,self.viewType,[tag],ownerField)
            }
            else{
                MessageBox.alert(res.description)
            }
            },function(err){
                MessageBox.alert("通讯失败！")
            })
        }
        else{
            removeListContextViewDataRecord(self.app,self.model,self.viewType,[tag],ownerField)
        }
        
    }

    getDatasource(view,tag){
        const {viewData} = view.props
        var r = ((((viewData||{}).data||{})["record"]||[]).find(x=>x[RECORD_TAG]==tag))||{}
        let ret= {
            app:this.app,
            model:this.model,
            record:r
        }
         ret[RECORD_TAG]=tag
         return ret
    }

    buildFromSingleDatasource(data){
        let tag = data[RECORD_TAG]
        return bindRecordTag(data.record,tag)
        
    }
    setDatasource(view,data){
        let record = this.buildFromSingleDatasource(data)
        this.updateOrAddRecordToListViewData(view,record)
    }
    updateOrAddRecordToListViewData(view,record){
        const {viewParam} = view.props
        updateListContextViewDataRecord(this.app,this.model,this.viewType,record,(viewParam||{}).ownerField)
    }
    toAdd(view){
        const {viewParam,viewRefType} = view.props
        let self = this
        if((viewParam||{}).ownerField){
            const {ownerField,ownerFieldValue,orgState} = viewParam
            const external={
              getDatasource:(tag)=>{return self.getDatasource(view,tag)},
              setDatasource:(datasource)=>{self.setDatasource(view,datasource)}
            }
            let tag = nextRecordTag()
            let bindOwnerField = bindRecordTag(ownerField,tag)
            let dViewParam = createViewParam(bindOwnerField,ownerFieldValue,external,orgState)
            this.showAppModelViewInModalQueue(this.app,this.model,ViewType.CREATE,viewRefType,dViewParam)
        }
        else{
            self.closeModalSheet(view)
            var path=getRoutePath(this.app,this.model,ViewType.CREATE)
            view.props.dispatch(push(path))
        }
    }
    closeModalSheet(view){
        const {viewParam} = view.props
        const {external} = (viewParam||{})
        external && external.close && external.close(view)
    }
    doSelSingleItem(view,trigger){
        let arg = trigger[ARGS]
        const {viewParam} = view.props
        const {external} = (viewParam||{})
        external && external.selSingleItemAction && external.selSingleItemAction(arg.data)
        external && external.close && external.close(view)
    }
}