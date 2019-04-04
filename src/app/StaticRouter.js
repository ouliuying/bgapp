import React from 'react'
import { Route, withRouter,Switch} from "react-router-dom"
import {connect} from 'react-redux'
import Loadable from 'react-loadable';
const LoadableChatFrame = withRouter((state=>state)(Loadable({
    loader: () => import('../bgchat/MainFrame'),
    loading: () => <div/>,
})));
class StaticRouter extends React.Component{
    render(){
        return <Switch>
                <Route path="/app/static/chat" component={LoadableChatFrame}></Route>
        </Switch>
    }
}

export default withRouter(connect(state=>state)(StaticRouter))