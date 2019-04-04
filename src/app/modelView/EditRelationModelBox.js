import React from 'react'
import {connect} from 'react-redux'
import {
    withRouter,
    Switch,
    Route
} from 'react-router-dom'
class EditRelationModelBox extends React.Component{
    render(){
        return <div></div>
    }
}
function mapStateToProps(state){
    return
}
export default withRouter(connect(mapStateToProps)(EditRelationModelBox))
