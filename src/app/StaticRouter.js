import React from 'react'
import { Route, withRouter,Switch,Redirect} from "react-router-dom"
import {connect} from 'react-redux'
class StaticRouter extends React.Component{
    render(){
        return <Switch>
                <Route path="/app/static/chat" render={
                    ()=>{
                        return <Redirect to={{pathname:"/app/dynamic/chat"}}></Redirect>
                    }
                }></Route>
        </Switch>
    }
}

export default withRouter(connect(state=>state)(StaticRouter))