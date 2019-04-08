import {ReducerRegistry} from '../../ReducerRegistry'
export const SET_CREATE_CONTEXT_FIELD_VALUE='setCreateContextFieldValue'
export const CLEAR_CREATE_CONTEXT_FIELD_VALUE='clearCreateContextFieldValue'
export const SET_CREATE_CONTEXT_VIEW_DATA='setCreateContextViewData'
export const SET_LIST_CONTEXT_CRITERIA='setListContextCtriteria'
export const SET_LIST_CONTEXT_VIEW_DATA='setListContextData'

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

export function setListContextCriteria(app,model,cKey,criteria){
    const {store}=ReducerRegistry
    store.dispatch({
        type:SET_LIST_CONTEXT_CRITERIA,
        payload:{
            app,
            model,
            cKey,
            criteria
        }
    })
}




export function setListContextData(app,model,viewData,ownerField){
    setContextDataAction(SET_LIST_CONTEXT_VIEW_DATA, {app,model,viewData,ownerField})
}


