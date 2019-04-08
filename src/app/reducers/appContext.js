import {
    SET_CREATE_CONTEXT_FIELD_VALUE,
    CLEAR_CREATE_CONTEXT_FIELD_VALUE,
    SET_CREATE_CONTEXT_VIEW_DATA
} from '../actions/appContext'
import ViewContext from '../modelView/ViewContext'
import produce from "immer"
import { createSelector } from 'reselect'
import memoize from 'lodash.memoize'
import {CREATE_VIEW_DATA} from '../ReservedKeyword'
const initAppContext={}

const UPDATE_NORMAL_FIELD_VALUE =0
const SET_ARRAY_ELEMENT_FIELD_VALUE =1
const REMOVE_ARRAY_ELEMENT =1

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
                    let key=getAppModelKey(rootField.app,rootField.model,rootField.ownerField)
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
                    
                    const [fd,value,op,elemTag]=fv
                    if(!op||op==UPDATE_NORMAL_FIELD_VALUE){
                        draft[CREATE_VIEW_DATA][key]["viewData"]["data"]["record"]=draft[CREATE_VIEW_DATA][key]["viewData"]["data"]["record"]||{}
                        draft[CREATE_VIEW_DATA][key]["viewData"]["data"]["record"][fd.name]=value
                    }
                    else if(op == SET_ARRAY_ELEMENT_FIELD_VALUE){
                       draft[CREATE_VIEW_DATA][key]["viewData"]["data"]["record"]=draft[CREATE_VIEW_DATA][key]["viewData"]["data"]["record"]||[]
                        if(elemTag){
                            let record = draft[CREATE_VIEW_DATA][key]["viewData"]["data"]["record"].find(x=>{
                                return x["__tag__"] == elemTag
                            })
                            if(!record){
                                let record2={}
                                record2["__tag__"]=elemTag
                                record2[fd.name]=value
                                draft[CREATE_VIEW_DATA][key]["viewData"]["data"]["record"].push(record2)
                            }
                            else{
                                record[fv.name]=value
                            }
                         }
                    }
                    else if(op == REMOVE_ARRAY_ELEMENT){
                        draft[CREATE_VIEW_DATA][key]["viewData"]["data"]["record"] =  draft[CREATE_VIEW_DATA][key]["viewData"]["data"]["record"].filter(x=>{
                            return x["__tag__"]!=elemTag
                        })
                    }
                  })
                }
            })
        }
        case CLEAR_CREATE_CONTEXT_FIELD_VALUE:
        {
            let {app,model,ownerField}=action.payload
            return produce(state,draft=>{
                let key=getAppModelKey(app,model,ownerField)
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
           return setCreateViewData(state,action.payload)
        }
        default:
            return state
    }
}


function setCreateViewData(state,payload){
    const {app,model,viewData,ownerField,refView}=action.payload
    updateViewField(viewData,ownerField)
    let key = getAppModelKey(app,model,ownerField)
    let {view,data,triggerGroups,subViews}=viewData

    return produce(state,draft=>{
       draft[CREATE_VIEW_DATA]=draft[CREATE_VIEW_DATA]||{}
       draft[CREATE_VIEW_DATA][key]=draft[CREATE_VIEW_DATA][key]||{
           app:app,
           model:model,
           viewData:Object.assign({
            ...viewData
           },{data:getInitViewData(data,app,model)})
       }
       
       for(var subView of subViews){
           if(subView.view){
               let subKey = getAppModelKey(subView.view.app, 
                subView.view.model, 
                subView.view.ownerField)
               draft[CREATE_VIEW_DATA][subKey]=draft[CREATE_VIEW_DATA][subKey]||{
                    app:subView.view.app,
                    model:subView.view.model,
                    viewData:Object.assign({
                        ...subView
                    },{data:getInitViewData(subView.data,
                        subView.view.app,
                        subView.view.model,
                        subView.view.ownerField)})
                }
           }
       }
    })
}
function setListViewData(state,payload){

}


function getInitViewData(data,app,model,field){
    if(field){
        return data[`${app}.${model}.${field.name}`]||{
            app,
            model
        }
    }
    else 
    {
        return data[`${app}.${model}`]||{
            app,
            model
        }
    }
}

export function getAppModelKey(app,model,ownerField){
    let key =`${app}.${model}`
    let pF=ownerField
    while(pF){
        key = `${pF.app}.${pF.model}.${pF.name}@${key}`
        pF=ownerField.ownerField
    }
    return key
}

export function updateViewField(viewData,ownerField){
    let {view,subViews}=viewData
    if(view){
        view.ownerField=ownerField
        (view.fields||[]).map(f=>{
            f.ownerField = ownerField
        })
        (subViews||[]).map(subView=>{
            let refField = view.fields.first(f=>{
                f.name == subView.refView.fieldName
            })
            subView.view && updateViewField(subView, refField)
        })
    }
}

export const viewDataFromCreateContext = createSelector(state=>state[ViewContext.APP_CONTEXT],(appContext)=>memoize(({app,model,ownerField})=>{
    let key=getAppModelKey(app,model,ownerField)
    if(!appContext||!appContext[CREATE_VIEW_DATA]||!(appContext[CREATE_VIEW_DATA][key])||!(appContext[CREATE_VIEW_DATA][key]["viewData"])) return {}
    return appContext[CREATE_VIEW_DATA][key]["viewData"]
}))



export function getCreateContextFieldValue(data,field){
    
}

function buildServerCreateDataObject(view,dataRecord,state){
    let record={}
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
                let createData=buildServerCreateData(app,model,f,state)
                if(createData.record && createData.record.length>0){
                    record[f.name]=createData
                }
        }
        else if(f.relationData.type=="VirtualOne2One"){
            let {targetApp:app,targetModel:model} = f.relationData
            let createData=buildServerCreateData(app,model,f,state)
            if(createData.record && Object.keys(createData.record).length>0){
                record[f.name]=createData
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

function buildServerCreateDataArray(view,dataRecordArray,state){
    let records = []
    dataRecordArray.map(dr =>{
        let r =buildServerCreateDataObject(view,dr,state)
        if(r && Object.keys(r.record).length>0){
            records.push(r)
        }
    })
    return records
}

export function buildServerCreateData(app,model,ownerField,state){
    let createData={
        app,
        model
    }
    let rootKey = getAppModelKey(app,model,ownerField)
    let modelData = (state[ViewContext.APP_CONTEXT][CREATE_VIEW_DATA]||{})[rootKey]
    if(modelData){

        if(modelData.viewData.data.record instanceof Array){
            createData.record=buildServerCreateDataArray(modelData.viewData.view,
                modelData.viewData.data.record||[])
        }
        else{
            createData.record=buildServerCreateDataObject(modelData.viewData.view,
                modelData.viewData.data.record||{})
        }
    }
    return createData
}
