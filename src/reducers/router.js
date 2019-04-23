import { createSelector } from 'reselect'

const getRouterLocationState = createSelector(state => state.router.location.state,
    (state)=>({state}))
const getDynamicRouterAppModelViewType = createSelector(state=>state.router.location.pathname,(pathname)=>{
    let items=pathname.split('/')
    let app=items[3]||""
    let model=items[4]||""
    let viewType=items[5]||""
    return {appModelViewType:{app,model,viewType}}
})
export const getDynamicRouterApp =  createSelector(state=>state.router.location.pathname,(pathname)=>{
    let items=pathname.split('/')
    let app=items[3]||""
    return {routerApp:app}
})
export {
    getRouterLocationState,
    getDynamicRouterAppModelViewType
}

