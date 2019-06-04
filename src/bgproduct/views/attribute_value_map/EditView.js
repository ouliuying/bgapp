
import React from 'react'
import {connect} from 'react-redux'
import {
    withRouter,
    Redirect,
    Route,
    matchPath
} from 'react-router-dom'

import EditView from '../../../app/modelView/EditView'
import hookView from '../../../app/HookView'
import {mapStateToProps} from './editViewStateToProps'
class AttirbuteValueMapEditView extends React.Component{
    render(){
        const {overrideRender:parentOverrideRender,...rest}=this.props
        return  <EditView {...rest} overrideRender={(hookTag,props)=>
           {
               switch(hookTag){

                   default:
                   return null
               }
           }
        }></EditView>
        
    }
}

export default hookView.withHook(withRouter(connect(mapStateToProps)(AttirbuteValueMapEditView)))