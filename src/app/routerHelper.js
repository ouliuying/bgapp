import {ReducerRegistry} from '../ReducerRegistry'
import {push} from "connected-react-router"
export function getRoutePath(app,model,action){
    return `/app/dynamic/${app}/${model}/${action}`
}

export function goRoute(route,state){
    const {store}=ReducerRegistry
    store.dispatch(push(route,state))
}