import React from "react"
import {connect} from 'react-redux'
import {
    withRouter,
    Redirect,
    Route,
    matchPath
} from 'react-router-dom'
class MainFrame extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return <div>Chat MainFrame</div>
    }
}
function mapStateToProps(state){
    return state
 }
export default withRouter(connect(mapStateToProps)(MainFrame))