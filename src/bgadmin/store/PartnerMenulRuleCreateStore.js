import { AppModelViewStore } from "../../app/store/AppModelViewStore"
import { call, put } from 'redux-saga/effects'
import { ModelAction } from "../../app/mq/ModelAction"
import { ModalSheetManager } from "../../app/modelView/ModalSheetManager"
import produce from "immer"
import { push } from "connected-react-router"
import { ReducerRegistry } from "../../ReducerRegistry"

export class PartnerMenuRuleCreateStore extends AppModelViewStore{
    constructor(){
        super("admin","partnerMenuRuleApi","create")
    }

    didMount(view){
        const {id} = view.props.location.state||{}
        this.put({
            type:"loadModelMenuMetaData",
            data:id
        })
    }

    disableResetButton(view){
        const {id} = view.props.location.state||{}
        if(id!=null && id>0){
            return true
        }
        return false
    }
    
    isDisable(view,name){
        const {id} = ((view.props||{}).location||{}).state||{}
        if(id!=null && id>0){
            return true
        }
        return false
    }
    doReset(view){
        
    }
    buildCreateData(view){
        const {id} = view.props.location.state||{}
        const {currentRole,currentApp,menuKeys} = view.props
        return {
            id:id,
            roleID: currentRole,
            app:currentApp,
            rule:menuKeys
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

    getTreeData(view){
        let appMenus =  (view.props.metaData||{}).appMenus||[]
        let appMenu = appMenus.find(a=>a.name == view.props.currentApp)
        return (appMenu||{}).treeData||[]
    }
    getMetaData(view){
        return view.props.metaData||{}
    }
    onFieldChange(view,name,value){
        this.put({
            type:name,
            data:value
        })
    }

    getFieldValue(view,name,value){
        return view.props[name]
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

    reducer(state,action){
        switch(action.type){
            case "createMeta":
                return produce(state||{},draft=>{
                    let data = action.data.data
                    draft["metaData"] = action.data
                    let cData = this.createFromServerData(data||{})
                    Object.keys(cData).map(key=>{
                        draft[key] = cData[key]
                    })
                })
            case "currentApp":
                    return produce(state||{},draft=>{
                        draft["menuKeys"]=[]
                        draft[action.type]=action.data
                    })
            default:
                return produce(state||{},draft=>{
                    draft[action.type]=action.data
                })
        }
    }
    *effect(state,action){
        switch(action.type){
            case "loadModelMenuMetaData":
                {
                    let ret = yield* new ModelAction("admin","partnerMenuRuleApi").genCall("loadModelMenuMetaData",{
                        id:action.data
                    })
                    if(ret.errorCode==0){
                       this.put({
                           type:"createMeta",
                           data:ret.bag.metaData
                       })
                    }
                    else{
                        ModalSheetManager.alert({
                            title:"获取数据失败",
                            msg:ret?ret.description:"通讯失败"
                        }) 
                    }
                }
                return 1
            case "_effect_do_save":
                    {
                        let ret = yield* new ModelAction("admin","partnerMenuRuleApi").genCall("saveAppMenuRule",action.data)
                        if(ret.errorCode==0){
                            ModalSheetManager.alert({
                                title:"提示",
                                msg:ret?ret.description:"保存成功"
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
                    let ret = yield* new ModelAction("admin","partnerMenuRuleApi").genCall("saveAppMenuRule",action.data)
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
                return yield 1
        }
    }
    
    createFromServerData(data){
        return {
            currentRole:data.roleID,
            currentApp:data.app,
            menuKeys:JSON.parse(data.rule||'[]')
        }
    }
}