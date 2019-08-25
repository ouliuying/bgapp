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
                let channelUUID = payload
                let index = draft.clientChannels.findIndex(x=>{
                    return x.tag == channelUUID
                })
                if(index>-1){
                    draft.clientChannels.splice(index,1)
                }
            })
        case CHAT_UPDATE_UI_CHANNEL:
            return producer(state,draft=>{
                updateClientChannel(draft.clientChannels,payload)
            })
        case CHAT_ADD_UI_CHANNEL_JOIN_MODEL:
            return producer(state,draft=>{
                let channelUUID = payload.UUID
                addClientJoinModelToChannel(draft.clientChannels,channelUUID,payload.joinModel)
            })
        case CHAT_REMOVE_UI_CHANNEL_JOIN_MODEL:
                return producer(state,draft=>{
                   removeJoinModelFromChannel(draft,payload.UUID,payload.joinModelUUID)
                })
        case CHAT_UPDATE_UI_CHANNEL_JOIN_MODEL:
                return producer(state,draft=>{
                    let channelUUID = payload.channelUUID
                    updateChannelJoinModel(draft,channelUUID,payload.joinModel)
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
    let clientChannel =  Object.assign({},serverChannel)
    clientChannel.UUID = serverChannel.uuid
    delete clientChannel.uuid
    return clientChannel
}
function getClientJoinModel(serverJoinModel){

    let clientJoinModel = Object.assign({},serverJoinModel)
    clientJoinModel.UUID = serverJoinModel.uuid
    delete clientJoinModel.uuid
    return clientJoinModel
}
function updateChannelJoinModel(clientChannels,channelUUID,serverJoinModel){
    let index = clientChannels.findIndex(x=>x.UUID==channelUUID)
    if(index>-1){
        let clientJoinModelIndex = (clientChannels[index].joinModels||[]).findIndex(x=>x.UUID == serverJoinModel.uuid)
        let updateClientJoinModel = getClientJoinModel(serverJoinModel)
        if(clientJoinModelIndex>-1){
            if(updateClientJoinModel){
                let oldJoinModel = clientChannels[index].joinModels[clientJoinModelIndex]
                clientChannels[index].joinModels[clientJoinModelIndex] = Object.assign({},oldJoinModel,updateClientJoinModel)
            }
        }
        else{
            if(clientChannels[index].joinModels){
                clientChannels[index].joinModels.unshift(updateClientJoinModel)
            }
            else{
                clientChannels[index].joinModels=[updateClientJoinModel]
            }
        }
    }
}
function updateClientChannel(clientChannels,serverChannel){
    let index = clientChannels.findIndex(x=>x.UUID==serverChannel.uuid)
    let clientChannel = getClientChannel(serverChannel)
    if(clientChannel){
        if(index>-1){
            let oldChannel = clientChannels[index]
            clientChannels[index] = Object.assign({},oldChannel,clientChannel)
        }
        else{
            clientChannels.unshift(clientChannel)
        }
    }
}

function addClientJoinModelToChannel(clientChannels,channelUUID,serverJoinModel){
    let index = clientChannels.findIndex(x=>x.UUID==channelUUID)
    if(index>-1){
        let clientJoinModelIndex = (clientChannels[index].joinModels||[]).findIndex(x=>x.UUID == serverJoinModel.uuid)
        if(clientJoinModelIndex<0){
            let addClientJoinModel = getClientJoinModel(serverJoinModel)
            if(clientChannels[index].joinModels){
                clientChannels[index].joinModels.unshift(addClientJoinModel)
            }
            else{
                clientChannels[index].joinModels=[addClientJoinModel]
            }
        }
    }
}

function removeJoinModelFromChannel(clientChannels,channelUUID,joinModelUUID){
    let index = clientChannels.findIndex(x=>x.UUID==channelUUID)
    if(index>-1){
        let clientJoinModelIndex = (clientChannels[index].joinModels||[]).findIndex(x=>x.UUID == joinModelUUID)
        if(clientJoinModelIndex>-1){
            clientChannels[index].joinModels.splice(clientJoinModelIndex,1)
        }
    }
}
function getClientMessage(clientChannels,serverMessage){
    let clientMessage={}
    clientMessage["__client__"]={
        receiveTime:Date(),
    }
    clientMessage =  Object.assign({
    },serverMessage,clientMessage)
}
function addReceiveMessageToChannel(clientChannels,serverMessage){
    let clientMessage = getClientMessage(clientChannels,serverMessage)
    let channelUUID = clientMessage.channelUUID
    if(channelUUID){
        let clientChannel = clientChannels.find(x=>x.UUID == channelUUID)
        if(clientChannel){
            if(clientChannel.messageQueue){
                clientChannel.messageQueue.push(clientMessage)
            }
            else{
                clientChannel.messageQueue = [clientMessage]
            }
        }
    }
}

function addSendMessageToChannel(clientChannels,serverMessage){
    let clientMessage = getClientMessage(clientChannels,serverMessage)
    let channelUUID = clientMessage.channelUUID
    if(channelUUID){
        let clientChannel = clientChannels.find(x=>x.UUID == channelUUID)
        if(clientChannel){
            if(clientChannel.messageQueue){
                clientChannel.messageQueue.push(clientMessage)
            }
            else{
                clientChannel.messageQueue = [clientMessage]
            }
        }
    }
}

function setActiveClientChannel(chatData,channelUUID){
    let channel = chatData.clientChannels.find(x=>x.UUID == channelUUID)
    if(channel){
        chatData.activeClientChannel.clientChannel = channel
    }
}
function setActiveClientChannelJoinModel(chatData,joinModelUUID){
    let clientChannel = chatData.activeClientChannel.clientChannel
    if(clientChannel){
        let joinModel = clientChannel.joinModels.find(x=>x.UUID == joinModelUUID)
        if(joinModel){
            chatData.activeClientChannel.activeJoinModel = joinModel
        }
    }
}

export const getChannels = createSelector(state=>state.chat,chat=>(chat.clientChannels))
export const getActiveChannel = createSelector(state=>state.chat,chat=>(chat.activeClientChannel.clientChannel))
export const getActiveJoinModel = createSelector(state=>state.chat,chat=>(chat.activeClientChannel && chat.activeClientChannel.activeJoinModel))
export const getActiveChatSessionMessages = createSelector(state=>state.chat.activeClientChannel,activeClientChannel=>{
    const {clientChannel,activeJoinModel} = activeClientChannel
    const messageQueue = (clientChannel||{}).messageQueue
    if(messageQueue && activeJoinModel){
        if(clientChannel.broadcastType==1){
            return messageQueue
        }
        else{
            return messageQueue.filter(x=>x.fromUUID == activeJoinModel.UUID || x.toUUID == activeJoinModel.UUID)
        }
    }
    else{
        return []
    }
})



