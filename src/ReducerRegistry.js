import _ from 'lodash'
import { createStore, combineReducers, applyMiddleware ,compose} from 'redux'

import createHistory from 'history/createBrowserHistory'

import { connectRouter, routerMiddleware} from 'connected-react-router'
import { persistStore,persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import ViewContext from './app/modelView/ViewContext'
import { MessageBus, SYS_INIT, PARTNER_INIT } from './mb/MessageBus';
import { getCurrPartner } from './reducers/partner';
const persistConfig = {
    key: 'root',
    storage:storage,
    blacklist: [ViewContext.APP_CONTEXT,"router","modalSheetQueue"]
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
        const history = createHistory()
        const middleware = routerMiddleware(history)
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
            let state = store.getState() 
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