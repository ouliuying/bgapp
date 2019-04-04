import {ReducerRegistry} from '../ReducerRegistry'

export const SET_SYS='INIT_SYS'
export const SET_PARTNER_CORPS='SET_PARTNER_CORPS'
export const SET_PARTNER_CURR_CORP='SET_PARTNER_CURR_CORP'
export function setSys(data) {
    const {store}=ReducerRegistry
    store.dispatch({
        type:SET_SYS,
        payload:data
    })
}