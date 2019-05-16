import { createSelector } from 'reselect'



const getRouterLocationState = state => ({state:state.router.location.state})
//cached value wrong
const getDynamicRouterAppModelViewType = state=>{
    let pathname=state.router.location.pathname
    let items=pathname.split('/')
    let app=items[3]||""
    let model=items[4]||""
    let viewType=items[5]||""
    return {appModelViewType:{app,model,viewType}}
}

export const getDynamicRouterApp = state=>{
    let pathname=state.router.location.pathname
    let items=pathname.split('/')
    let app=items[3]||""
    return {routerApp:app}
}
export {
    getRouterLocationState,
    getDynamicRouterAppModelViewType
}
export const getRoutePath=state=>{
    return state.router.location.pathname
}

