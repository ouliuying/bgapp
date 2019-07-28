import React from 'react'
import {connect} from 'react-redux'
import {
    withRouter,
    Redirect,
    Route,
    matchPath
} from 'react-router-dom'
import {Descriptions} from '../ui'
import hookView from '../app/HookView'

class ImportSendSmsView extends React.Component{
    render(){
        return <div>y</div>
    }
}
function mapStateToProps(state,ownProps){
    return {}
}
export default hookView.withHook(withRouter(connect(mapStateToProps)(ImportSendSmsView)))

