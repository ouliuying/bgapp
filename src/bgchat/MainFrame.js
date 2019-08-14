import React from "react"
import {connect} from 'react-redux'
import {
    withRouter,
    Redirect,
    Route,
    matchPath
} from 'react-router-dom'
import {Icon,Input,Button} from '../ui'
import { getSvg } from "../svg";
class MainFrame extends React.Component{
 
    render(){
        const ChannelLogo = getSvg("/svg/chat-channel-logo.svg")
        const ChannelOpMore = getSvg("/svg/chat-channel-op-more.svg")
        const channelMembers = getSvg("/svg/chat-channel-members.svg")
        const channelEntity = getSvg("/svg/chat-channel-ent.svg")
        return <div className="bg-chat-main-frame bg-flex-full">
           
            <div className="bg-chat_channel-members-area">
                <div className="bg-chat-channel-bar">
                    <div className="bg-chat-channel-header">
                    <Icon component={ChannelLogo} />频道 <Icon component={ChannelOpMore} style={{float:"right",marginTop:4,cursor:"pointer"}} />
                    </div>
                    <div className="bg-chat-channel-body">
                        <ul className="bg-chat-channel-body-channel-container">
                            <li className="bg-chat-channel-body-channel-item">
                               <Icon component={channelEntity} style={{marginRight:5}}></Icon>公司所有成员
                            </li>
                            <li className="bg-chat-channel-body-channel-item">
                                <Icon component={channelEntity} style={{marginRight:5}}></Icon>财务部
                            </li>
                            <li className="bg-chat-channel-body-channel-item">
                                <Icon component={channelEntity} style={{marginRight:5}}></Icon>人事部
                            </li>
                            <li className="bg-chat-channel-body-channel-item">
                                <Icon component={channelEntity} style={{marginRight:5}}></Icon>客服部
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="bg-chat-channel-members-bar">
                    <div className="bg-chat-channel-header">
                      <Input prefix={<Icon component={channelMembers} style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="频道成员"  suffix={
                          <Icon type="search" style={{cursor:"pointer"}}></Icon>
                      }/>
                    </div>
                    <div className="bg-chat-channel-body">
                        <ul className="bg-chat-channel-members-container">
                            <li className="bg-chat-channel-members-channel-item">
                            <div className="bg-chat-channel-members-item-icon">
                                    <img src="/images/Avatar.jpg" alt=""/>
                                </div>
                                <div className="bg-chat-channel-members-item-userinfo">
                                    <div className="bg-chat-channel-members-item-userinfo-nickname">
                                        Nickname
                                    </div>
                                    <p className="bg-chat-channel-members-item-userinfo-title">
                                         title information
                                    </p>
                                </div>
                            </li>
                            <li className="bg-chat-channel-members-channel-item">
                                <div className="bg-chat-channel-members-item-icon">
                                    <img src="/images/Avatar.jpg" alt=""/>
                                </div>
                                <div className="bg-chat-channel-members-item-userinfo">
                                    <div className="bg-chat-channel-members-item-userinfo-nickname">
                                        Nickname
                                    </div>
                                    <p className="bg-chat-channel-members-item-userinfo-title">
                                         title information
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
         
           
            <div className="bg-chat-channel-message-window bg-flex-full">
                <div className="bg-chat-channel-header">
                 
                    <img src="/images/Avatar.jpg" alt="" className="bg-channel-icon"/>
               
                    <span className="bg-channel-name">财务部></span>
                    <span className="bg-channel-member-nickname">对象昵称></span>
                    <span className="bg-channel-member-status">正在交流</span>
                </div>

                <div className="bg-chat-channel-message-window-body">

                </div>

                <div className="bg-chat-channel-message-window-input">
                      <Input.TextArea className="bg-chat-channel-message-window-input-area">
                          
                      </Input.TextArea>
                      <div className="bg-chat-channel-message-window-input-actions">
                          <Button type="primary">发送</Button>
                      </div>
                </div>
            </div>
        </div>
    }
}

function mapStateToProps(state){
    return state
 }
export default withRouter(connect(mapStateToProps)(MainFrame))