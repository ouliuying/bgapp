import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import 'element-theme-default'
import './theme/css/login.scss'
import './theme/css/index.scss'
import { Provider } from 'react-redux'
import { ConnectedRouter} from 'connected-react-router'//connected-react-router
import reducers from './app-reducers' // Or wherever you keep your reducers
import {ReducerRegistry} from './ReducerRegistry'
const {store,history}= ReducerRegistry.create(reducers)
ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App/>
        </ConnectedRouter>
    </Provider>,document.getElementById('root'))
