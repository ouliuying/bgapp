
import {SET_APP_IN_CONTAINER_VIEWS_MENU} from '../actions/appInContainer'

import produce from "immer"
import { createSelector } from 'reselect'
import memoize from 'lodash.memoize'

const appInContainerStore={}


export function appInContainer(state,action){
    if(typeof state == "undefined"){
        return appInContainerStore
    }
    switch(action.type){
        case SET_APP_IN_CONTAINER_VIEWS_MENU:
        {
            let newState=action.payload
            return produce(state,draft=>{
                draft[newState.app]=draft[newState.app]||{}
                draft[newState.app]={
                    views:newState.views,
                    menu:newState.menu
                }
            })
        }
        default:
            return state
    }

}


export const getAppViewsMenu = createSelector(state=>state.appInContainer,(appInContainerStore)=>memoize(app=>
    {
        console.log("app = "+app)
        if(!appInContainerStore||!appInContainerStore[app]) return {}
        console.log("app = " +appInContainerStore[app])
        return appInContainerStore[app]
}
))





