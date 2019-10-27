
import {OPEN_MODAL_SHEET,CLOSE_MODAL_SHEET,CLEAR_MODAL_SHEET} from '../actions/modalSheetQueue'

import produce from "immer"
import { createSelector } from 'reselect'
import memoize from 'lodash.memoize'

const modalSheetQueueStore={}


export function modalSheetQueue(state,action){
    if(typeof state == "undefined"){
        return modalSheetQueueStore
    }
    switch(action.type){
        case OPEN_MODAL_SHEET:
        {
            let {view,props,sheetIndex} = action.payload
            let obj={}
            obj[sheetIndex]={view,props}
            return {...state,...obj}
        }
        case CLOSE_MODAL_SHEET:
        {
            const {modalSheet} = action.payload
            modalSheet && modalSheet.index && (delete state[modalSheet.index])
           return {...state}
        }
        case CLEAR_MODAL_SHEET:
        {
            return {}
        }
        default:
            return state
    }
}


export const getModalSheetQueue = createSelector(state=>state.modalSheetQueue,(modalSheetQueue)=>({modalSheetQueue}))
