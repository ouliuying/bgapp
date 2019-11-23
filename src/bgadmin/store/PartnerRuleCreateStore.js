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
    updateAccessType(action){
        let self = this
        Object.keys(self.accessTypeData).map(key=>{
            if(key!=="current"){
                self.accessTypeData[key] = produce(self.accessTypeData[key]||{},draft=>{
                    draft[action.type]=action.data
                }) 
                if(action.type==="currentModel"){
                    self.accessTypeData[key]=produce(self.accessTypeData[key]||{},draft=>{
                        draft["field-check"] = {}
                    })
                }
            }
        })
    }
    reducer(state,action){
        let ret = super.reducer(state,action)
        if(ret!==undefined){
            return ret
        }
        switch(action.type){
            case "accessType":
                this.accessTypeData[this.accessTypeData.current] = produce(state,draft=>{

                })
                let oldState = this.accessTypeData[this.accessTypeData.current]
                this.accessTypeData.current = action.data
                return produce(this.accessTypeData[this.accessTypeData.current]||{
                    createMeta:oldState.createMeta,
                    currentModel:oldState.currentModel,
                    currentRole:oldState.currentRole
                },draft=>{
                    draft.createMeta = oldState.createMeta
                    draft[action.type]=action.data
                    draft.currentModel = oldState.currentModel
                    draft.currentRole=oldState.currentRole
                })
            case "ruleClassID":
                return produce(state,draft=>{
                    let clientData = draft["__client_data__"]||{}
                    draft["__client_data__"]=Object.assign({},clientData,{ruleClassID:action.data})
                })
            case "__client_data__":
                return produce(state,draft=>{
                        let clientData = draft[action.type]||{}
                        draft[action.type]=Object.assign({},clientData,action.data)
                    })
            case "field-check":
                 return produce(state,draft=>{
                    let newFieldCheck = draft[action.type]||{}
                    newFieldCheck[action.data.name]=action.data.value
                    draft[action.type]=newFieldCheck
                 })
            case "currentModel":
                this.updateAccessType(action)
                return produce(state,draft=>{
                    draft[action.type]=action.data
                    draft["field-check"]={}
                })

            case "currentRole":
                this.updateAccessType(action)
                return produce(state||{},draft=>{
                    draft[action.type] = action.data
                })
            case "__reset__":
                this.accessTypeData={
                    read:{},
                    current:"read"
                }
                return produce(state||{},draft=>{
                    let newDraft = {}
                    newDraft.createMeta = draft.createMeta
                    draft = newDraft
                    return draft
                })
            case "_effect_do_save":
                {
                    const {accessType} = state
                    this.accessTypeData[accessType||"read"]= state
                    return state
                }
            case "_effect_do_save_and_create":
                {
                    const {accessType} = state
                    this.accessTypeData[accessType||"read"]= state
                    return state
                }
            case "createMeta":
                {
                    return produce(state,draft=>{
                        draft[action.type] = action.data
                        let initData = action.data.data
                        if(initData){
                            this.buildInitData(draft,initData)
                        }
                        return draft
                    })
                }
            default:
                return produce(state||{},draft=>{
                    draft[action.type] = action.data
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
    buildInitData(state,initData){
        this.accessTypeData={
            current:"read"
        }
        const {app,model,roleID,rule} = initData
        let ruleObj = []
        try{
            ruleObj = JSON.parse(rule)
        }
        catch(err){

        }
        ["read","create","edit","delete"].map(act=>{
            var actObj = ruleObj.find(x=>x.accessType == act)
            let typeData={
                accessType:act,
                currentModel: app+"/"+model,
                currentRole:roleID
            }
            if(actObj){
                typeData.enable = actObj.enable
                typeData.isolocation = actObj.isolocation
                typeData.targetPartners = actObj.targetRoles
                typeData.targetDepartments = actObj.targetDepartments
                typeData.targetPartners = actObj.targetPartners
                typeData.criteria = actObj.criteria
                typeData.overrideCriteria = actObj.overrideCriteria
                typeData["__rules__data__"] = actObj.rules
                if(act!=="delete"){
                    let fieldChecks = {}
                    actObj.disableFields.map(f=>{
                        fieldChecks[f]=true
                    })
                    typeData["field-check"] = fieldChecks
                }
                this.accessTypeData[act] = typeData
            }
            else{
                this.accessTypeData[act]=typeData
            }
        })
       
            const {accessType} = state
            let currentData = this.accessTypeData[accessType||"read"]
            this.accessTypeData.current=accessType||"read"
            Object.keys(currentData).map(key=>{
                state[key]= currentData[key]
            })
            return state
       
       
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
    createCreateData(data){
        let createData={
            id:data
        }

        createData.accessTypes=[]

        Object.keys(this.accessTypeData).map(key=>{
            let atData = this.accessTypeData[key]
            if(["read","create","edit"].indexOf(key)>-1){
                let data={}
                data.accessType = key
                createData.roleID = atData.currentRole
                let appModel = (atData.currentModel||"").split("/")
                if(appModel.length==2){
                    createData.app = appModel[0]
                    createData.model = appModel[1]
                }
                data.enable = atData.enable
                let disableFields = []
                atData["field-check"]= atData["field-check"]||{}
                Object.keys(atData["field-check"]).map(key=>{
                    if(atData["field-check"][key]){
                        disableFields.push(key)
                    }
                })

                data.disableFields = disableFields
                data.isolocation = atData.isolocation
                data.departments = atData.targetDepartments
                data.roles = atData.targetRoles
                data.partners= atData.targetPartners
                data.rules=atData["__rules__data__"]||[]
                data.criteria = atData.criteria
                data.overrideCriteria = atData.overrideCriteria
                createData.accessTypes.push(data)
            }
            else if(key === "delete"){
                let data = {}
                data.accessType = key
                createData.roleID = atData.currentRole
                let appModel = (atData.currentModel||"").split("/")
                if(appModel.length==2){
                    createData.app = appModel[0]
                    createData.model = appModel[1]
                }
                data.enable = atData.enable
                data.isolocation = atData.isolocation
                data.departments = atData.targetDepartments
                data.roles = atData.targetRoles
                data.partners= atData.targetPartners
                data.rules=atData["__rules__data__"]
                data.criteria = atData.criteria
                data.overrideCriteria = atData.overrideCriteria
                createData.accessTypes.push(data)
            }
        })
        return createData
    }

    didMount(view){
        const {id} = view.props.location.state||{}
        this.put({type:"loadCreateMeta",data:id})
    }

    onFieldChange(view,name,value,extra){
        switch(name){
            default:
                this.put({
                    type:name,
                    data:value
                })
        }
        
    }
    getFieldValue(view,name,value){
        let v = view.props[name]
       switch(name){
           case "ruleClassID":
               return (view.props["__client_data__"]||{})[name]
           case "accessType":
               return v||"read"
            case "enable":
                return (v==undefined||v==null)?true:v
            case "isolocation":
                return v||"corp"
            case "field-check":
                return (view.props[name]||{})[value.name]
           default:
               return view.props[name]
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
        return view.props["__rules__data__"]
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
        let rules =  view.props["__rules__data__"]||[]
        rules=produce(rules,draft=>{
            draft = draft.splice(index,1)
        })
        this.put({
            type:"__rules__data__",
            data:rules
        })
    }
    getAddRuleDialogVisible(view){
        let clientData = view.props["__client_data__"]||{}
        return clientData.visible||false
    }

    addRule(view){
        let clientData =  view.props["__client_data__"]||{}
        if(clientData.ruleClassID){
            let rules = view.props["__rules__data__"]||[]
            let newRules = []
            for(let r of rules){
                newRules.push(r)
            }
            newRules.push(clientData.ruleClassID)
            this.put({
                type:"__rules__data__",
                data:newRules
            })
        }
        this.showAddRuleDialog(view,false)
    }
    doSave(view){
        const {id} = view.props.location.state||{}
        this.put({
            type:"_effect_do_save",
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
    doReset(view){
        const {id} = view.props.location.state||{}
        this.put({
            type:"__reset__",
            data:id
        })
    }
    doSaveAndCreate(view){
        const {id} = view.props.location.state||{}
        this.put({
            type:"_effect_do_save_and_create",
            data:id
        })
    }
}

