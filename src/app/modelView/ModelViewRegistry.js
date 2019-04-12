import getDefaultModelView from './index'

export function regModelView(app,model,viewType,component){
    ModelViewRegistry.add(app,model,viewType,component)
}

export function getModelView(app,model,viewType){
    return  ModelViewRegistry.get(app,model,viewType)||getDefaultModelView(viewType)
}

const ModelViewRegistry={
    modelViews:{},
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