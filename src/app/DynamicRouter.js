import React from 'react'
import { Route, withRouter,Switch} from "react-router-dom"
import {connect} from 'react-redux'
import Loadable from 'react-loadable'
const appInContainers={
    "core":Loadable({
        loader: () => import('../bgcore/CoreInContainer'),
        loading: () => <div/>,
    }),
    "corp":Loadable({
        loader: () => import('../bgcorp/CorpInContainer'),
        loading: () => <div/>,
    })
}
function TestApp(){
    return <div>test</div>
}
class DynamicRouter extends React.Component{

    render(){
        return <Switch>
        {
            Object.keys(appInContainers).map(key=>{
                const AppInContainer=appInContainers[key]
                const rPath="/app/dynamic/"+key
                return <Route path={rPath} component={AppInContainer} key={rPath}></Route>
            })
        }
        </Switch>
    }
}

function mapStateToProps(state){
   return {}
}
export default withRouter(connect(mapStateToProps)(DynamicRouter))
