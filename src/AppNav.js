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
export class AppNav extends Component {
    static propTypes = {
        store: PropTypes.object,
    }

    static contextTypes = {
        store: PropTypes.object,
    }
    render() {
        return (
        
        <div className="bg-app-nav-button-bar">
            {
                this.props.shortcutApps.map(sApp=>{
                    const AppIcon=createIconFromSvg({
                        src:sApp.icon,
                        svgStyle:{width:22,height:22,fill:'#bfcbd9'}
                    })

                    return (<a className="bg-app-shortcut-action-btn" onClick={()=>{
                        setCurrApp({currApp:sApp})
                        this.props.dispatch(push(`/app/dynamic/${sApp.name}`))}
                        } key={sApp.name}>
                            <AppIcon></AppIcon><span> {sApp.title}</span>
                    </a>)
                })
            }
            
            <a className="bg-app-shortcut-action-btn">
            <Icon.AddRmApp></Icon.AddRmApp>
            </a>

         
        </div>
        )
    }
}
function mapState(state){
    return {shortcutApps:getShortcutAppsSelector(state)}
}
export default withRouter(connect(mapState)(AppNav))
