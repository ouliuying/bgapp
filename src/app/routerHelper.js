import {ReducerRegistry} from '../ReducerRegistry'
import {push} from "connected-react-router"
import { getAppsSelector } from '../reducers/sys'
import { setCurrApp } from '../actions/config'
export function getRoutePath(app,model,action){
    return `/app/dynamic/${app}/${model}/${action}`
}
export function getAppFromPath(path){
    let items = path.split('/')
    return items[3]
}
export function goRoute(route,state){
    const {store}=ReducerRegistry
    store.dispatch(push(route,state))
}

export function routeChange(history){
    return ({ getState, dispatch })=>{
        return next => action => {
           const result = next(action)
           return result
         }
    }
}