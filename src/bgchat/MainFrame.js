import React from "react"
import {connect} from 'react-redux'
import {
    withRouter,
    Redirect,
    Route,
    matchPath
} from 'react-router-dom'
import {Icon,Input,Button,Menu,Dropdown} from '../ui'
import { getSvg } from "../svg"
import { ReducerRegistry } from "../ReducerRegistry";
import { push } from "connected-react-router";
import { getChannels, getActiveChatSessionMessages, getActiveChannelAndJoinModel } from "./reducers/chat";
import { getCurrChatUUID } from "../reducers/partner";
import { MessageBus } from "../mb/MessageBus";
import { MessageApi } from "./MessageApi";
import { TextMessageItem } from "./messageItem/TextMessageItem";
import { TXT_MESSAGE, RECEIVE_MESSAGE_RESPONSE_SUCCESS_TYPE } from "./msgType";
import { WEB_TYPE } from "./devType";
import { SET_ACTIVE_CHANNEL, SET_ACTIVE_CHANNEL_ACTIVE_JOIN_MODEL } from "./core/Chat";
import ChannelbroadcastType from "./ChannelbroadcastType"

function  ChannelMenu(props){
    return <Menu theme="dark" onClick={(itemData)=>{
        let key = itemData.key
        const {store}=ReducerRegistry
        switch(key){
            case "join_channel":
                    store.dispatch(push("/app/dynamic/chat/chatChannel/list"))
                break
            case "add_channel":
                    store.dispatch(push("/app/dynamic/chat/chatChannel/create"))
                break
            case "channel_message_list":
                    store.dispatch(push("/app/dynamic/chat/chatChannelMessage/list"))
                break
            default:
                break
        }
    }}>
      <Menu.Item key="join_channel">
        <span>加入频道</span>
      </Menu.Item>
      <Menu.Item key="add_channel">
        <span>添加频道</span>
      </Menu.Item>
      <Menu.Item key="channel_message_list">
        <span>通讯日志</span>
      </Menu.Item>
    </Menu>
}
 


class MainFrame extends React.Component{
    constructor(props){
        super(props)
        this.state={
            message:""
        }
        this.mainFrame = React.createRef()
        this.messageWindow = React.createRef()
    }
    sendMessage(message){
        const {activeChannel,activeJoinModel,myUUID} = this.props
        message.fromUUID = myUUID
        if(activeChannel && activeChannel.broadcastType == ChannelbroadcastType.P2P){
            message.toUUID = (activeJoinModel||{}).UUID
        }
        else{
            message.toUUID=""
        }
        message.channelUUID = (activeChannel||{}).UUID
        message.fromDevType = WEB_TYPE
        MessageApi.send(message)
        this.setState({
            message:""
        })
    }
    componentDidMount(){
        this.windowSizeUpdate()
    }
    componentWillUnmount(){
         window.removeEventListener("resize", ()=>{this.windowSizeUpdate()});
     }
     componentWillMount(){
        this.windowSizeUpdate();
     }
     componentDidUpdate(){
        let lasChild =  this.messageWindow.current.lastChild
        if(lasChild){
            lasChild.scrollIntoView({
                behavior:"smooth"
            })
        }
     }
     windowSizeUpdate(){
         try
         {
             var w = window,
             d = document,
             documentElement = d.documentElement,
             body = d.getElementsByTagName('body')[0],
             width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
             height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight;
            // this.setState({width: width, height: height});
            this.mainFrame.current.style=`height:${height-63}px;`
            this.messageWindow.current.style=`height:${height-180};overflow:auto;`
         }
         catch(err){
 
         }
     }
    render(){
        const self =this
        const ChannelLogo = getSvg("/svg/chat-channel-logo.svg")
        const ChannelOpMore = getSvg("/svg/chat-channel-op-more.svg")
        const channelMembers = getSvg("/svg/chat-channel-members.svg")
        const channelEntity = getSvg("/svg/chat-channel-ent.svg")

        const {channels,activeChannel,activeJoinModel,messageQueue,myUUID} = self.props
        const activeChannelJoinModels = (activeChannel||{}).joinModels||[]
        return <div className="bg-chat-main-frame bg-flex-full" ref={this.mainFrame}>
           
            <div className="bg-chat_channel-members-area">
                <div className="bg-chat-channel-bar">
                    <div className="bg-chat-channel-header">
                    <Icon component={ChannelLogo} />频道 

                    <Dropdown overlay={ChannelMenu} placement="bottomLeft">
                         <Icon component={ChannelOpMore}   style={{float:"right",marginTop:4,cursor:"pointer"}} />
                    </Dropdown>

                    </div>
                    <div className="bg-chat-channel-body">
                        <ul className="bg-chat-channel-body-channel-container">
                            {
                                (channels||[]).map(ch=>{
                                    let className = "bg-chat-channel-body-channel-item"
                                    if(ch.UUID == (activeChannel||{}).UUID){
                                        className = "bg-chat-channel-body-channel-item active"
                                    }
                                    return  <li className={className} onClick={()=>{
                                        MessageBus.ref.send(SET_ACTIVE_CHANNEL,ch)
                                    }} key={ch.UUID}>
                                                <Icon component={channelEntity} style={{marginRight:5}}></Icon>{ch.name}
                                           </li> 
                                })
                            }
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
                            {
                                activeChannelJoinModels.map(jm=>{
                                    let icon = "/storage/file/"+jm.icon
                                    let liClassName = jm.activeFlag?"bg-chat-channel-members-channel-item active":"bg-chat-channel-members-channel-item"
                                    return  <li className={liClassName} onClick={()=>{
                                        MessageBus.ref.send(SET_ACTIVE_CHANNEL_ACTIVE_JOIN_MODEL,jm)
                                    }} key={jm.UUID}>
                                                    <div className="bg-chat-channel-members-item-icon">
                                                        <img src={icon} alt=""/>
                                                    </div>
                                                    <div className="bg-chat-channel-members-item-userinfo">
                                                        <div className="bg-chat-channel-members-item-userinfo-nickname">
                                                           {jm.nickName}
                                                        </div>
                                                        <p className="bg-chat-channel-members-item-userinfo-title">
                                                            {jm.title}
                                                        </p>
                                                    </div>
                                            </li>
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
         
           
            <div className="bg-chat-channel-message-window bg-flex-full">
                <div className="bg-chat-channel-header">
                    {
                        activeChannel && activeJoinModel && <>
                        <img src={"/storage/file/"+activeJoinModel.icon} alt="" className="bg-channel-icon"/>
                        <span className="bg-channel-name">{activeChannel.name} > </span>
                        <span className="bg-channel-member-nickname">{activeJoinModel.nickName}</span>
                        </>
                    }
                </div>

                <div className="bg-chat-channel-message-window-body"  ref={this.messageWindow}>
                    {
                        messageQueue.map(msg=>{
                            let isMe = msg.fromUUID == myUUID
                            let joinModel = activeChannel.joinModels.find(x=>x.UUID == msg.fromUUID)
                            if(msg.type == TXT_MESSAGE){
                                return <TextMessageItem isMe={isMe} msgBody={msg} model= {joinModel||{}}></TextMessageItem>
                            }
                            else{
                                return <div>undefined</div>
                            }
                        })
                    }
                </div>

                <div className="bg-chat-channel-message-window-input">
                      <Input.TextArea className="bg-chat-channel-message-window-input-area" placeholder="输入要发送的内容..." value={this.state.message} onChange={(evt)=>{
                          self.setState({
                              message:evt.target.value
                          })
                      }}></Input.TextArea>
                      <div className="bg-chat-channel-message-window-input-actions">
                          <Button type="primary" onClick={()=>{
                              if(self.state.message){
                                  let msg = {
                                      type:TXT_MESSAGE,
                                      content:self.state.message,
                                      responseType:RECEIVE_MESSAGE_RESPONSE_SUCCESS_TYPE,
                                      timestamp:new Date().getTime()
                                  }
                                 self.sendMessage(msg)
                              }
                          }}>发送</Button>
                      </div>
                </div>
            </div>
        </div>
    }
}

function mapStateToProps(state){
    let channels = getChannels(state)
    let cj = getActiveChannelAndJoinModel(state)
    let activeChannel=cj.clientChannel
    let activeJoinModel=cj.joinModel
    let messageQueue = getActiveChatSessionMessages(state)
    let myUUID = getCurrChatUUID(state)
    return {channels,activeChannel,activeJoinModel,messageQueue,myUUID}
 }
export default withRouter(connect(mapStateToProps)(MainFrame))