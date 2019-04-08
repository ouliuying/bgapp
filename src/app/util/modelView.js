export function getAppModelKey(app,model,ownerField){
    let key =`${app}.${model}`
    let pF=ownerField
    while(pF){
        key = `${pF.app}.${pF.model}.${pF.name}@${key}`
        pF=ownerField.ownerField
    }
    return key
}

export function updateViewField(viewData,ownerField){
    let {view,subViews}=viewData
    if(view){
        view.ownerField=ownerField
        (view.fields||[]).map(f=>{
            f.ownerField = ownerField
        })
        (subViews||[]).map(subView=>{
            let refField = view.fields.first(f=>{
                f.name == subView.refView.fieldName
            })
            subView.view && updateViewField(subView, refField)
        })
    }
}