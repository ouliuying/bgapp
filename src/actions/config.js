import {ReducerRegistry} from '../ReducerRegistry'

export const SET_CURR_APP='SET_CURR_APP'

export function setCurrApp(data) {
    const {store}=ReducerRegistry
    store.dispatch({
        type:SET_CURR_APP,
        payload:data
    })
}

