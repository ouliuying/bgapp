import React from "react"
import {connect} from 'react-redux'
import {
    withRouter,
    Redirect,
    Route,
    matchPath
} from 'react-router-dom'
import {push} from "connected-react-router"
import PropTypes from 'prop-types'
import AppNav from './AppNav'
import RemoteMainFrame from './app/RemoteMainFrame'
import Icon from './icon'
import {setCurrApp} from './actions/config'
import {getAppsSelector} from './reducers/sys'
class AppFrame extends React.Component{
    static propTypes = {
        store: PropTypes.object,
    }

    static contextTypes = {
        store: PropTypes.object,
    }

    render(){
        let self= this
        const {installApps} = this.props
        return <div className="bg-app-frame bg-flex-full">
                    <div className="bg-app-frame-header">
                        <div className="bg-app-frame-header-icon">
                         <img src="/images/admin-logo.png" alt="admin logo"></img> &nbsp;<span>bg.work</span>
                        </div>
                        <div className="bg-app-frame-header-nav bg-flex-full">
                           <Route path="/app/dynamic" component={AppNav}>
                           </Route>
                        </div>
                    </div>

                    <div className="bg-app-frame-body bg-flex-full">
                        <div className="bg-app-frame-body-app-group">
                            <ul>
                                <li>
                                <Icon.AppGroup onClick={()=>{
                                    this.props.dispatch(push("/app/dynamic/worktable"))
                                    let workApp = installApps["worktable"]||{}
                                    setCurrApp(workApp)
                                }}></Icon.AppGroup>
                                </li>
                                <li>
                                <Icon.ChatApp onClick={
                                    ()=>{
                                     this.props.dispatch(push("/app/static/im"))
                                     setCurrApp({})
                                    }
                                }></Icon.ChatApp>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-app-frame-body-area  bg-flex-full">
                           <RemoteMainFrame/>
                        </div>
                    </div>
                </div>
    }
}
function mapStateToProps(state){
    let installApps = getAppsSelector(state)
    return {...installApps}
 }
export default withRouter(connect(mapStateToProps)(AppFrame))
