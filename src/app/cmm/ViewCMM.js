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
