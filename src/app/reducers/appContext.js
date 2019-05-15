import {
    SET_CREATE_CONTEXT_FIELD_VALUE,
    CLEAR_CREATE_CONTEXT_FIELD_VALUE,
    SET_CREATE_CONTEXT_VIEW_DATA,
    SET_LIST_CONTEXT_CRITERIA,
    SET_LIST_CONTEXT_VIEW_DATA,
    SET_DETAIL_CONTEXT_VIEW_DATA,
    SET_EDIT_CONTEXT_VIEW_DATA,
    SET_EDIT_CONTEXT_FIELD_VALUE,
    REMOVE_LIST_CONTEXT_VIEW_DATA_RECORD,
    UPDATE_LIST_CONTEXT_VIEW_DATA_RECORD,
    SET_LIST_OP_SEARCH_BOX_VISIBLE,
    SET_LIST_OP_SEARCH_BOX_CRITERIA_VALUE
} from '../actions/appContext'
import ViewContext from '../modelView/ViewContext'
import produce from "immer"
import { createSelector } from 'reselect'
import memoize from 'lodash.memoize'
import ViewType from '../modelView/ViewType'
import {CREATE_VIEW_DATA, LIST_VIEW_DATA, DETAIL_VIEW_DATA, EDIT_VIEW_DATA,RECORD_TAG} from '../ReservedKeyword'
import { ReducerRegistry } from '../../ReducerRegistry';
import {nextRecordTag} from '../../lib/tag-helper'
import { bindRecordTag } from '../fieldHelper';
import {getViewTypeViewDataContextkey} from "../modelView/ModelViewRegistry"
const initAppContext={}
initAppContext[EDIT_VIEW_DATA]={}
initAppContext[CREATE_VIEW_DATA]={}
initAppContext[DETAIL_VIEW_DATA]={}
initAppContext[LIST_VIEW_DATA]={}
export function appContext(state,action){
    if(typeof state == "undefined"){
        return initAppContext
    }
    switch(action.type){
        case SET_CREATE_CONTEXT_FIELD_VALUE:
        {

            let newState=action.payload
            return produce(state,draft=>{
                if(newState.length>0){
                  newState.map(fv=>{
                    let rootField = fv[0]
                    let key=getAppModelViewKey(rootField.app,rootField.model,rootField.viewType,rootField.ownerField)
                    draft[CREATE_VIEW_DATA][key]=draft[CREATE_VIEW_DATA][key]||{
                      app:rootField.app,
                      model:rootField.model,
                      viewData:{
                          data:{
                              app:rootField.app,
                              model:rootField.model
                          }
                      }
                    }
                    const [fd,value]=fv
                    draft[CREATE_VIEW_DATA][key]["viewData"]["data"]["record"]=draft[CREATE_VIEW_DATA][key]["viewData"]["data"]["record"]||{}
                    draft[CREATE_VIEW_DATA][key]["viewData"]["data"]["record"][fd.name]=value
                  })
                }
            })
        }
        case SET_EDIT_CONTEXT_FIELD_VALUE:
        {
            let newFieldValues = action.payload
            return produce(state,draft=>{
                if(newFieldValues.length>0){
                    newFieldValues.map(fv=>{
                      let rootField = fv[0]
                      let key=getAppModelViewKey(rootField.app,rootField.model,rootField.viewType,rootField.ownerField)
                      draft[EDIT_VIEW_DATA][key]=draft[EDIT_VIEW_DATA][key]||{
                        app:rootField.app,
                        model:rootField.model,
                        viewData:{
                            data:{
                                app:rootField.app,
                                model:rootField.model
                            }
                        }
                      }
                      const [fd,value]=fv
                      draft[EDIT_VIEW_DATA][key]["viewData"]["data"]["record"]=draft[EDIT_VIEW_DATA][key]["viewData"]["data"]["record"]||{}
                      draft[EDIT_VIEW_DATA][key]["viewData"]["data"]["record"][fd.name]=value
                    })
                }
            })
        }
        case CLEAR_CREATE_CONTEXT_FIELD_VALUE:
        {
            let {app,model,viewType,ownerField}=action.payload
            return produce(state,draft=>{
                let key=getAppModelViewKey(app,model,viewType,ownerField)
                draft[CREATE_VIEW_DATA][key]=draft[CREATE_VIEW_DATA][key]||{
                    app,
                    model,
                    viewData:{
                        data:{
                            app:app,
                            model:model,
                            data:{
                                app,
                                model
                            }
                        }
                    }
                }
                draft[CREATE_VIEW_DATA][key]["viewData"]["data"]["record"]=null
            })
        }
        case SET_CREATE_CONTEXT_VIEW_DATA:
        {
            const {app,model,viewType,viewData,ownerField}=action.payload
            updateViewField(viewData,ownerField)
            return produce(state,draft=>{
               setCreateViewData(draft,viewData,ownerField)
            })
        }
        case SET_LIST_CONTEXT_CRITERIA:
        {
            const {app,model,viewType,ownerField,name,criteria} = state
            return produce(state,draft=>{
                setModelViewCriteria(draft,app,model,viewType,ownerField,name,criteria)
            })
        }
        case SET_LIST_CONTEXT_VIEW_DATA:
        {
            const {app,model,viewType,viewData,ownerField,refView}=action.payload
            updateViewField(viewData,ownerField)
            return produce(state,draft=>{
                setListViewData(draft,viewData,ownerField)
            })
        }
        case REMOVE_LIST_CONTEXT_VIEW_DATA_RECORD:
        {
            const {app,model,viewType,tags,ownerField}  = action.payload
            return produce(state,draft=>{
                let key =getAppModelViewKey(app,model,viewType,ownerField)
                try{
                    draft[LIST_VIEW_DATA][key]["viewData"]["data"]["record"]=draft[LIST_VIEW_DATA][key]["viewData"]["data"]["record"]||[]
                    let record = draft[LIST_VIEW_DATA][key]["viewData"]["data"]["record"]
                    record = record.filter(x=>tags.indexOf(x[RECORD_TAG])<0)
                    draft[LIST_VIEW_DATA][key]["viewData"]["data"]["record"]=record
                }
                catch(err)
                {
                    console.log(err)
                }
            })
        }
        case UPDATE_LIST_CONTEXT_VIEW_DATA_RECORD:
        {
            const {app,model,viewType,record,ownerField} = action.payload
            return produce(state,draft=>{
                let key = getAppModelViewKey(app,model,viewType,ownerField)
                try{
                    let tag = record[RECORD_TAG]
                    if(tag){
                        draft[LIST_VIEW_DATA][key]["viewData"]["data"]["record"]= draft[LIST_VIEW_DATA][key]["viewData"]["data"]["record"]||[]
                        let index = draft[LIST_VIEW_DATA][key]["viewData"]["data"]["record"].findIndex(x=>x[RECORD_TAG]==tag)
                        if(index>-1){
                            draft[LIST_VIEW_DATA][key]["viewData"]["data"]["record"][index]=record
                        }
                        else{
                            draft[LIST_VIEW_DATA][key]["viewData"]["data"]["record"].unshift(record)
                        }
                    }
                }
                catch(err){
                    console.log(err)
                }
            })
        }
        case SET_LIST_OP_SEARCH_BOX_VISIBLE:
        {
            const {app,model,viewType,ownerField,visible} = action.payload
            return produce(state,draft=>{
                setModelViewListOpSearchBoxVisible(draft,app,model,viewType,ownerField,visible)
            })
        }
        case SET_LIST_OP_SEARCH_BOX_CRITERIA_VALUE:
        {
            const {app,model,viewType,ownerField,fieldName,value} = action.payload
            return produce(state,draft=>{
                setListOpSearchBoxCriteriaValue(draft,app,model,viewType,ownerField,fieldName,value)
            })
        }
        case SET_DETAIL_CONTEXT_VIEW_DATA:
        {
            const {app,model,viewType,viewData,ownerField} = action.payload
            return produce(state,draft=>{
                setDetailContextViewData(draft,app,model,viewType,viewData,ownerField)
            })
        }
        case SET_EDIT_CONTEXT_VIEW_DATA:
        {
            const {app,model,viewType,viewData,ownerField} = action.payload
            return produce(state, draft=>{
                setEditContextViewData(draft,app,model,viewType,viewData,ownerField)
            })
        }
        default:
            return state
    }
}



function setCreateViewData(draft,viewData,ownerField){
    let {view,data,triggerGroups}=viewData
    let key = getAppModelViewKey(view.app,view.model,view.viewType,ownerField)
    draft[CREATE_VIEW_DATA][key]={
        app:view.app,
        model:view.model,
        viewData:Object.assign({
         ...viewData
        },{data:getInitCreateViewData(data,view, ownerField)})
    }
}

function setListViewData(draft,viewData,ownerField){
    let {view,data,triggerGroups}=viewData
    let key = getAppModelViewKey(view.app,view.model,view.viewType,ownerField)
    let localData =(draft[LIST_VIEW_DATA][key] && draft[LIST_VIEW_DATA][key]["localData"])||{
        visible:false,
        criteria:{}
    }
    draft[LIST_VIEW_DATA][key]={
        app:view.app,
        model:view.model,
        localData:localData,
        viewData:{
         ...viewData
        }
    }
    if(!draft[LIST_VIEW_DATA][key]["viewData"]){
        draft[LIST_VIEW_DATA][key]={
            app:view.app,
            model:view.model,
            viewData:Object.assign({
             ...viewData
            })
        }
    }
    draft[LIST_VIEW_DATA][key]["viewData"]["data"]=getInitListViewData(data, view, ownerField)
}

function setModelViewListOpSearchBoxVisible(draft,app,model,viewType,ownerField,visible){
    let key = getAppModelViewKey(app,model,viewType,ownerField)
    draft[LIST_VIEW_DATA][key]["localData"]=draft[LIST_VIEW_DATA][key]["localData"]||{}
    draft[LIST_VIEW_DATA][key]["localData"]["searchBox"]=draft[LIST_VIEW_DATA][key]["localData"]["searchBox"]||{}
    draft[LIST_VIEW_DATA][key]["localData"]["searchBox"]["visible"]=visible
}

function setListOpSearchBoxCriteriaValue(draft,app,model,viewType,ownerField,fieldName,value){
    let key = getAppModelViewKey(app,model,viewType,ownerField)
    draft[LIST_VIEW_DATA][key]["localData"]=draft[LIST_VIEW_DATA][key]["localData"]||{}
    draft[LIST_VIEW_DATA][key]["localData"]["searchBox"]=draft[LIST_VIEW_DATA][key]["localData"]["searchBox"]||{}
    draft[LIST_VIEW_DATA][key]["localData"]["searchBox"]["criteria"]=draft[LIST_VIEW_DATA][key]["localData"]["searchBox"]["criteria"]||{}
    draft[LIST_VIEW_DATA][key]["localData"]["searchBox"]["criteria"][fieldName]=value
}
function getInitListViewData(data, view, ownerField){
    if(data && data.record){
        data.record.map(x=>{
            x[RECORD_TAG] = nextRecordTag()
        })
    }
    data=data||{
        app:view.app,
        model:view.model,
        record:[]
    }
    data.record=data.record||[]
    return data
}
function setModelViewCriteria(draft,app,model,viewType,ownerField,name,criteria){
    let key = getAppModelViewKey(app,model,viewType,ownerField)
    if(viewType == ViewType.LIST){
        if(draft[LIST_VIEW_DATA][key]){
            draft[LIST_VIEW_DATA][key]["viewData"]=draft[LIST_VIEW_DATA][key]["viewData"]||{}
            draft[LIST_VIEW_DATA][key]["viewData"]["criterias"] = draft[LIST_VIEW_DATA][key]["viewData"]["criterias"]||{}
            draft[LIST_VIEW_DATA][key]["viewData"]["criterias"][name]=criteria
        }
    }
}
function setDetailContextViewData(draft,app,model,viewType,viewData,ownerField){
    let {view,data,triggerGroups}=viewData
    let key = getAppModelViewKey(view.app,view.model,view.viewType,ownerField)
    draft[DETAIL_VIEW_DATA][key]={
        app:view.app,
        model:view.model,
        viewData:Object.assign({
         ...viewData
        })
    }

    if(!draft[DETAIL_VIEW_DATA][key]["viewData"]){
        draft[DETAIL_VIEW_DATA][key]={
            app:view.app,
            model:view.model,
            viewData:Object.assign({
             ...viewData
            })
        }
    }
    draft[DETAIL_VIEW_DATA][key]["viewData"]["data"]=getInitCreateViewData(data, view, ownerField)
}

function setEditContextViewData(draft,app,model,viewType,viewData,ownerField){
    let {view,data,triggerGroups}=viewData
    let key = getAppModelViewKey(view.app,view.model,view.viewType,ownerField)
    draft[EDIT_VIEW_DATA][key]={
        app:view.app,
        model:view.model,
        viewData:Object.assign({
         ...viewData
        })
    }
    if(!draft[EDIT_VIEW_DATA][key]["viewData"]){
        draft[EDIT_VIEW_DATA][key]={
            app:view.app,
            model:view.model,
            viewData:Object.assign({
             ...viewData
            })
        }    
    }
    draft[EDIT_VIEW_DATA][key]["viewData"]["data"]=getInitEditViewData(data, view, ownerField)
}
function getInitCreateViewData(data,view,ownerField){
    if(data){
        return data
    }
    return {
        app:view.app,
        model:view.model,
        record:{}
    }
}
function getInitEditViewData(data,view,ownerField){
    if(data){
        return data
    }
    return {
        app:view.app,
        model:view.model,
        record:{}
    }
}
export function getAppModelViewKey(app,model,viewType,ownerField){
    let key =`${app}.${model}.${viewType}`
    let pF=ownerField
    while(pF){
        let tag = pF[RECORD_TAG]
        if(!tag){
            key = `${pF.app}.${pF.model}.${pF.viewType}.${pF.name}@${key}`
        }
        else{
            key = `${pF.app}.${pF.model}.${pF.viewType}.${pF.name}.${tag}@${key}`
        }
        
        pF = pF.ownerField
    }
    return key
}

export function updateViewField(viewData,ownerField){
    let {view}=viewData
    if(view){
        view.ownerField=ownerField
        if(view.fields){
            view.fields.map(f=>{
                f.ownerField = ownerField
                return true
            })
        }
    }
}

export const viewDataFromCreateContext = createSelector(state=>state[ViewContext.APP_CONTEXT],appContext=>memoize(({app,model,viewType,ownerField})=>{
    let key=getAppModelViewKey(app,model,viewType, ownerField)
    if(!appContext||!appContext[CREATE_VIEW_DATA]||!(appContext[CREATE_VIEW_DATA][key])||!(appContext[CREATE_VIEW_DATA][key]["viewData"])) return {}
    return appContext[CREATE_VIEW_DATA][key]["viewData"]
}))

export const viewDataFromListContext = createSelector(state=>state[ViewContext.APP_CONTEXT],appContext=>memoize(({app,model,viewType,ownerField})=>{
    let key=getAppModelViewKey(app,model,viewType, ownerField)
    if(!appContext||!appContext[LIST_VIEW_DATA]||!(appContext[LIST_VIEW_DATA][key])||!(appContext[LIST_VIEW_DATA][key]["viewData"])) return {}
    return appContext[LIST_VIEW_DATA][key]["viewData"]
}))
export const localDataFromListContext = createSelector(state=>state[ViewContext.APP_CONTEXT],appContext=>memoize(({app,model,viewType,ownerField})=>{
    let key=getAppModelViewKey(app,model,viewType, ownerField)
    if(!appContext||!appContext[LIST_VIEW_DATA]||!(appContext[LIST_VIEW_DATA][key])||!(appContext[LIST_VIEW_DATA][key]["localData"])) return {}
    return appContext[LIST_VIEW_DATA][key]["localData"]
}))
export const viewDataFromDetailContext = createSelector(state=>state[ViewContext.APP_CONTEXT],appContext=>memoize(({app,model,viewType,ownerField})=>{
    let key=getAppModelViewKey(app,model,viewType, ownerField)
    if(!appContext||!appContext[DETAIL_VIEW_DATA]||!(appContext[DETAIL_VIEW_DATA][key])||!(appContext[DETAIL_VIEW_DATA][key]["viewData"])) return {}
    return appContext[DETAIL_VIEW_DATA][key]["viewData"]
}))

export const viewDataFromEditContext = createSelector(state=>state[ViewContext.APP_CONTEXT],appContext=>memoize(({app,model,viewType,ownerField})=>{
    let key=getAppModelViewKey(app,model,viewType, ownerField)
    if(!appContext||!appContext[EDIT_VIEW_DATA]||!(appContext[EDIT_VIEW_DATA][key])||!(appContext[EDIT_VIEW_DATA][key]["viewData"])) return {}
    return appContext[EDIT_VIEW_DATA][key]["viewData"]
}))

function removeRedundancyProperty(modelData){
    if(modelData && modelData.record){
        if(modelData.record instanceof Array){
            var rModelData = {
                app:modelData.app,
                model:modelData.model,
                record:[]
            }
            modelData.record.map(r=>{
                if(r["id"]!=undefined){
                    rModelData.record.push({
                        id:modelData.record.id
                    })
                }
                else{
                    let nr = removeRedundancyRecordProperty(r)
                    rModelData.record.push(nr)
                }
            })
            return rModelData
        }
        else{
            if(modelData.record["id"]!=undefined){
                return {
                    app:modelData.app,
                    model:modelData.model,
                    record:{
                        id:modelData.record.id
                    }
                }
            }
            else{
                let nr = removeRedundancyRecordProperty(modelData.record)
                return  {
                         app:modelData.app,
                         model:modelData.model,
                         record:nr
                        }
            }
        }
    }
    return modelData
}
function removeRedundancyRecordProperty(record){
    let nr = {}
    Object.keys(record).map(key=>{
        let keyValue = record[key]
        if(keyValue instanceof Object){
            nr[key]=removeRedundancyProperty(keyValue)
        }
        else{
            nr[key]=keyValue
        }
    })
    return nr
}
function buildServerModelDataObject(view,dataRecord,state,subViews){
    let record={}
    if(dataRecord.hasOwnProperty("id")){
        record["id"]=dataRecord["id"]
    }
    view.fields.map(f=>{
        if(!f.relationData){
            let value = dataRecord[f.name]
            if(value!==undefined && value!==null){
                record[f.name]=removeRedundancyProperty(value)
            }
        }
        else if(f.relationData.type=="Many2Many"){
            let value = dataRecord[f.name]
            if(value!==undefined && value!==null){
                if(value instanceof Object){
                    value = removeRedundancyProperty(value)
                }
                else{
                    value={
                        app:f.relationApp.targetApp,
                        app:f.relationApp.targetModel,
                        record:{
                            id:value
                        }
                    }
                }
               record["relRegistries"]=record["relRegistries"]||{}
               record["relRegistries"][f.relationData.relationModel]=record["relRegistries"][f.relationData.relationModel]||{
                   app:f.relationData.relationApp,
                   model:f.relationData.relationModel,
               }
               let r={}
               r[f.relationData.relationField]=value
               record["relRegistries"][f.relationData.relationModel]["record"]= record["relRegistries"][f.relationData.relationModel]["record"]||[r]
               record["relRegistries"][f.relationData.relationModel]["record"][0][f.relationData.relationField]=value
            }
            else{
                let {relationApp:app,relationModel:model} = f.relationData
                let subView = (subViews||[]).find(x=>{
                    return x.refView.fieldName == f.name
                })
                if(subView){
                    let contextKey = getViewTypeViewDataContextkey(subView.refView.viewType)
                    let createData=buildServerViewTypeData(app,model,subView.refView.viewType,contextKey,f,state)
                    createData=removeRedundancyProperty(createData)
                    if(createData.record && createData.record.length>0){
                        record["relRegistries"]=record["relRegistries"]||{}
                        record["relRegistries"][f.relationData.relationModel]=createData
                    }
                }
            }
        }
        else if(f.relationData.type=="One2Many"){
                let {targetApp:app,targetModel:model} = f.relationData
                let subView = subViews.find(x=>{
                    return x.refView.fieldName == f.name
                })
                if(subView){
                    let contextKey = getViewTypeViewDataContextkey(subView.refView.viewType)
                    let createData=buildServerViewTypeData(app,model,subView.refView.viewType,contextKey,f,state)
                    createData=removeRedundancyProperty(createData)
                    if(createData.record && createData.record.length>0){
                        record[f.name]=createData
                    }
                }
        }
        else if(f.relationData.type=="VirtualOne2One" || f.relationData.type=="One2One"){
            let {targetApp:app,targetModel:model} = f.relationData
            let subView = subViews.find(x=>{
                return x.refView.fieldName == f.name
            })
            if(subView){
                let contextKey = getViewTypeViewDataContextkey(subView.refView.viewType)
                let createData=buildServerViewTypeData(app,model,subView.refView.viewType,contextKey,f,state)
                createData=removeRedundancyProperty(createData)
                if(createData.record && Object.keys(createData.record).length>0){
                    record[f.name]=createData
                }
            }
        }
        else{
            let value = dataRecord[f.name]
            if(value!==undefined && value!==null){
                record[f.name]=removeRedundancyProperty(value)
            }
        }
    })
    return record
}

//TODO 
function buildServerModelDataArray(app,model,viewType,data,ownerField,state){
    let records = []
    if(ownerField){
        (data.record||[]).map((r)=>{
                let tag = r[RECORD_TAG]
                if(tag){
                    let tagOwnerField = bindRecordTag(ownerField,tag)
                    let addData = buildServerCreateData(app,model,ViewType.CREATE,tagOwnerField,state)
                    if(addData && addData.record && Object.keys(addData.record).length>0){
                        let nr={}
                        Object.keys(addData.record).map(key=>{
                            if(r[key]!=undefined){
                                nr[key]=r[key]
                            }
                            else{
                                nr[key]=addData.record[key]
                            }
                        })
                        records.push(nr)
                    }
                }
        })
    }
    return records
}

export function buildServerCreateData(app,model,viewType,ownerField,state){
    return buildServerViewTypeData(app,model,viewType,CREATE_VIEW_DATA,ownerField,state)
}

export function buildServerEditData(app,model,viewType,ownerField,state){
    return buildServerViewTypeData(app,model,viewType,EDIT_VIEW_DATA,ownerField,state)
}
export function buildServerListData(app,model,viewType,ownerField,state){
    return buildServerViewTypeData(app,model,viewType,LIST_VIEW_DATA,ownerField,state)
}

function buildServerViewTypeData(app,model,viewType,viewDataConextkey,ownerField,state){
     let serverData={
        app,
        model
    }
    let rootKey = getAppModelViewKey(app,model,viewType,ownerField)
    let modelData = (state[ViewContext.APP_CONTEXT][viewDataConextkey]||{})[rootKey]
    if(modelData){

        if(((modelData.viewData||{}).data||{}).record && (modelData.viewData.data.record instanceof Array)){
            serverData.record=buildServerModelDataArray(app,model,viewType,
                modelData.viewData.data,ownerField,state)
        }
        else{
            serverData.record=buildServerModelDataObject(modelData.viewData.view,
                (modelData.viewData.data||{}).record||{},state,modelData.viewData.subViews)
        }
    }
    return serverData
}
