import {getModelView} from '../modelView/ModelViewRegistry'
import {ModalSheetManager} from '../modelView/ModalSheetManager'
export class ViewCMM{
    constructor(app,model,viewType){
        this.app=app
        this.model = model
        this.viewType=viewType
    }
    
    static get s_model(){
        return "*"
    }

    static get s_app(){
        return "*"
    }

    mapTo(state,ownProps){
        return Object.assign({},ownProps)
    }

    init(view){
    }

    update(view){
    }

    didMount(view){

    }

    doAction(view, trigger){
        const f = this[trigger.name]
        if(f && f instanceof Function){
             f.call(this,view,trigger)
            return true
        }
    }

    showAppModelViewInModalQueue(app,model,viewType,viewRefType,viewParam){
        let view = getModelView(app,model,viewType)
        view && (
            ModalSheetManager.openModal(view,{
                app,
                model,
                viewType,
                viewParam,
                viewRefType
            })
        )
    }
}


export class DummyViewCMM extends ViewCMM{
    constructor(app,model,viewType){
        super(app,model,viewType)
    }
    static get viewType(){
        return "dummy"
    }
    mapTo(state,ownProps){
        return ownProps
    }
}
