import React from 'react'
import {connect} from 'react-redux'
import {
    withRouter,
    Switch,
    Route
} from 'react-router-dom'
class DetailView extends React.Component{
    render(){
        return <div>
            DefaultCreateView
        </div>
    }
}
function mapStateToProps(state){
    return state
}
export default withRouter(connect(mapStateToProps)(DetailView))