import React from "react"
export class TextMessageItem extends React.Component{
 render(){
     const {msgBody,isMe,model} = this.props
     const date = new Date(msgBody.timestamp)
     return <div className ="bg-chat-channel-message">
               {
                  isMe? <><div className="msg-container-me">
                              <div className="msg-header">
                                 <img src="/images/Avatar.jpg" alt=""></img>
                                 <span>{model.nickName}</span>
                                 <span>{date.toLocaleString()}</span>
                              </div>
                              <div className="msg-body">
                                 <span className="msg-body-content">
                                    {msgBody.content}
                                 </span>
                                   
                              </div>
                              <div className="msg-footer">

                              </div>
                           </div>

                           <div className="msg-comment">

                           </div>
                     </>:<><div className="msg-container-other">
                              <div className="msg-header">
                                 <img src="/images/Avatar.jpg" alt=""></img>
                                 <span>{model.nickName}</span>
                                 <span>{date.toLocaleString()}</span>
                              </div>
                              <div className="msg-body">
                                 <span className="msg-body-content">
                                       {msgBody.content}
                                    </span>
                              </div>
                              <div className="msg-footer">

                              </div>
                           </div>

                           <div className="msg-comment">

                           </div>
                        </>
               }
             </div>
 }
}