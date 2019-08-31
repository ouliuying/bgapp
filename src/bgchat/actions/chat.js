import { ReducerRegistry } from "../../ReducerRegistry";
import { MessageBus } from "../../mb/MessageBus";
import { SEND_MESSAGE_TO_SERVER_TOPIC, MESSAGE_COMMING_TOPIC, INIT_CHANNEL_LIST_UI, INIT_CHANNEL_JOIN_MODEL_LIST_UI, 
    SET_ACTIVE_CHANNEL, 
    SET_ACTIVE_CHANNEL_ACTIVE_JOIN_MODEL} from "../core/Chat";
import { MessageApi } from "../MessageApi";
import {original,isDraft} from "immer"
export const CHAT_INIT_UI_CHANNEL_LIST = "chat::init_ui_channel_list"
export const CHAT_INIT_UI_CHANNEL_JOIN_MODEL_LIST = "chat::init_ui_channel_join_model_list"
export const CHAT_ADD_UI_CHANNEL = "chat::add_ui_channel"
export const CHAT_REMOVE_UI_CHANNEL = "chat::remove_ui_channel"
export const CHAT_UPDATE_UI_CHANNEL  = "chat::update_ui_channel"
export const CHAT_ADD_UI_CHANNEL_JOIN_MODEL = "chat::add_ui_channel_join_model"
export const CHAT_REMOVE_UI_CHANNEL_JOIN_MODEL = "chat::remove_ui_channel_join_model"
export const CHAT_UPDATE_UI_CHANNEL_JOIN_MODEL = "chat::update_ui_channel_join_model"
export const CHAT_MESSAGE_COMMING = "chat::message_comming"
export const CHAT_SEND_MESSAGE = "chat::send_message"
export const CHAT_SET_ACTIVE_CHANNEL = "chat::set_active_channel"
export const CHAT_SET_ACTIVE_CHANNEL_JOIN_MODEL = "chat::set_active_channel_join_model"
export const CHAT_UPDATE_SEND_MESSAGE_UUID = "chat::update_send_message_uuid"
function dispatchAction(type,data){
    let action = {
        payload:data,
        type:type
    }
    ReducerRegistry.Store.dispatch(action)
}

export function initUIChannelList(channelMeta){
    dispatchAction(CHAT_INIT_UI_CHANNEL_LIST,channelMeta)
}

export function initUIChannelJoinModelList(channelUUID,joinModels){
    dispatchAction(CHAT_INIT_UI_CHANNEL_JOIN_MODEL_LIST,{
        channelUUID,
        joinModels
    })
}

MessageBus.ref.consume(INIT_CHANNEL_LIST_UI,channelMeta=>{
    initUIChannelList(channelMeta)
})
MessageBus.ref.consume(INIT_CHANNEL_JOIN_MODEL_LIST_UI,channelJoinModels=>{
    initUIChannelJoinModelList(channelJoinModels.channelUUID,channelJoinModels.joinModels)
})
MessageBus.ref.consume(SEND_MESSAGE_TO_SERVER_TOPIC,(msg)=>{
    dispatchAction(CHAT_SEND_MESSAGE,msg)
})

MessageBus.ref.consume(MESSAGE_COMMING_TOPIC,msg=>{
    if(MessageApi.isUUIDResponse(msg)){
        dispatchAction(CHAT_UPDATE_SEND_MESSAGE_UUID,msg)
        return
    }
    dispatchAction(CHAT_MESSAGE_COMMING,msg)
})

MessageBus.ref.consume(SET_ACTIVE_CHANNEL,ch=>{
    dispatchAction(CHAT_SET_ACTIVE_CHANNEL,ch.UUID)
})

MessageBus.ref.consume(SET_ACTIVE_CHANNEL_ACTIVE_JOIN_MODEL,joinModel=>{
    dispatchAction(CHAT_SET_ACTIVE_CHANNEL_JOIN_MODEL,(joinModel||{}).UUID)
})

