import { AppModelViewStore } from "../../app/store/AppModelViewStore"
import { call, put } from 'redux-saga/effects'
import { ModelAction } from "../../app/mq/ModelAction"
import { ModalSheetManager } from "../../app/modelView/ModalSheetManager"
import produce from "immer"
import { push } from "connected-react-router"
import { ReducerRegistry } from "../../ReducerRegistry"
import create from "antd/lib/icon/IconFont"
import { copyFile } from "fs"
export default class PartnerViewRuleCreateStore extends AppModelViewStore{
    constructor(){
        super("admin","partnerViewRuleApi","create")
    }
    didMount(view){
        const {id} = view.props.location.state||{}
        this.put({
            type:"loadModelViewMetaData",
            data:id
        })
    }
    onFieldChange(view,name,value){
        this.put({
            type:name,
            data:value
        })
    }
    doReset(view){

    }
    getFieldValue(view,name,value){
       const nValue = view.props[name]
       if(name==="currentView"){
            let vs = this.getModelViews(view)
            return nValue||(vs[0]||{}).viewType
       }
       return nValue
    }


    getRoles(view){
        return (view.props.viewMetaData||{}).roles||[]
    }

    getModels(view){
        return (view.props.viewMetaData||{}).models||[]
    }

    getModelViews(view){
        const currentModel = view.props.currentModel
        const models = this.getModels(view)
        let appModels = (currentModel||"").split("/")
        if(appModels.length==2){
            return (models.find(m=>m.app == appModels[0] && m.model == appModels[1])||{}).views||[]
        }
        return []
    }

    getViewMeta(view,viewType){
        let views = this.getModelViews(view)
        return (views||[]).find(v=>v.viewType == viewType)||{}
    }

    getViewData(view,viewType){
        return (view.props.viewDatas||{})[viewType]||{}
    }

    reducer(state,action){
        switch(action.type){
            case "viewType_enable":
                return produce(state||{},draft=>{
                    draft.viewDatas=draft.viewDatas||{}
                    draft.viewDatas[action.data.viewType] =  draft.viewDatas[action.data.viewType]||{}
                    draft.viewDatas[action.data.viewType]["enable"] = action.data.value
                    return draft
                })
            case "viewType_field":
                return produce(state||{},draft=>{
                    draft.viewDatas=draft.viewDatas||{}
                    draft.viewDatas[action.data.viewType] =  draft.viewDatas[action.data.viewType]||{}
                    draft.viewDatas[action.data.viewType]["fields"] =  draft.viewDatas[action.data.viewType]["fields"]||{}
                    let {fd,name,value} = action.data.value
                    if(fd){
                        draft.viewDatas[action.data.viewType]["fields"][fd.name]=draft.viewDatas[action.data.viewType]["fields"][fd.name]||{}
                        draft.viewDatas[action.data.viewType]["fields"][fd.name][name] = value
                    }
                    return draft
                })
            case "viewType_trigger":
                return produce(state||{},draft=>{
                    draft.viewDatas=draft.viewDatas||{}
                    draft.viewDatas[action.data.viewType] =  draft.viewDatas[action.data.viewType]||{}
                    draft.viewDatas[action.data.viewType]["trigger"] =  draft.viewDatas[action.data.viewType]["trigger"]||{}
                    let {group,trigger,value,name} = action.data.value
                    if(group && trigger){
                        draft.viewDatas[action.data.viewType]["trigger"][`${group.name}/${trigger.name}`]=draft.viewDatas[action.data.viewType]["trigger"][`${group.name}/${trigger.name}`]||{}
                        draft.viewDatas[action.data.viewType]["trigger"][`${group.name}/${trigger.name}`][name] = value
                    }
                    return draft
                })
            case "currentModel":
                return produce(state||{},draft=>{
                    draft["currentView"]=null
                    draft.viewDatas={}
                    draft[action.type] = action.data
                })
            case "__reset__":
                return produce(state||{},draft=>{
                    let viewMetaData = draft.viewMetaData
                    draft={viewMetaData}
                    return draft
                })
            case "viewMetaData":
                return produce(state||{},draft=>{
                    let viewMetaData = action.data
                    let data = viewMetaData.data
                    draft[action.type] = viewMetaData
                    if(data){

                        draft["currentView"]=null
                        draft.viewDatas={}
                        draft["currentRole"] =data.roleID
                        draft["currentModel"]=`${data.app}/${data.model}`
                        draft["viewDatas"] = this.createViewDataFromServer(data)
                    }
                    return draft
                })
            default:
                return produce(state||{},draft=>{
                    draft[action.type] = action.data
                })
        }
    }
    * effect(state,action){
        switch(action.type){
            case "loadModelViewMetaData":
                let ret = yield* new ModelAction("admin","partnerViewRuleApi").genCall("loadModelViewMetaData",
                {
                    id:action.data
                })
                if(ret.errorCode == 0){
                    this.put({
                        type:"viewMetaData",
                        data:ret.bag.metaData
                    })
                }
                else{
                    ModalSheetManager.alert({
                        title:"提示",
                        msg:ret?ret.description:ret.description
                    })
                }
                return  1
            case "_effect_do_save":
                {
                    let ret = yield* new ModelAction("admin","partnerViewRuleApi").genCall("saveModelViewRule",action.data)
                    if(ret.errorCode==0){
                        ModalSheetManager.alert({
                            title:"提示",
                            msg:"添加成功"
                        })
                    }
                    else{
                        ModalSheetManager.alert({
                            title:"提示",
                            msg:ret?ret.description:ret.description
                        })
                    }
                }
                return 1
            case "_effect_do_save_and_create":
                {
                    let ret = yield* new ModelAction("admin","partnerViewRuleApi").genCall("saveModelViewRule",action.data)
                    if(ret.errorCode==0){
                        this.put({
                            type:"__reset__"
                        })
                    }
                    else{
                        ModalSheetManager.alert({
                            title:"提示",
                            msg:ret?ret.description:ret.description
                        })
                    }
                }
                return 1
            default:
                yield 1
        }
    }
    disableResetButton(view){
        const {id} = view.props.location.state||{}
        if(id!=null && id>0){
            return true
        }
        return false
    }
    
    isDisable(view,name){
        const {id} = view.props.location.state||{}
        if(id!=null && id>0){
            return true
        }
        return false
    }
    onViewTypeFieldChange(view,viewType,name,value){
        switch(name){
            default:
                this.put({
                    type:"viewType_" + name,
                    data:{
                        value,
                        viewType
                    }
                })
        }
    }
    getViewTypeFieldValue(view,viewType,name,value){
        let viewData= view.props.viewData
        if(name==="enable"){
            let e =  viewData["enable"]
            return (e!==null && e!==undefined)?e:true
        }
        else if(name==="field"){
            let {fd,name} = value
            return ((viewData["fields"]||{})[fd.name]||{})[name]
        }
        else if(name==="trigger"){
            let {group,trigger,name} = value
            return ((viewData["trigger"]||{})[`${group.name}/${trigger.name}`]||{})[name]
        }
        
    }
    createViewDataFromServer(data){
        let rule = data.rule
        let viewDatas={}
        try{
            let viewTypeDatas = JSON.parse(rule)
            for(let viewData of viewTypeDatas){
                let cvd = {
                    viewType:viewData.viewType
                }
                viewDatas[cvd.viewType] = cvd
                cvd.enable = viewData.enable
                cvd.trigger={}
                viewData.triggers.map(trigger=>{
                    cvd.trigger[`${trigger.group}/${trigger.trigger}`]={}
                    cvd.trigger[`${trigger.group}/${trigger.trigger}`]['disable'] = !trigger.visible
                    cvd.trigger[`${trigger.group}/${trigger.trigger}`]['exp'] = trigger.exp
                })
                cvd.fields={}
                viewData.fields.map(field=>{
                    cvd.fields[field.name]={}
                    cvd.fields[field.name]["disable"] = !field.visible
                    cvd.fields[field.name]["exp"] = field.exp
                })
            }
        }
        catch(err){
            console.error(err)
        }
       
        return viewDatas
    }
    buildCreateData(view){
        const {id} = view.props.location.state||{}
        let createData = {id}
        let appModel = view.props.currentModel
        let roleID = view.props.currentRole
        let ams = appModel.split("/")
        if(ams.length === 2){
            createData.roleID = roleID
            createData.model = ams[1]
            createData.app = ams[0]
            createData.views =[]
            Object.keys(view.props.viewDatas).map(key=>{
                let viewTypeData = view.props.viewDatas[key]
                if(viewTypeData){
                    let viewObj = {
                        viewType:key
                    }
                    viewObj.enable = viewTypeData.enable!==false?true:false
                    let fds = viewTypeData.fields||{}
                    viewObj.fields=[]
                    Object.keys(fds).map(key=>{
                        let enable = fds[key]["disable"]===true?false:true
                        let exp = fds[key]["exp"]||""
                        viewObj.fields.push({
                            name:key,
                            visible: enable,
                            exp:exp
                        })
                    })
                    let triggers =  viewTypeData.trigger||{}
                    viewObj.triggers=[]
                    Object.keys(triggers).map(key=>{
                        let enable = triggers[key]["disable"]===true?false:true
                        let exp = triggers[key]["exp"]||""
                        viewObj.triggers.push({
                            name:key,
                            visible: enable,
                            exp:exp
                        })
                    })
                    createData.views.push(viewObj)
                }
            })
            return createData
        }
    }

    doSave(view){
        let createData = this.buildCreateData(view)
        if(createData){
            this.put({
                type: "_effect_do_save",
                data:createData
            })
        }
    }

    doSaveAndCreate(view){
        let createData = this.buildCreateData(view)
        if(createData){
            this.put({
                type: "_effect_do_save_and_create",
                data:createData
            })
        }
    }
}