import {CHAT_INIT_UI_CHANNEL_LIST,
    CHAT_ADD_UI_CHANNEL,
    CHAT_REMOVE_UI_CHANNEL,
    CHAT_UPDATE_UI_CHANNEL,
    CHAT_ADD_UI_CHANNEL_JOIN_MODEL,
    CHAT_REMOVE_UI_CHANNEL_JOIN_MODEL,
    CHAT_UPDATE_UI_CHANNEL_JOIN_MODEL,
    CHAT_MESSAGE_COMMING,
    CHAT_SEND_MESSAGE,
    CHAT_SET_ACTIVE_CHANNEL,
    CHAT_SET_ACTIVE_CHANNEL_JOIN_MODEL
} from '../actions/chat'
import producer from "immer"
import {createSelector} from "reselect"
const chatData = {
    clientChannels:[],
    activeClientChannel:{
        activeJoinModel:null,
        clientChannel:null,
    }
}
export function chat(state,action){
    if(typeof state ==="undefined"){
        return chatData
    }
    const {type,payload} = action
    switch(type){
        case CHAT_INIT_UI_CHANNEL_LIST:
            return producer(state,draft=>{
                payload.map(ch=>{
                    let clientChannel = getClientChannel(ch)
                    if(clientChannel){
                        draft.clientChannels.push(clientChannel)
                    }
                    return clientChannel
                })
            })
        case CHAT_ADD_UI_CHANNEL:
            return producer(state,draft=>{
                let clientChannel = getClientChannel(payload)
                if(clientChannel){
                   draft.clientChannels.unshift(clientChannel)
                }
            })
        case CHAT_REMOVE_UI_CHANNEL:
            return producer(state,draft=>{
                let channelTag = payload
                let index = draft.clientChannels.findIndex(x=>{
                    return x.tag == channelTag
                })
                if(index>-1){
                    draft.clientChannels.slice(index,1)
                }
            })
        case CHAT_UPDATE_UI_CHANNEL:
            return producer(state,draft=>{
                let channelTag = payload.tag
                let index = draft.clientChannels.findIndex(x=>{
                    return x.tag == channelTag
                })
                updateClientChannel(draft.clientChannels,index,payload)
            })
        case CHAT_ADD_UI_CHANNEL_JOIN_MODEL:
            return producer(state,draft=>{
                let channelTag = payload.channelTag
                addClientJoinModelToChannel(draft.clientChannels,channelTag,payload.joinModel)
            })
        case CHAT_REMOVE_UI_CHANNEL_JOIN_MODEL:
                return producer(state,draft=>{
                   removeJoinModelFromChannel(draft,payload.channelTag,payload.joinModelTag)
                })
        case CHAT_UPDATE_UI_CHANNEL_JOIN_MODEL:
                return producer(state,draft=>{
                    let channelTag = payload.channelTag
                    updateChannelJoinModel(draft,channelTag,payload.joinModel)
                })
        case CHAT_MESSAGE_COMMING:
                return producer(state,draft=>{
                    addReceiveMessageToChannel(draft,payload)
                })
        case CHAT_SEND_MESSAGE:
                return producer(state,draft=>{
                    addSendMessageToChannel(draft,payload)
                })
        case CHAT_SET_ACTIVE_CHANNEL:
                return producer(state,draft=>{
                    setActiveClientChannel(draft,payload)
                })
        case CHAT_SET_ACTIVE_CHANNEL_JOIN_MODEL:
                return producer(state,draft=>{
                    setActiveClientChannelJoinModel(draft,payload)
                })  
        default:
            return state
    }
}

function getClientChannel(serverChannel){

}
function getClientJoinModel(serverJoinModel){

}
function updateChannelJoinModel(clientChannels,channelTag,serverJoinModel){

}
function updateClientChannel(clientChannels,index,serverChannel){

}
function addClientJoinModelToChannel(clientChannels,channelTag,serverJoinModel){

}
function removeJoinModelFromChannel(clientChannels,channelTag,joinModelTag){

}
function getClientMessage(clientChannels,serverMessage){

}
function addReceiveMessageToChannel(clientChannels,serverMessage){
    let clientMessage = getClientMessage(clientChannels,serverMessage)
}

function addSendMessageToChannel(clientChannels,serverMessage){
    let clientMessage = getClientMessage(clientChannels,serverMessage)
}

function setActiveClientChannel(chatData,channelTag){

}
function setActiveClientChannelJoinModel(chatData,joinModelTag){

}

export const getChannels = createSelector(state=>state.chat,chat=>(chat.clientChannels))
export const getActiveChannel = createSelector(state=>state.chat,chat=>(chat.activeClientChannel.clientChannel))
export const getActiveJoinModel = createSelector(state=>state.chat,chat=>(chat.activeClientChannel && chat.activeClientChannel.activeJoinModel))



