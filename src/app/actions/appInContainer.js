import { ReducerRegistry } from '../../ReducerRegistry'
export const SET_APP_IN_CONTAINER_VIEWS_MENU = 'setAppInContainerStoreViewsMenu'

function setAppInContainerStore(type, payload) {
    const { store } = ReducerRegistry
    store.dispatch({
        type,
        payload
    })
}

export function setAppInContainerViewMenu(app, views, menu) {
    setAppInContainerStore(
        SET_APP_IN_CONTAINER_VIEWS_MENU, {
            app,
            views,
            menu
        }
    )
}