import _ from 'lodash'
import { createStore, combineReducers, applyMiddleware ,compose} from 'redux'

import createHistory from 'history/createBrowserHistory'

import { connectRouter, routerMiddleware} from 'connected-react-router'
import { persistStore,persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { SSL_OP_ALL } from 'constants';
const persistConfig = {
    key: 'root',
    storage:storage,
    blacklist: [/*ViewContext.CREATE_CONTEXT,ViewContext.EDIT_CONTEXT,ViewContext.LIST_CONTEXT,*/"router"]
}

export class ReducerRegistry {
    static get Store(){
        return ReducerRegistry.store;
    }

    static get History(){
        return ReducerRegistry.history
    }

    static get Persistor(){
        return ReducerRegistry.persistor
    }
    static create(reducers){
        ReducerRegistry.reducers= reducers;
        // Create a history of your choosing (we're using a browser history in this case)
        const history = createHistory()

        // Build the middleware for intercepting and dispatching navigation actions
        const middleware = routerMiddleware(history)

        // Add the reducer to your store on the `router` key
        // Also apply our middleware for navigating
        ReducerRegistry.reducers={
            router: connectRouter(history),
            ...ReducerRegistry.reducers,
        }
        const persistedReducer = persistReducer(persistConfig, combineReducers(ReducerRegistry.reducers))

        const store = createStore(persistedReducer,
            {},
            compose(applyMiddleware(middleware))
        )
        let persistor = persistStore(store,null,() => {
                    store.getState() 
            })
        ReducerRegistry.store=store
        ReducerRegistry.history=history
        ReducerRegistry.persistor=persistor
        return {store,history,persistor}

    }

    static  Add(newReducers){
         if(ReducerRegistry.reducers){
             ReducerRegistry.reducers=_.assign({},ReducerRegistry.reducers,newReducers)
         }
         else{
             ReducerRegistry.reducers=newReducers
         }
         ReducerRegistry.store.replaceReducer(persistReducer(persistConfig,combineReducers(ReducerRegistry.reducers)))
         persistStore(ReducerRegistry.store,null,() => {
            ReducerRegistry.store.getState() 
        })
    }
}