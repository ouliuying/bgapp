import {ReducerRegistry} from '../../ReducerRegistry'
export const OPEN_MODAL_SHEET='openModalSheet'
export const CLOSE_MODAL_SHEET='closeModalSheet'

function doSheetAction(type,payload){
    const {store}=ReducerRegistry
    store.dispatch({
        type,
        payload
    })
}

export function openModalSheet(view,props,sheetIndex){
    doSheetAction(OPEN_MODAL_SHEET,{
        view,
        props,
        sheetIndex
    })
}

export function closeModalSheet(modalSheet){
    doSheetAction(CLOSE_MODAL_SHEET,{
        modalSheet
    })
}

