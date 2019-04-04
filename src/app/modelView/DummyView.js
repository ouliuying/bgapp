import React from 'react'
import {connect} from 'react-redux'
import {
    withRouter,
    Switch,
    Route
} from 'react-router-dom'
class DummyView extends React.Component{
    render(){
        return <div>
            Missing Model View
        </div>
    }
}
function mapStateToProps(state){
    return state
}
export default withRouter(connect(mapStateToProps)(DummyView))