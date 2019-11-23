import { ReducerRegistry } from "../../ReducerRegistry"

export class AppModelViewStore{
    constructor(app,model,viewType){
        this.app = app
        this.model = model
        this.viewType = viewType
        this.propsCache={}
    }

    reducer(state,data){

    }

    * effect(state,data){
    }
    get dispatch(){
        const {store} = ReducerRegistry
        return store.dispatch
    }
    put(action){
        let {type} = action
        let fullType = type
        if(type.indexOf("/")!==0){
            fullType =  `/${this.app}/${this.model}/${this.viewType}/${type}`
        }
        const {store} = ReducerRegistry
        store.dispatch(Object.assign({},action,{
            type:fullType,
            isAppModelViewStoreAction:true
        }))
    }
    mapStateToProps(state){
        let props =  {appModelViewStore:this}
        props = Object.assign({},state.appModelViewDataStore[`/${this.app}/${this.model}/${this.viewType}`]||{},props)
        this.propsCache = props
        return props
    }
}