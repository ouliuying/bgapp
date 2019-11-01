import {ReducerRegistry} from '../../ReducerRegistry'
export const SET_CREATE_CONTEXT_FIELD_VALUE='setCreateContextFieldValue'
export const CLEAR_CREATE_CONTEXT_FIELD_VALUE='clearCreateContextFieldValue'
export const SET_CREATE_CONTEXT_VIEW_DATA='setCreateContextViewData'
export const UPDATE_CREATE_CONTEXT_FIELD_META = 'updateCreateContextViewData'
export const SET_LIST_CONTEXT_CRITERIA='setListContextCtriteria'
export const SET_LIST_CONTEXT_VIEW_DATA='setListContextData'
export const SET_EVENT_LOG_CONTEXT_CRITERIA='setEventLogContextCtriteria'
export const SET_EVENT_LOG_CONTEXT_VIEW_DATA = 'setEventLogContextData'
export const UPDATE_LIST_CONTEXT_VIEW_DATA_RECORD='updateListContextViewDataRecord'

//export const UPDATE_LIST_CONTEXT_VIEW_DATA='updateListContextData'
export const REMOVE_LIST_CONTEXT_VIEW_DATA_RECORD = 'removeListContextViewDataRecord'
//export const SET_LIST_CONTEXT_PAEG_DATA = 'setListContextPageData'

export const SET_DETAIL_CONTEXT_VIEW_DATA = 'setDetailContextViewData'

export const SET_EDIT_CONTEXT_VIEW_DATA = 'setEditContextViewData'
export const SET_EDIT_CONTEXT_FIELD_VALUE = 'setEditContextFieldValue'

export const SET_LIST_OP_SEARCH_BOX_VISIBLE= "setListOpSearchBoxVisible"
export const SET_LIST_OP_SEARCH_BOX_CRITERIA_VALUE='setListOpSearchBoxCriteriaValue'
export const SET_LIST_CURRENT_PAGE="setListCurrentPage"
export const SET_LIST_PAGE_SIZE="setListPageSize"


export const SET_EVENT_LOG_OP_SEARCH_BOX_VISIBLE= "setEventLogOpSearchBoxVisible"
export const SET_EVENT_LOG_OP_SEARCH_BOX_CRITERIA_VALUE='setEventLogOpSearchBoxCriteriaValue'
export const SET_EVENT_LOG_CURRENT_PAGE="setEventLogCurrentPage"
export const SET_EVENT_LOG_PAGE_SIZE="setEventLogPageSize"


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



export function clearCreateContextFieldValue(app,model,viewType,ownerField){
    const {store}=ReducerRegistry
    store.dispatch({
        type:CLEAR_CREATE_CONTEXT_FIELD_VALUE,
        payload:{app,model,viewType, ownerField}
    })
}

export function setCreateContextViewData(app,model,viewType, viewData,ownerField){
    setContextDataAction(SET_CREATE_CONTEXT_VIEW_DATA, {app,model,viewType,viewData,ownerField})
}

export function setListContextCriteria(app,model,viewType,ownerField,cKey,criteria){
    const {store}=ReducerRegistry
    store.dispatch({
        type:SET_LIST_CONTEXT_CRITERIA,
        payload:{
            app,
            model,
            viewType,
            ownerField,
            cKey,
            criteria
        }
    })
}


export function setEventLogContextCriteria(app,model,viewType,ownerField,cKey,criteria){
    const {store}=ReducerRegistry
    store.dispatch({
        type:SET_EVENT_LOG_CONTEXT_CRITERIA,
        payload:{
            app,
            model,
            viewType,
            ownerField,
            cKey,
            criteria
        }
    })
}





export function setListContextData(app,model,viewType,viewData,ownerField){
   setContextDataAction(SET_LIST_CONTEXT_VIEW_DATA, {app,model,viewData,viewType,ownerField})
}

export function setEventLogContextData(app,model,viewType,eventLogs,totalCount,ownerField){
    setContextDataAction(SET_EVENT_LOG_CONTEXT_VIEW_DATA, {app,model,eventLogs,viewType,totalCount,ownerField})
}



export function removeListContextViewDataRecord(app,model,viewType,tags,ownerField){
    setContextDataAction(REMOVE_LIST_CONTEXT_VIEW_DATA_RECORD, {app,model,viewType,tags,ownerField})
}

export function updateListContextViewDataRecord(app,model,viewType,record,ownerField){
    setContextDataAction(UPDATE_LIST_CONTEXT_VIEW_DATA_RECORD, {app,model,viewType,record,ownerField})
}



export function setDetailContextViewData(app,model,viewType,viewData,ownerField){
    setContextDataAction(SET_DETAIL_CONTEXT_VIEW_DATA, {app,model,viewType,viewData,ownerField})
}
export function setEditContextViewData(app,model,viewType, viewData,ownerField){
    setContextDataAction(SET_EDIT_CONTEXT_VIEW_DATA, {app,model,viewType,viewData,ownerField})
}

export function setEditContextFieldValue(fieldValues){
    const {store}=ReducerRegistry
    store.dispatch({
        type:SET_EDIT_CONTEXT_FIELD_VALUE,
        payload:fieldValues
    })
}
export function setListOpSearchBoxCriteriaValue(app,model,viewType,ownerField,fieldName,value){
    setContextDataAction(SET_LIST_OP_SEARCH_BOX_CRITERIA_VALUE, {app,model,viewType,ownerField,fieldName,value})
}
export function setListOpSearchBoxVisible(app,model,viewType,ownerField,visible){
    setContextDataAction(SET_LIST_OP_SEARCH_BOX_VISIBLE, {app,model,viewType,ownerField,visible})
}
export function setListCurrentPage(app,model,viewType,ownerField,currentPage){
    setContextDataAction(SET_LIST_CURRENT_PAGE, {app,model,viewType,ownerField,currentPage})
}
export function setListPageSize(app,model,viewType,ownerField,pageSize){
    setContextDataAction(SET_LIST_PAGE_SIZE, {app,model,viewType,ownerField,pageSize})
}


export function setEventLogOpSearchBoxCriteriaValue(app,model,viewType,ownerField,fieldName,value){
    setContextDataAction(SET_EVENT_LOG_OP_SEARCH_BOX_CRITERIA_VALUE, {app,model,viewType,ownerField,fieldName,value})
}
export function setEventLogOpSearchBoxVisible(app,model,viewType,ownerField,visible){
    setContextDataAction(SET_EVENT_LOG_OP_SEARCH_BOX_VISIBLE, {app,model,viewType,ownerField,visible})
}
export function setEventLogCurrentPage(app,model,viewType,ownerField,currentPage){
    setContextDataAction(SET_EVENT_LOG_CURRENT_PAGE, {app,model,viewType,ownerField,currentPage})
}
export function setEventLogPageSize(app,model,viewType,ownerField,pageSize){
    setContextDataAction(SET_EVENT_LOG_PAGE_SIZE, {app,model,viewType,ownerField,pageSize})
}


export function updateCreateContextViewData(app,model,viewType,ownerField,field,meta){
    setContextDataAction(UPDATE_CREATE_CONTEXT_FIELD_META, {app,model,viewType,ownerField,field,meta})
}




