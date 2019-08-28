import React from "react"
export class TextMessageItem extends React.Component{
 rener(){
     const {msgBody,isMe} = this.props
    return isMe?<div className ="bg-chat-channel-message-from-me">
       {msgBody.content}
    </div>:<div className="bg-chat-channel-message-from-other">
       {msgBody.content}
    </div>
 }
}