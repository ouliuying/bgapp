import {SET_SYS,SET_PARTNER_CORPS,SET_PARTNER_CURR_CORP,UPDATE_SHORTCUT_APPS} from '../actions/sys'
import { createSelector, createSelectorCreator } from 'reselect'
import memoize from 'lodash.memoize'
import produce from 'immer'
//todo cache in memory, load after login/refresh page
const initSys={
    installApps:{},
    corps:[],
    currCorp:{},
    shortcutApps:[],
    roleApps:[]
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
        case UPDATE_SHORTCUT_APPS:
        {
            let newState=action.payload
            return  Object.assign({},state,newState)
        }
        default:
            return state
    }
}



    
export const getShortcutAppsSelector=createSelector(state=>state.sys.installApps,
    state=>state.sys.shortcutApps,state=>state.sys.roleApps,
    (installApps,shortcutApps,roleApps)=>{
        var apps=[]
        shortcutApps.map(name=>{
            var roleApp = roleApps.find(x=>x.name == name)
            if(roleApp){
                var app = installApps[name]
                app= produce(app, draft=>{
                    draft.modelUrl = roleApp.modelUrl
                })
                apps.push(app)
            }
        })
        return apps
    })

        
export const getRoleAppsSelector=createSelector(state=>state.sys.installApps,
    state=>state.sys.roleApps,
    (installApps,roleApps)=>{
        var apps=[]
        roleApps.map(appData=>{
            var app = installApps[appData.name]
            if(app){
                app= produce(app, draft=>{
                    draft.modelUrl = appData.modelUrl
                })
                apps.push(app)
            }
            return app
        })
        return apps

    })




export const getAppsSelector = createSelector(state=>state.sys.installApps,
(installApps)=>({installApps}))


export const corpModelsSelector=createSelector(state=>state.sys.installApps,
    (installApps)=>({installApps}))
export const    getUIAppCache=()=>{}
export const getViewActionsSelector=()=>{}

export const getCurrCorp = createSelector(state=>state.sys.currCorp,currCorp=>(currCorp))

