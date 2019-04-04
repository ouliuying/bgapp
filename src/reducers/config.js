import {SET_CURR_APP} from '../actions/config'
import { createSelector } from 'reselect'
import memoize from 'lodash.memoize'
const initConfig={
    currApp:{},
}

export function config(state,action){
    if(typeof state == "undefined"){
        return initConfig 
    }
    switch(action.type){
        case SET_CURR_APP:
        {
            let newState=action.payload
            return Object.assign({},state,newState)
        }

        default:
            return state
    }
}

export const getCurrentApp = createSelector(state=>state.config.currApp,
    (currApp)=>({currApp}))
