import getDefaultModelView from './index'
import ViewType from './ViewType'
import {CREATE_VIEW_DATA, LIST_VIEW_DATA, DETAIL_VIEW_DATA, EDIT_VIEW_DATA} from '../ReservedKeyword'
export function regModelView(app,model,viewType,component){
    ModelViewRegistry.add(app,model,viewType,component)
}
export function regViewTypeViewDataContextKey(viewType,viewDataContextKey){
    ModelViewRegistry.viewType2ViewDataContextKey[viewType]=viewDataContextKey
}
export function getViewTypeViewDataContextkey(viewType){
    return ModelViewRegistry.viewType2ViewDataContextKey[viewType]||"__unknow__"
}
export function getModelView(app,model,viewType){
    return  ModelViewRegistry.get(app,model,viewType)||getDefaultModelView(viewType)
}

const ModelViewRegistry={
    modelViews:{},
    viewType2ViewDataContextKey:{},
    add(app,model,viewType,component){
        let key = `${app}_${model}_${viewType}`
        this.modelViews[key]=component
    },
    get(app,model,viewType){
        let key = `${app}_${model}_${viewType}`
        let mv= this.modelViews[key]
        if(mv){
            return mv
        }
        if(app!="*" && model!="*"){
            mv= this.get("*",model,viewType)
            if(mv){
                return mv
            }
        }
        if(app=="*" && model!="*"){
            mv= this.get("*","*",viewType)
            if(mv){
                return mv
            }
        }
    }
}
regViewTypeViewDataContextKey(ViewType.LIST,LIST_VIEW_DATA)
regViewTypeViewDataContextKey(ViewType.CREATE,CREATE_VIEW_DATA)
regViewTypeViewDataContextKey(ViewType.EDIT,EDIT_VIEW_DATA)
regViewTypeViewDataContextKey(ViewType.DETAIL,DETAIL_VIEW_DATA)
regViewTypeViewDataContextKey(ViewType.MODEL_ACTION,EDIT_VIEW_DATA)