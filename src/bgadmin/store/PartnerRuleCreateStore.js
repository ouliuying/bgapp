/* eslint-disable array-callback-return */
import { AppModelViewStore } from "../../app/store/AppModelViewStore"
import { call, put } from 'redux-saga/effects'
import { ModelAction } from "../../app/mq/ModelAction"
import { ModalSheetManager } from "../../app/modelView/ModalSheetManager"
import produce from "immer"
import { push } from "connected-react-router"
import { ReducerRegistry } from "../../ReducerRegistry"
export default class PartnerRuleCreateStore extends AppModelViewStore{
    constructor(){
        super("admin","partnerRuleApi","create")
        this.accessTypeData={
            read:{},
            current:"read"
        }
    }

    reducer(state,action){
        let ret = super.reducer(state,action)
        if(ret!==undefined){
            return ret
        }
        switch(action.type){
            case "ruleClassID":
                return produce(state,draft=>{
                    let accessType = draft.accessType||"read"
                    draft[accessType]=draft[accessType]||{}
                    draft[accessType]["__client_data__"]= draft[accessType]["__client_data__"]||{}
                    let clientData = draft[accessType]["__client_data__"]
                    draft[accessType]["__client_data__"]=Object.assign({},clientData,{ruleClassID:action.data})
                })
            case "__client_data__":
                return produce(state,draft=>{
                        let accessType = draft.accessType||"read"
                        draft[accessType]=draft[accessType]||{}
                        let clientData = draft[accessType][action.type]||{}
                        draft[accessType][action.type]=Object.assign({},clientData,action.data)
                    })
            case "field-check":
                 return produce(state,draft=>{
                     let accessType = draft.accessType||"read"
                     draft[accessType]=draft[accessType]||{}
                     draft[accessType][action.type]=draft[accessType][action.type]||{}
                     draft[accessType][action.type][action.data.name]=action.data.value
                 })
            case "currentModel":
                return produce(state,draft=>{
                    draft[action.type]=action.data
                    let accessTypes = ["read","create","edit","delete"]
                    accessTypes.map(x=>{
                        draft[x]={}
                     })
                })

            case "currentRole":
                return produce(state||{},draft=>{
                    draft[action.type] = action.data
                    let accessTypes = ["read","create","edit","delete"]
                    accessTypes.map(x=>{
                        draft[x]={}
                     })
                })
            case "__reset__":
                return produce(state||{},draft=>{
                    let newDraft = {}
                    newDraft.createMeta = draft.createMeta
                    draft = newDraft
                    return draft
                })
            case "createMeta":
                {
                    return produce(state, draft=>{
                        draft[action.type] = action.data
                        let initData = action.data.data
                        let accessTypes = ["read","create","edit","delete"]
                        draft.accessType="read"
                        accessTypes.map(x=>{
                            draft[x]={}
                         })
                        if(initData){
                            this.buildInitData(draft,initData)
                        }
                        return draft
                    })
                }
            default:
                return produce(state||{},draft=>{
                    if(action.accessType){
                        draft[action.accessType] = draft[action.accessType]||{}
                        draft[action.accessType][action.type] = action.data
                    }
                    else{
                        draft[action.type] = action.data
                    }
                })
        }
    }

    isDisable(view,name){
        const {id} = view.props.location.state||{}
        if(id!=null && id>0){
            return true
        }
        return false
    }

    buildInitData(draft,initData){
        const {app,model,roleID,rule} = initData
        let ruleObj = []
        try{
            ruleObj = JSON.parse(rule)
        }
        catch(err){

        }
        draft.accessType="read"
        let acts =  ["read","create","edit","delete"]
        acts.map(act=>{
            var actObj = ruleObj.find(x=>x.accessType == act)
            draft.currentModel=app+"/"+model
            draft.currentRole=roleID
            draft[act]={}
            if(actObj){
                draft[act]={}
                draft[act].enable = actObj.enable
                draft[act].isolation = actObj.isolation
                draft[act].targetRoles = actObj.targetRoles
                draft[act].targetDepartments = actObj.targetDepartments
                draft[act].targetPartners = actObj.targetPartners
                draft[act].criteria = actObj.criteria
                draft[act].overrideCriteria = actObj.overrideCriteria
                draft[act]["__rules__data__"] = actObj.rules
                if(act!=="delete"){
                    let fieldChecks = {}
                    actObj.disableFields.map(f=>{
                        fieldChecks[f]=true
                    })
                    draft[act]["field-check"] = fieldChecks
                }
            }
        })
    }

    *effect(state,action){
        let self= this
        let ret = yield* super.effect(state,action)
        if(ret!==undefined){
            return ret
        }
        switch(action.type){
            case "loadCreateMeta":
                {

                    let ret = yield* new ModelAction(self.app,self.model).genCall("loadCreateMeta",{id:action.data})
                    console.log(ret)
                    if(ret && ret.errorCode==0){
                            yield self.put({
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
                let createData = self.createCreateData(action.data)
                let ret = yield* new ModelAction(self.app,self.model).genCall("doSaveModelRule",createData)
                if(ret.errorCode==0){
                    ModalSheetManager.alert({
                        title:"添加成功",
                        msg:ret?ret.description:ret.description
                    })
                }
                else{
                    ModalSheetManager.alert({
                        title:"获取数据失败",
                        msg:ret?ret.description:"通讯失败"
                    })
                }
                return 1
            case "_effect_do_save_and_create":
                let createData2 = self.createCreateData(action.data)
                let ret2 = yield* new ModelAction(self.app,self.model).genCall("doSaveModelRule",createData2)
                if(ret2.errorCode==0){
                    self.put({
                        type:"__reset__"
                    })
                }
                else{
                    ModalSheetManager.alert({
                        title:"获取数据失败",
                        msg:ret?ret.description:"通讯失败"
                    })
                }
                return 1
            default:
        }
    }

    createCreateData(storeData){
        let createData={
            id:storeData.id
        }
        createData.accessTypes=[]
        let acts = ["read","create","edit","delete"]
        acts.map(act=>{
            let atData = storeData[act]
            let data={}
            data.accessType = act
            createData.roleID = storeData.currentRole
            let appModel = (storeData.currentModel||"").split("/")
            if(appModel.length==2){
                createData.app = appModel[0]
                createData.model = appModel[1]
            }
            data.enable = atData.enable
            if(act !== "delete"){
                let disableFields = []
                atData["field-check"]= atData["field-check"]||{}
                Object.keys(atData["field-check"]).map(key=>{
                    if(atData["field-check"][key]){
                        disableFields.push(key)
                    }
                })

                data.disableFields = disableFields
            }
            data.isolation = atData.isolation!=="partner"?"corp":"partner"
            data.departments = atData.targetDepartments
            data.roles = atData.targetRoles
            data.partners= atData.targetPartners
            data.rules=atData["__rules__data__"]||[]
            data.criteria = atData.criteria
            data.overrideCriteria = atData.overrideCriteria
            createData.accessTypes.push(data)
        })
        return createData
    }

    didMount(view){
        const {id} = view.props.location.state||{}
        this.put({type:"loadCreateMeta",data:id})
    }

    onFieldChange(view,name,value,extra,accessType){
        switch(name){
            default:
                this.put({
                    type:name,
                    data:value,
                    accessType:accessType
                })
        }
        
    }
    getFieldValue(view,name,value,accessType){
        let v = view.props[name]
       switch(name){
           case "ruleClassID":
               const gAccessType = view.props.accessType
               return ((view.props[gAccessType]||{})["__client_data__"]||{})[name]
           case "accessType":
               return v||"read"
            case "enable":
                v = (view.props[accessType]||{})[name]
                return (v===undefined||v===null)?true:v
            case "isolation":
                v = (view.props[accessType]||{})[name]
                console.log("isolation = "+ v + "accessType="+accessType)
                return v!=="partner"?"corp":"partner"
            case "field-check":
                    v = (view.props[accessType]||{})[name]
                return (v||{})[value.name]
           default:
               if(accessType){
                return (view.props[accessType]||{})[name]
               }
               else{
                return view.props[name]
               }
             
       }
    }
    getCreatMeta(view){
        const {createMeta} = view.props
        return createMeta||{}
    }
    getRoles(view){
        return this.getCreatMeta(view).roles||[]
    }
    getModels(view){
        return this.getCreatMeta(view).models||[]
    }
    getModelFields(view){
        let {currentModel} = view.props
        let arr = (currentModel||"").split("/")
        if(arr.length==2){
            var model = this.getModels(view).find(m=>m.app == arr[0] && m.model==arr[1])
            if(model!=null){
                return model.fields||[]
            }
        }
        return []
    }

    getDepartments(view){
        return (this.getCreatMeta(view).departmentTree||{}).children || []
    }

    getPartners(view){
        return this.getCreatMeta(view).partners||[]
    }

    getRules(view){
        const accessType = view.props.accessType||"read"
        return (view.props[accessType]||{})["__rules__data__"]
    }

    showAddRuleDialog(view,visible){
        this.put({
            type:"__client_data__",
            data:{
                visible:visible,
                ruleClassID:""
            }
        })
    }

    showEditRuleDialog(view,index){

    }

    deleteRule(view,index){
        const accessType = view.props.accessType||"read"
        let rules =  (view.props[accessType]||{})["__rules__data__"]||[]
        rules=produce(rules,draft=>{
            draft = draft.splice(index,1)
        })
        this.put({
            type:"__rules__data__",
            data:rules,
            accessType
        })
    }
    getAddRuleDialogVisible(view){
        const accessType = view.props.accessType||"read"
        let clientData = (view.props[accessType]||{})["__client_data__"]||{}
        return clientData.visible||false
    }

    addRule(view){
        const accessType = view.props.accessType||"read"
        let clientData =  (view.props[accessType]||{})["__client_data__"]||{}
        if(clientData.ruleClassID){
            let rules = (view.props[accessType]||{})["__rules__data__"]||[]
            let newRules = []
            for(let r of rules){
                newRules.push(r)
            }
            newRules.push(clientData.ruleClassID)
            this.put({
                type:"__rules__data__",
                data:newRules,
                accessType
            })
        }
        this.showAddRuleDialog(view,false)
    }
    doSave(view){
        const {id} = view.props.location.state||{}
        let data={id,...view.props}
        this.put({
            type:"_effect_do_save",
            data:data
        })
    }
    disableResetButton(view){
        const {id} = view.props.location.state||{}
        if(id!=null && id>0){
            return true
        }
        return false
    }
    doReset(view){
        const {id} = view.props.location.state||{}
     
        this.put({
            type:"__reset__",
            data:id
        })
    }
    doSaveAndCreate(view){
        const {id} = view.props.location.state||{}
        let data={id,...view.props}
        this.put({
            type:"_effect_do_save_and_create",
            data:data
        })
    }
}

