import produce from "immer"
import { select, take ,takeEvery,call} from 'redux-saga/effects'

let _appModelViewDataStores = {

}
function getKeyFromActionType(actionType){
    let index = actionType.lastIndexOf("/")
    if(index>0){
        let key= actionType.substring(0,index)
        let shortActionType = actionType.substring(index+1)
        return {key,actionType:shortActionType}
    }
    else{
        return {key:actionType,actionType:actionType}
    }
}
export function addAppModelViewStore(appModelViewStore){
    let key=`/${appModelViewStore.app}/${appModelViewStore.model}/${appModelViewStore.viewType}`
    _appModelViewDataStores[key] = appModelViewStore
}
export function appModelViewDataStore(state,action){
    if(typeof state == "undefined"){
        return {}
    }
    if(action.isAppModelViewStoreAction){
        let storeKey = getKeyFromActionType(action.type)
        let avd=_appModelViewDataStores[storeKey.key]
        if(avd){
            let newState =  produce(state,draft=>{
                let newAction = {...action}
                newAction.type=storeKey.actionType
                newAction.type = storeKey.actionType
                draft[storeKey.key] = avd.reducer(state[storeKey.key],newAction)
            })
            return newState
        }
    }
    
    return state
}
function *tx(ff){
   yield alert(ff)
}
export function *appModelViewDataStoreEffectMonitor(state,action){
    let storeKey = getKeyFromActionType(action.type)
    let avd = _appModelViewDataStores[storeKey.key]
    if(avd){
        try{
            //global state
            let newAction = {...action}
            newAction.type=storeKey.actionType
            yield* avd.effect(state,newAction)
        }
        catch(err){
            console.error(err)
        }
        
    }
}