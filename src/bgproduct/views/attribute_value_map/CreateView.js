
import React from 'react'
import {connect} from 'react-redux'
import {
    withRouter,
    Redirect,
    Route,
    matchPath
} from 'react-router-dom'

import CreateView from '../../../app/modelView/CreateView'
import hookView from '../../../app/HookView'
import {mapStateToProps} from './createViewStateToProps'
class AttirbuteValueMapCreateView extends React.Component{
    render(){
        const {overrideRender:parentOverrideRender,...rest}=this.props
        return  <CreateView {...rest} overrideRender={(hookTag,props)=>
           {
               switch(hookTag){

                   default:
                   return null
               }
           }
        }></CreateView>
        
    }
}
export default hookView.withHook(withRouter(connect(mapStateToProps)(AttirbuteValueMapCreateView)))

