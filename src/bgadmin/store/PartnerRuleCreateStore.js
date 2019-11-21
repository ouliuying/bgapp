import { AppModelViewStore } from "../../app/store/AppModelViewStore"
import { call, put } from 'redux-saga/effects'
import { ModelAction } from "../../app/mq/ModelAction"
import { ModalSheetManager } from "../../app/modelView/ModalSheetManager"
export default class PartnerRuleCreateStore extends AppModelViewStore{
    constructor(){
        super("admin","partnerRuleApi","create")
    }
    reducer(state,action){
        let ret = super.reducer(state,action)
        if(ret!==undefined){
            return ret
        }
        switch(action.type){
            default:
                let newState = Object.assign({},state)
                newState[action.type]=action.data
                return newState
        }
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

                    let ret = yield* new ModelAction(self.app,self.model).genCall("loadCreateMeta",{})
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
            default:
        }
    }

    didMount(view){
        this.put({type:"loadCreateMeta"})
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
           case "accessType":
               return v||"read"
            case "enable":
                return v||true
            case "isolocation":
                return v||"corp"
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

        return []
    }

}

