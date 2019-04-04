import {SET_SYS,SET_PARTNER_CORPS,SET_PARTNER_CURR_CORP} from '../actions/sys'
import { createSelector, createSelectorCreator } from 'reselect'
import memoize from 'lodash.memoize'
//todo cache in memory, load after login/refresh page
const initSys={
    installApps:{},
    corps:[],
    currCorp:{},
    shortcutApps:[]
}

export function sys(state,action){
    if(typeof state == "undefined"){
        return initSys
    }
    switch(action.type){
        case SET_SYS:
        {
            let newState=action.payload
            if(newState.errorCode===0){
                return Object.assign({},state,newState.bag.sys)
            }
            return state
        }
        case SET_PARTNER_CORPS:
        {
            let newState=action.payload
            return  Object.assign({},state,newState)
        }
        case SET_PARTNER_CURR_CORP:
        {
            let newState=action.payload
            return  Object.assign({},state,newState)
        }
        default:
            return state
    }
}



    
export const getShortcutAppsSelector=createSelector(state=>state.sys.installApps,
    state=>state.sys.shortcutApps,
    (installApps,shortcutApps)=>{
        var apps=[]
        for(var appName of shortcutApps){
            apps.push(installApps[appName])
        }
        return apps
    })



export const getAppsSelector = createSelector(state=>state.sys.installApps,
(installApps)=>({installApps}))


export const corpModelsSelector=createSelector(state=>state.sys.installApps,
    (installApps)=>({installApps}))
export const    getUIAppCache=()=>{}
export const getViewActionsSelector=()=>{}

