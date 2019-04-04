
import {ReducerRegistry} from '../../ReducerRegistry'
import {getViewActionsSelector} from '../../reducers/sys'


export class ViewActionProvider{
    
    static  getAction(app,model,viewType){
        if(!this.viewActions){
            const {store}=ReducerRegistry
            const state=store.getState()
            this.viewActions=getViewActionsSelector(state)["viewActions"]
        }
        let va=this.viewActions
        let key = `${app}_${model}_${viewType}`
        let ac= va[key]
        if(!ac && model!=="*"){
            key = `${app}_*_${viewType}`
            ac= va[key]
        }

        if(!ac && app!=="*" && model!=="*"){
            key = `*_*_${viewType}`
            ac= va[key]
        }
        return ac
    }

    static getActionGroup(app,model,viewType,name){
        var ac=this.getAction(app,model,viewType)
        if(ac && ac.groups){
            return ac.groups[name]
        }
    }
}
ViewActionProvider.viewActions=null
