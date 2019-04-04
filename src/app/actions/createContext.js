import {ReducerRegistry} from '../../ReducerRegistry'
export const SET_CREATE_CONTEXT_FIELD_VALUE='setCreateContextFieldValue'
export const CLEAR_CREATE_CONTEXT_FIELD_VALUE='clearCreateContextFieldValue'
export const SET_CREATE_CONTEXT_VIEW_DATA='setCreateContextViewData'

function setContextDataAction(type,payload){
    const {store}=ReducerRegistry
    store.dispatch({
        type,
        payload
    })
}
export function setCreateContextFieldValue(fieldValues){
    const {store}=ReducerRegistry
    store.dispatch({
        type:SET_CREATE_CONTEXT_FIELD_VALUE,
        payload:fieldValues
    })
}



export function clearCreateContextFieldValue(app,model,ownerField){
    const {store}=ReducerRegistry
    store.dispatch({
        type:CLEAR_CREATE_CONTEXT_FIELD_VALUE,
        payload:{app,model,ownerField}
    })
}

export function setCreateContextViewData(app,model,viewData,ownerField){
    setContextDataAction(SET_CREATE_CONTEXT_VIEW_DATA, {app,model,viewData,ownerField})
}


