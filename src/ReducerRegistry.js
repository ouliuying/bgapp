import _ from 'lodash'
import { createStore, combineReducers, applyMiddleware ,compose} from 'redux'

//import createHistory from 'history/createBrowserHistory'
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware, push} from 'connected-react-router'
import { persistStore,persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import ViewContext from './app/modelView/ViewContext'
import { MessageBus, SYS_INIT, PARTNER_INIT, ROUTE_CHANGE } from './mb/MessageBus';
import {TOKEN_CHECK} from './bgcore/partnerMessage'
import { getCurrPartner } from './reducers/partner';
import { clearModalSheet } from './app/actions/modalSheetQueue';
import { routeChange } from './app/routerHelper';
import createSagaMiddleware from 'redux-saga'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
const persistConfig = {
    key: 'bgworkroot',
    storage:storage,
    blacklist: [ViewContext.APP_CONTEXT,"router","modalSheetQueue","chat"]
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
        const history = createBrowserHistory()
        history.listen((location)=>{
            clearModalSheet()
        })
        const middleware = routerMiddleware(history)
        const routerMonitorMiddleware = routeChange(history)
        const sagaMiddleware = createSagaMiddleware()
        ReducerRegistry.reducers={
            router: connectRouter(history),
            ...ReducerRegistry.reducers,
        }
        const persistedReducer = persistReducer(persistConfig, combineReducers(ReducerRegistry.reducers))

        const store = createStore(persistedReducer,
            {},
            compose(applyMiddleware(sagaMiddleware),applyMiddleware(middleware),applyMiddleware(routerMonitorMiddleware))
        )
        sagaMiddleware.run(function* (){
            yield takeLatest("@@router/LOCATION_CHANGE", function* (action){
                    yield 1
            });
        })
        let persistor = persistStore(store,null,() => {
            let state = store.getState() 
            MessageBus.ref.send(TOKEN_CHECK,{...state})
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