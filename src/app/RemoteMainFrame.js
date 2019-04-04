import React from 'react'
import { ReducerRegistry } from '../ReducerRegistry'
import {connect} from 'react-redux'
import {
    withRouter,
    Switch,
    Redirect,
    Route,
    matchPath
} from 'react-router-dom'
import StaticRouter from './StaticRouter'
import DynamicRouter from './DynamicRouter'
class RemoteAppContainer extends React.Component {
    render(){
        
        return <Switch>
            <Route path="/app/dynamic" component={DynamicRouter}></Route>
            <Route path="/app/static" component={StaticRouter}></Route>
        </Switch>
    }
}


export default withRouter(connect(state=>state)(RemoteAppContainer))
