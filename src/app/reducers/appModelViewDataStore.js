import produce from "immer"
import { select, take ,takeEvery,call} from 'redux-saga/effects'

let _appModelViewDataStoreReducers = {

}
let _appModelViewDataStoreEffects={

}
export function addAppModelViewStore(appModelViewStore){
    if(appModelViewStore.reducers){
        Object.keys(appModelViewStore.reducers).map(key=>{
            var type = `${appModelViewStore.app}/${appModelViewStore.model}/${appModelViewStore.viewType}/${key}`
            _appModelViewDataStoreReducers[type]=appModelViewStore.reducers[key]
        })
    }
    if(appModelViewStore.effects){
        Object.keys(appModelViewStore.effects).map(key=>{
            var type = `${appModelViewStore.app}/${appModelViewStore.model}/${appModelViewStore.viewType}/${key}`
            _appModelViewDataStoreEffects[type]=appModelViewStore.effects[key]
        })
    }
}

export function appModelViewDataStore(state,action){
    if(typeof state == "undefined"){
        return {}
    }
    let appModelViewReducer=_appModelViewDataStoreReducers[action.type]
    if(appModelViewReducer){
        return produce(state,draft=>{
            draft[action.type] = appModelViewReducer(state[action.type])
        })
    }
    return state
}

export function *appModelViewDataStoreEffectMonitor(type,data,state){
   let effect = _appModelViewDataStoreEffects[type]
   if(effect){
       yield call(effect,data,state)
   }
}