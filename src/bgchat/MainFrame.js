import React from "react"
import {connect} from 'react-redux'
import {
    withRouter,
    Redirect,
    Route,
    matchPath
} from 'react-router-dom'
class MainFrame extends React.Component{
    render(){
        return <div className="bg-chat-main-frame">
            <div className="bg-chat-channel-bar">
                channel bar
            </div>
            <div className="bg-chat-channel-members-bar">
                members bar
            </div>
           
            <div className="bg-chat-channel-message-window">
                message box
            </div>
            
            <div className="bg-chat-channel-active-session-bar">
                active member sessions
            </div>
        </div>
    }
}

function mapStateToProps(state){
    return state
 }
export default withRouter(connect(mapStateToProps)(MainFrame))