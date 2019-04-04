import React from 'react'
import {
    withRouter,
    Redirect,
    Route,
    matchPath
} from 'react-router-dom'

import PropTypes from 'prop-types'



import {req,HTTP_GET} from './lib/http-helper'
import {connect} from 'react-redux'
class LoadingFromServer extends React.Component{
    static propTypes = {
        store: PropTypes.object,
    }

    static contextTypes = {
        store: PropTypes.object,
    }
    componentDidMount(){
        var dispatch=this.store.dispatch;
        req("/ac/bgworkcore/partner/getme",{},{
            method:HTTP_GET,
        },function(data){
          
        })
    }
    render(){
        return <div>Now,Loading data From BgServer!</div>
    }
}
export default withRouter(connect(state=>state)(LoadingFromServer))

