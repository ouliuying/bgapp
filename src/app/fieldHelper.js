
import {produce} from 'immer'
import { RECORD_TAG } from './ReservedKeyword';
export function bindRecordTag(ownerField,tag){
    return produce(ownerField,draft=>{
        draft[RECORD_TAG]=tag
    })
}