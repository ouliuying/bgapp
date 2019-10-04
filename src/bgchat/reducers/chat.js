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
    CHAT_SET_ACTIVE_CHANNEL_JOIN_MODEL,
    CHAT_INIT_UI_CHANNEL_JOIN_MODEL_LIST,
    CHAT_UPDATE_SEND_MESSAGE_UUID
} from '../actions/chat'
import producer from "immer"
import {createSelector} from "reselect"
import {original,isDraft} from "immer"
import BroadcaskType from '../ChannelbroadcastType'
const chatData = {
    myUUID:"",
    clientChannels:[]
}
export function chat(state,action){
    if(typeof state ==="undefined"){
        return chatData
    }
    const {type,payload} = action
    switch(type){
        case CHAT_INIT_UI_CHANNEL_LIST:
            return producer(state,draft=>{
                draft.myUUID = payload.myUUID
                payload.channelMeta.map(ch=>{
                    let clientChannel = getClientChannel(ch)
                    if(clientChannel){
                        clientChannel.newMessageCount=0
                        draft.clientChannels.push(clientChannel)
                    }
                    return clientChannel
                })
            })
        case CHAT_INIT_UI_CHANNEL_JOIN_MODEL_LIST:
            return producer(state,draft=>{
                let clientChannel =draft.clientChannels.find(x=>x.UUID == payload.channelUUID)
                if(clientChannel){
                    let joinModels = []
                    let sJoinModels = payload.joinModels||[]
                    sJoinModels.map(sJM=>{
                        let cJM = getClientChannel(sJM)
                        if(cJM){
                            joinModels.push(cJM)
                        }
                    })
                    clientChannel.joinModels=joinModels
                }
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
        case CHAT_UPDATE_SEND_MESSAGE_UUID:
            return producer(state,draft=>{
                updateSendMessageUUID(draft,payload)
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
        receiveTime:new Date(),
    }
    clientMessage =  Object.assign({
    },serverMessage,clientMessage)
    return clientMessage
}
function addReceiveMessageToChannel(draft,serverMessage){
    let clientMessage = getClientMessage(draft.clientChannels,serverMessage)
    let channelUUID = clientMessage.channelUUID
    if(channelUUID){
        let clientChannel = draft.clientChannels.find(x=>x.UUID == channelUUID)
        if(clientChannel){
            clientChannel.newMessageCount++
            if(clientChannel.broadcastType == BroadcaskType.BROADCAST){
                if(clientChannel.messageQueue){
                    clientChannel.messageQueue.push(clientMessage)
                }
                else{
                    clientChannel.messageQueue = [clientMessage]
                }
            }
            else if(clientChannel.broadcastType == BroadcaskType.P2P){
                let fromUUID = clientMessage.fromUUID
                let joinModels = clientChannel.joinModels||[]
                let joinModel = joinModels.find(x=>x.UUID == fromUUID)
                if(joinModel){
                    if(joinModel.messageQueue){
                        joinModel.messageQueue.push(clientMessage)
                    }
                    else{
                        joinModel.messageQueue=[clientMessage]
                    }
                }
            }
        }
    }
}

function addSendMessageToChannel(draft,serverMessage){
    let clientMessage = getClientMessage(draft.clientChannels,serverMessage)
    let channelUUID = clientMessage.channelUUID
    if(channelUUID){
        let clientChannel = draft.clientChannels.find(x=>x.UUID == channelUUID)
        if(clientChannel){
            if(clientChannel.broadcastType == BroadcaskType.BROADCAST){
                if(clientChannel.messageQueue){
                    clientChannel.messageQueue.push(clientMessage)
                }
                else{
                    clientChannel.messageQueue = [clientMessage]
                }
            }
            else if(clientChannel.broadcastType == BroadcaskType.P2P){
                let toUUID = clientMessage.toUUID
                let joinModels = clientChannel.joinModels||[]
                let joinModel = joinModels.find(x=>x.UUID == toUUID)
                if(joinModel){
                    if(joinModel.messageQueue){
                        joinModel.messageQueue.push(clientMessage)
                    }
                    else{
                        joinModel.messageQueue=[clientMessage]
                    }
                }
            }
        }
    }
}

function setActiveClientChannel(chatData,channelUUID){
    let channels = chatData.clientChannels||[]
    channels.map(x =>{
        x.activeFlag = false
    })
    let channel = channels.find(x=>x.UUID == channelUUID)
    if(channel){
        channel.activeFlag = true
        let joinModels = channel.joinModels||[]
        let index = joinModels.findIndex(x=>x.activeFlag == true)
        if(index<0){
            if(joinModels.length>0){
                joinModels[0].activeFlag = true
            }
        }
    }
}

function setActiveClientChannelJoinModel(chatData,joinModelUUID){
    let channels = chatData.clientChannels||[]
    let index = channels.findIndex(x=>x.activeFlag == true)
    if(index>-1){
        let clientChannel = channels[index]
        let joinModels = clientChannel.joinModels||[]
        let joinModel = joinModels.find(x=>x.UUID == joinModelUUID)
        if(joinModel){
            joinModels.map(x=>x.activeFlag=false)
            joinModel.activeFlag = true
        }
    }
}

function updateSendMessageUUID(draft,respMsg){
  let myUUID = draft.myUUID
  let channelUUID = respMsg.channelUUID
  let seq = respMsg.seq
  let uuid = respMsg.uuid
  let toUUID = respMsg.toUUID
  let clientChannel = draft.clientChannels.find(x=>x.UUID == channelUUID)
 // let messageQueue  = clientChannel.messageQueue
  let msg = findLastMessage(clientChannel,myUUID,toUUID,channelUUID,seq)
  if(msg){
      msg.UUID = uuid
  }
}

function findLastMessage(clientChannel,myUUID,toUUID,channelUUID,seq){
    let messageQueue=[]
    if(clientChannel.broadcastType == BroadcaskType.P2P){
        let joinModels = clientChannel.joinModels||[]
        let joinModel = joinModels.find(x=>x.UUID == toUUID)
        if(joinModel){
            messageQueue = joinModel.messageQueue||[]
        }
    }
    else{
        messageQueue = clientChannel.messageQueue||[]
    }
    var len = messageQueue.length
    for(let i = len-1;i>-1;i--){
        let m = messageQueue[i]
        if(m.fromUUID == myUUID && m.toUUID == toUUID && m.channelUUID == channelUUID && m.seq == seq){
            return m
        }
    }
}
function getOriginalData(draft){
    if(isDraft(draft)){
        return original(draft)
    }
    return draft
}

export const getChannels = createSelector(state=>state.chat,chat=>(chat.clientChannels))

export const getActiveChannel = createSelector(state=>state.chat,chat=>{
    let clientChannels = chat.clientChannels||[]
    return clientChannels.find(x=>x.activeFlag == true)
})

export const getActiveJoinModel = createSelector(state=>state.chat,chat=>{
    let clientChannel = chat.clientChannels.find(x=>x.actvieFlag == true)
    if(clientChannel){
       let joinModels = clientChannel.joinModels||[]
       return joinModels.find(x=>x.activeFlag == true) 
    }
})

export const getActiveChannelAndJoinModel = createSelector(state=>state.chat, chat=>{
    let clientChannels = chat.clientChannels||[]
    let activeClientChannel =  clientChannels.find(x=>x.activeFlag == true)
    if(activeClientChannel){
        let joinModels = activeClientChannel.joinModels||[]
        let activeJoinModel =  joinModels.find(x=>x.activeFlag == true)
        return {clientChannel:activeClientChannel,joinModel:activeJoinModel}
    }
    return {}
})


export const getActiveChatSessionMessages = createSelector(state=>state.chat,chat=>{
    let clientChannels = chat.clientChannels||[]
    let activeChannel =  clientChannels.find(x=>x.activeFlag == true)
    if(activeChannel){
        if(activeChannel.broadcastType == BroadcaskType.BROADCAST){
            let messageQueue = activeChannel.messageQueue||[]
            return messageQueue
        }
        else{
            let joinModels = activeChannel.joinModels||[]
            let activeJoinModel = joinModels.find(x=>x.activeFlag == true)
            if(activeJoinModel){
                let messageQueue = activeJoinModel.messageQueue||[]
                return messageQueue
            }
        }
    }
    return []
})



