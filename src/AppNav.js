import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    withRouter
} from 'react-router-dom'
import {push} from "connected-react-router"
import {getShortcutAppsSelector} from './reducers/sys'
import Icon from './icon'
import {createIconFromSvg} from './icon/createIconFromSvg'
import {setCurrApp} from './actions/config'
import {getCurrentApp} from './reducers/config'
export class AppNav extends Component {
    static propTypes = {
        store: PropTypes.object,
    }

    static contextTypes = {
        store: PropTypes.object,
    }
    render() {
        let self =this
        return <div className="bg-app-nav-button-bar">
            {
                self.props.shortcutApps.map(sApp=>{
                    const AppIcon=createIconFromSvg({
                        src:sApp.icon,
                        svgStyle:{width:22,height:22,fill:'#bfcbd9'}
                    })
                    let active=(self.props.currApp.name == sApp.name)?" active":""
                    return (<a className={"bg-app-shortcut-action-btn"+active} onClick={()=>{
                        setCurrApp({currApp:sApp})
                        self.props.dispatch(push(`/app/dynamic/${sApp.name}`))}
                        } key={sApp.name}>
                            <AppIcon></AppIcon><span className="bg-app-shortcut-action-btn-title"> {sApp.title}</span>
                    </a>)
                })
            }
            
            <a className="bg-app-shortcut-action-btn">
            <Icon.AddRmApp></Icon.AddRmApp>
            </a>

         
        </div>
        
    }
}
function mapState(state){
    let currApp = getCurrentApp(state)
    return {shortcutApps:getShortcutAppsSelector(state),...currApp}
}
export default withRouter(connect(mapState)(AppNav))
