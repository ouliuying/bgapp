import React from 'react'
import { Route, withRouter,Switch} from "react-router-dom"
import {connect} from 'react-redux'
//import Loadable from 'react-loadable';
// const LoadableChatFrame = withRouter((state=>state)(Loadable({
//     loader: () => import('./bgchat/MainFrame'),
//     loading: () => <div/>,
// })));
// const LoadableBgCore = withRouter((state=>state)(Loadable({
//     loader: () => import('./bgcore/MainFrame'),
//     loading:() => <div/>,
// })));
import RemoteMainFrame from './app/RemoteMainFrame'

class AppRoute extends React.Component{
    render(){
        return (
            <Switch>
                <Route path="/" component={RemoteMainFrame}></Route>
            </Switch>
        )
    }
}
function mapStateToProps(state){
    return state
 }
export default withRouter(connect(mapStateToProps)(AppRoute))
