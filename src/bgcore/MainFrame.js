import React from "react"
import {connect} from 'react-redux'
import {ReducerRegistry} from '../ReducerRegistry'
import {core} from './reducers/core'
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
        return <div>MainFrame</div>
    }
}
function mapStateToProps(state){
    return state
 }

 //ReducerRegistry.Add({core})
export default withRouter(connect(mapStateToProps)(MainFrame))