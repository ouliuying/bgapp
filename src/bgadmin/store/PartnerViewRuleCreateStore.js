import { AppModelViewStore } from "../../app/store/AppModelViewStore"
import { call, put } from 'redux-saga/effects'
import { ModelAction } from "../../app/mq/ModelAction"
import { ModalSheetManager } from "../../app/modelView/ModalSheetManager"
import produce from "immer"
import { push } from "connected-react-router"
import { ReducerRegistry } from "../../ReducerRegistry"
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

    reducer(state,action){
        switch(action.type){
            case "currentModel":
                return produce(state||{},draft=>{
                    draft["currentView"]=null
                    draft[action.type] = action.data
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
                return  1
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
}