
import {regModelView} from './modelView/ModelViewRegistry'
export function loadView(app,model,viewType,component){
    regModelView(app,model,viewType,component)
    return {
        model,
        viewType,
        component
    }
}