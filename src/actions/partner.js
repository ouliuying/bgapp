import {ReducerRegistry} from '../ReducerRegistry'

export const SET_PARTNER='INIT_PARTNER'

export const SET_PARTNER_USERNAME_PASSWORD='SET_PARTNER_USERNAME_PASSWORD'

export function setPartner(data) {
    const {store}=ReducerRegistry
    store.dispatch({
        type:SET_PARTNER,
        payload:data
    })
}
export function setPartnerUserNamePassword(data){
    const {store}=ReducerRegistry
    store.dispatch({
        type:SET_PARTNER_USERNAME_PASSWORD,
        payload:data
    })
}