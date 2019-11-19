import { ReducerRegistry } from "../../ReducerRegistry"

export class AppModelViewStore{
    constructor(app,model,viewType){
        this.app = app
        this.model = model
        this.viewType = viewType
        this.reducers = {}
        this.effects = {}
    }
    put(type,data){
        let fullType = type
        if(type.indexOf("/")!==0){
            fullType =  `${this.app}/${this.model}/${this.viewType}/${type}`
        }
        const {store} = ReducerRegistry
        store.dispatch({
            type:fullType,
            data,
            isAppModelViewStoreAction:true
        })
    }
    mapStateToProps(state){
        return {appModelViewStore:this}
    }
}