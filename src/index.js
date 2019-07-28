import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import 'antd/dist/antd.css'
import './theme/css/antd.scss'
import './theme/css/login.scss'
import './theme/css/index.scss'
import { Provider } from 'react-redux'
import { ConnectedRouter} from 'connected-react-router'//connected-react-router
import reducers from './app-reducers' // Or wherever you keep your reducers
import {ReducerRegistry} from './ReducerRegistry'
import zhCN from 'antd/es/locale-provider/zh_CN';
import {LocaleProvider} from './ui'
import moment from 'moment'
import 'moment/locale/zh-cn';
const {store,history}= ReducerRegistry.create(reducers)
moment.locale('zh-cn');
ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <LocaleProvider locale={zhCN}>
                <App/>
            </LocaleProvider>
        </ConnectedRouter>
    </Provider>,document.getElementById('root'))
