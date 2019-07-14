import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
    withRouter
} from 'react-router-dom'
import {push} from "connected-react-router"
import {getShortcutAppsSelector} from './reducers/sys'
//import Icon from './icon'
import {createIconFromSvg} from './icon/createIconFromSvg'
import {setCurrApp} from './actions/config'
import {getCurrentApp} from './reducers/config'
import AppSetting from './AppSetting'
import { ModalSheetManager } from './app/modelView/ModalSheetManager';
import { getSvg } from './svg';
import {Icon} from './ui'
export class AppNav extends Component {
    static propTypes = {
        store: PropTypes.object,
    }

    static contextTypes = {
        store: PropTypes.object,
    }
    showAppSetting(){
        ModalSheetManager.openModal(AppSetting,{})
    }
    render() {
        let self =this
        let MoreApp=getSvg("/svg/more-app.svg")
        return <div className="bg-app-nav-button-bar">
            {
                self.props.shortcutApps.map(sApp=>{
                    const AppIcon=getSvg(sApp.icon)
                    let active=(self.props.currApp.name == sApp.name)?" active":""
                    return (<a className={"bg-app-shortcut-action-btn"+active} onClick={()=>{
                        setCurrApp(sApp)
                        self.props.dispatch(push(`/app/dynamic/${sApp.name}`))}
                        } key={sApp.name}>
                            <Icon component={AppIcon}></Icon><span className="bg-app-shortcut-action-btn-title"> {sApp.title}</span>
                    </a>)
                })
            }
            
            <a className="bg-app-shortcut-action-btn" onClick={()=>{
                self.showAppSetting()
            }}>
               <Icon component={MoreApp}/>
            </a>

         
        </div>
        
    }
}
function mapState(state){
    let currApp = getCurrentApp(state)
    return {shortcutApps:getShortcutAppsSelector(state),...currApp}
}
export default withRouter(connect(mapState)(AppNav))
