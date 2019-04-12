import {
    SET_CREATE_CONTEXT_FIELD_VALUE,
    CLEAR_CREATE_CONTEXT_FIELD_VALUE,
    SET_CREATE_CONTEXT_VIEW_DATA,
    SET_LIST_CONTEXT_CRITERIA,
    SET_LIST_CONTEXT_VIEW_DATA,
    SET_LIST_CONTEXT_PAEG_DATA,
    UPDATE_LIST_CONTEXT_VIEW_DATA,
    SET_DETAIL_CONTEXT_VIEW_DATA,
    SET_EDIT_CONTEXT_VIEW_DATA,
    SET_EDIT_CONTEXT_FIELD_VALUE,
    SET_CREATE_CONTEXT_VIEW_DATA_TO_SOURCE,
    SET_EDIT_CONTEXT_VIEW_DATA_TO_SOURCE,
    REMOVE_LIST_CONTEXT_VIEW_DATA
} from '../actions/appContext'
import ViewContext from '../modelView/ViewContext'
import produce from "immer"
import { createSelector } from 'reselect'
import memoize from 'lodash.memoize'
import ViewType from '../modelView/ViewType'
import {CREATE_VIEW_DATA, LIST_VIEW_DATA, DETAIL_VIEW_DATA, EDIT_VIEW_DATA,RECORD_TAG} from '../ReservedKeyword'
import { ReducerRegistry } from '../../ReducerRegistry';
const initAppContext={}

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
                    draft[CREATE_VIEW_DATA]=draft[CREATE_VIEW_DATA]||{}
                    draft[CREATE_VIEW_DATA][key]=draft[CREATE_VIEW_DATA][key]||{}
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
                      draft[EDIT_VIEW_DATA]=draft[EDIT_VIEW_DATA]||{}
                      draft[EDIT_VIEW_DATA][key]=draft[EDIT_VIEW_DATA][key]||{}
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
        case SET_CREATE_CONTEXT_VIEW_DATA_TO_SOURCE:
        {
            let {app,model,viewType,ownerField,datasourceKey} = action.payload
            return produce(state,draft=>{
                let key = getAppModelViewKey(app,model,viewType,ownerField)
                try
                {
                    let data = draft[CREATE_VIEW_DATA][key]["viewData"]["data"]
                    setContextViewDataToSource(draft,data,datasourceKey)
                }
                catch{

                }
            })
        }
        case SET_EDIT_CONTEXT_VIEW_DATA_TO_SOURCE:
        {
            let {app,model,viewType,ownerField,datasourceKey} = action.payload
            return produce(state,draft=>{
                let key = getAppModelViewKey(app,model,viewType,ownerField)
                try
                {
                    let data = draft[CREATE_VIEW_DATA][key]["viewData"]["data"]
                    setContextViewDataToSource(draft,data,datasourceKey)
                }
                catch{

                }
            })
        }
        case CLEAR_CREATE_CONTEXT_FIELD_VALUE:
        {
            let {app,model,viewType,ownerField}=action.payload
            return produce(state,draft=>{
                let key=getAppModelViewKey(app,model,viewType,ownerField)
                draft[CREATE_VIEW_DATA]=draft[CREATE_VIEW_DATA]||{}
                draft[CREATE_VIEW_DATA][key]=draft[CREATE_VIEW_DATA][key]||{}
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
            const {app,model,viewType,viewData,ownerField,datasourceKey}=action.payload
            updateViewField(viewData,ownerField)
            return produce(state,draft=>{
               setCreateViewData(draft,viewData,ownerField,datasourceKey)
               if(viewData.subViews){
                for(let subView of viewData.subViews){
                    if(subView.view){
                        let subKey = getAppModelViewKey(subView.view.app, 
                         subView.view.model, subView.view.viewType,
                         subView.view.ownerField)
                         if(subView.view.viewType ==ViewType.CREATE){
                             setCreateViewData(draft,subView,subView.view.ownerField)
                         }
                         else if(subView.view.viewType == ViewType.LIST){
                             setListViewData(draft,subView,subView.view.ownerField)
                         }
                    }
                }
               }
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
        case UPDATE_LIST_CONTEXT_VIEW_DATA:{
            const { app,
                    model,
                    viewType,
                    viewData,
                    ownerField,
                    refView }=action.payload
                return produce(state,draft=>{
                    updateListViewData(draft,viewData,ownerField)
                })
        }
        case SET_LIST_CONTEXT_PAEG_DATA:
        {
            const {app,model,viewType,pageIndex,pageSize,ownerField}  = action.payload
            return produce(state,draft=>{
                setListViewPageData(draft,app,model,viewType,pageSize,pageIndex,ownerField)
            })
        }
        case REMOVE_LIST_CONTEXT_VIEW_DATA:
        {
            const {app,model,viewType,tags,ownerField}  = action.payload
            return produce(state,draft=>{
                let key =getAppModelViewKey(app,model,viewType,ownerField)
                try{
                    let record = draft[LIST_VIEW_DATA]["viewData"]["data"]["record"]
                    record = record.filter(x=>tags.indexOf(x[RECORD_TAG])<0)
                    draft[LIST_VIEW_DATA]["viewData"]["data"]["record"]=record
                }
                catch
                {

                }
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

function setContextViewDataToSource(draft,data,datasourceKey){
    if(datasourceKey){
        try
        {
            draft[LIST_VIEW_DATA][datasourceKey]["viewData"]=draft[LIST_VIEW_DATA][datasourceKey]["viewData"]||{
                app:data.app,
                model:data.model,
                viewData:{
                    app:data.app,
                    model:data.model,
                    data:{
                        app:data.app,
                        model:data.model,
                        record:[]
                    }
                }
            }
            let record =  draft[LIST_VIEW_DATA][datasourceKey]["viewData"]["data"].record||[]
            let tag = data.record[RECORD_TAG]
            if(tag){
                let index = record.findIndex(x=>x[RECORD_TAG]==tag)
                if(index>-1){
                    record[index]=data.record
                }
                else{
                    record.push(data.record)
                }
                draft[LIST_VIEW_DATA][datasourceKey]["viewData"]["data"].record=record
            }
        }
        catch
        {

        }
        
    }
}

function setCreateViewData(draft,viewData,ownerField,datasourceKey){
    let {view,data,triggerGroups}=viewData
    let key = getAppModelViewKey(view.app,view.model,view.viewType,ownerField)
    draft[CREATE_VIEW_DATA]=draft[CREATE_VIEW_DATA]||{}
    draft[CREATE_VIEW_DATA][key]=draft[CREATE_VIEW_DATA][key]||{
        app:view.app,
        model:view.model,
        viewData:Object.assign({
         ...viewData
        },{data:getInitCreateViewData(data,view, ownerField, datasourceKey)})
    }
}

function setListViewData(draft,viewData,ownerField){
    let {view,data,triggerGroups}=viewData
    let key = getAppModelViewKey(view.app,view.model,view.viewType,ownerField)
    draft[LIST_VIEW_DATA]=draft[LIST_VIEW_DATA]||{}
    draft[LIST_VIEW_DATA][key]=draft[LIST_VIEW_DATA][key]||{
        app:view.app,
        model:view.model,
        viewData:Object.assign({
         ...viewData
        })
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
function getInitListViewData(data, view, ownerField){
    if(data && data.record){
        data.record.map(x=>{
            x[RECORD_TAG] = x["id"]
        })
    }
    return data
}
function setListViewPageData(draft,app,model,viewType,pageSize,pageIndex,ownerField){
    let key = getAppModelViewKey(app,model,viewType,ownerField)
    draft[LIST_VIEW_DATA]=draft[LIST_VIEW_DATA]||{}
    let oldData= (draft[LIST_VIEW_DATA][key]=draft[LIST_VIEW_DATA][key]||{
        app:app,
        model:model,
        viewData:{}
    })["viewData"]
    oldData.pageData={pageIndex,pageSize}
    draft[LIST_VIEW_DATA][key]=oldData
}


function updateListViewData(draft,viewData,ownerField){
    let {view,data,triggerGroups}=viewData
    let key = getAppModelViewKey(view.app,view.model,view.viewType,ownerField)
    draft[LIST_VIEW_DATA]=draft[LIST_VIEW_DATA]||{}
    let oldData= (draft[LIST_VIEW_DATA][key]=draft[LIST_VIEW_DATA][key]||{
        app:view.app,
        model:view.model,
        viewData:{}
    })["viewData"]

    Object.keys(viewData).map(key=>{
        oldData[key]=viewData[key]
    })
    draft[LIST_VIEW_DATA][key]=oldData
}



function setModelViewCriteria(draft,app,model,viewType,ownerField,name,criteria){
    let key = getAppModelViewKey(app,model,viewType,ownerField)
    if(viewType == ViewType.LIST){
        draft[LIST_VIEW_DATA]=draft[LIST_VIEW_DATA]||{}
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
    draft[DETAIL_VIEW_DATA]=draft[DETAIL_VIEW_DATA]||{}
    draft[DETAIL_VIEW_DATA][key]=draft[DETAIL_VIEW_DATA][key]||{
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
    draft[EDIT_VIEW_DATA]=draft[EDIT_VIEW_DATA]||{}
    draft[EDIT_VIEW_DATA][key]=draft[EDIT_VIEW_DATA][key]||{
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
    draft[EDIT_VIEW_DATA][key]["viewData"]["data"]=getInitCreateViewData(data, view, ownerField)
}
function getInitCreateViewData(data,view,ownerField,datasourceKey){
    if(!datasourceKey){
        return data
    }
    else{
        if(ownerField){
            let tag = ownerField[RECORD_TAG]
            if(tag){
                let state = ReducerRegistry.Store.getState()
                let datasource = (((state[ViewContext.APP_CONTEXT]||{})[LIST_VIEW_DATA])||{})[datasourceKey]
                if(datasource){
                    try{
                        let dataRecrod = datasource.viewData.data.record.find(x=>x[RECORD_TAG]==tag)
                        if(dataRecrod){
                            return {
                                app:view.app,
                                model:view.model,
                                record:dataRecrod,
                            }
                        }
                    }
                    catch{

                    }
                    
                }
            }
        }
    }
    return data
}

export function getAppModelViewKey(app,model,viewType,ownerField){
    let key =`${app}.${model}.${viewType}`
    let pF=ownerField
    while(pF){
        let tag = ownerField[RECORD_TAG]
        if(!tag){
            key = `${pF.app}.${pF.model}.${pF.viewType}.${pF.name}@${key}`
        }
        else{
            key = `${pF.app}.${pF.model}.${pF.viewType}.${pF.name}.${tag}@${key}`
        }
        
        pF = ownerField.ownerField
    }
    return key
}

export function updateViewField(viewData,ownerField){
    let {view,subViews}=viewData
    if(view){
        view.ownerField=ownerField
        if(ownerField){
            ownerField.subView = view
        }
        if(view.fields){
            view.fields.map(f=>{

                f.ownerField = ownerField
                return true
            })
        }
    
       if(subViews){
        subViews.map(subView=>{
            let refField = view.fields.find(f=>{
                return f.name == subView.refView.fieldName
            })
            subView.view && updateViewField(subView, refField)
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





function buildServerCreateDataObject(view,dataRecord,state,subViews){
    let record={}
    if(dataRecord.hasOwnProperty("id")){
        record["id"]=dataRecord["id"]
    }
    view.fields.map(f=>{
        if(!f.relationData){
            let value = dataRecord[f.name]
            if(value!==undefined && value!==null){
                record[f.name]=value
            }
        }
        else if(f.relationData.type=="Many2Many"){
            let value = dataRecord[f.name]
            if(value!==undefined && value!==null){
               record["relRegistries"]=record["relRegistries"]||{}
               record["relRegistries"][f.relationData.relationModel]=record["relRegistries"][f.relationData.relationModel]||{
                   app:f.relationData.relationApp,
                   model:f.relationData.relationModel,
               }
               let r={}
               r[f.relationData.relationField]={
                   app:f.relationData.targetApp,
                   model:f.relationData.targetModel,
                   record:{}
               }
               r[f.relationData.relationField].record[f.relationData.targetField]=value
               record["relRegistries"][f.relationData.relationModel]["record"]= record["relRegistries"][f.relationData.relationModel]["record"]||[r]
               record["relRegistries"][f.relationData.relationModel]["record"][0][f.relationData.relationField]["record"][f.relationData.targetField]=value
            }
        }
        else if(f.relationData.type=="One2Many"){
                let {targetApp:app,targetModel:model} = f.relationData
                let subView = subViews.find(x=>{
                    return x.refView.fieldName == f.name
                })
                if(subView){
                    let createData=buildServerCreateData(app,model,subView.refView.viewType,f,state)
                    if(createData.record && createData.record.length>0){
                        record[f.name]=createData
                    }
                }
               
        }
        else if(f.relationData.type=="VirtualOne2One"){
            let {targetApp:app,targetModel:model} = f.relationData
            let subView = subViews.find(x=>{
                return x.refView.fieldName == f.name
            })
            if(subView){
                let createData=buildServerCreateData(app,model,subView.refView.viewType,f,state)
                if(createData.record && Object.keys(createData.record).length>0){
                    record[f.name]=createData
                }
            }
        }
        else{
            let value = dataRecord[f.name]
            if(value!==undefined && value!==null){
                record[f.name]=value
            }
        }
    })
    return record
}

//TODO 
function buildServerCreateDataArray(view,dataRecordArray,state,triggerGroups){
    let records = []
    dataRecordArray.map(dr =>{
        let tag=dr[RECORD_TAG]
        let toAddGroup = triggerGroups.find(x=>{
            for(let t of x.triggers){
                if(t.name == "toAdd"){
                    return true
                }
            }
        }
        )
        if(toAddGroup){
            let t= toAddGroup.triggers.find(x=>x.name == "toAdd")
            produce(view.ownerFiled,draft=>{
                draft[RECORD_TAG]=tag
                let key = getAppModelViewKey(view.app,view.model,t.viewType,draft)
                let viewData= state.appContext[CREATE_VIEW_DATA][key]["viewData"]
                if(viewData){
                    let r =buildServerCreateDataObject(viewData.view,viewData.data.record,state,viewData.subViews)
                    if(r && Object.keys(r.record).length>0){
                        records.push(r)
                    }
                }
            })
        }
    })
    return records
}

export function buildServerCreateData(app,model,viewType,ownerField,state){
    let createData={
        app,
        model
    }
    let rootKey = getAppModelViewKey(app,model,viewType,ownerField)
    let modelData = (state[ViewContext.APP_CONTEXT][CREATE_VIEW_DATA]||{})[rootKey]
    if(modelData){

        if(modelData.viewData.data.record instanceof Array){
            createData.record=buildServerCreateDataArray(modelData.viewData.view,
                modelData.viewData.data.record||[],state,modelData.viewData.triggerGroups)
        }
        else{
            createData.record=buildServerCreateDataObject(modelData.viewData.view,
                modelData.viewData.data.record||{},state,modelData.viewData.subViews)
        }
    }
    return createData
}

export function buildServerEditData(app,model,viewType,ownerField,state){
    let editData={
        app,
        model
    }
    let rootKey = getAppModelViewKey(app,model,viewType,ownerField)
    let modelData = (state[ViewContext.APP_CONTEXT][EDIT_VIEW_DATA]||{})[rootKey]
    if(modelData){

        if(modelData.viewData.data.record instanceof Array){
            editData.record=buildServerCreateDataArray(modelData.viewData.view,
                modelData.viewData.data.record||[],state,modelData.viewData.triggerGroups)
        }
        else{
            editData.record=buildServerCreateDataObject(modelData.viewData.view,
                modelData.viewData.data.record||{},state,modelData.viewData.subViews)
        }
    }
    return editData
}
