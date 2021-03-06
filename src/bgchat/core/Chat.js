import EventBus from 'vertx3-eventbus-client'
import { MessageBus } from '../../mb/MessageBus';
import { ReducerRegistry } from '../../ReducerRegistry';
import { ModelAction } from '../../app/mq/ModelAction';
import { getCurrChatSessionID, getCurrChatUUID } from '../../reducers/partner';
//import { initUIChannelList, initUIChannelJoinModelList } from '../actions/chat';
import { MessageApi } from '../MessageApi'
import { req, APPLICATION_X_WWW_FORM_URLENCODED } from '../../lib/http-helper';
export const MESSAGE_COMMING_TOPIC = "chat::message_comming_topic"
export const SEND_MESSAGE_TO_SERVER_TOPIC = "chat::send_message_to_server_topic"
export const INIT_UI = "chat::init_ui"
export const INIT_CHANNEL_LIST_UI = "chat::init_channel_list_ui"
export const INIT_CHANNEL_JOIN_MODEL_LIST_UI = "chat::init_channel_join_model_list_ui"
export const SET_ACTIVE_CHANNEL = "chat::set_active_channel"
export const SET_ACTIVE_CHANNEL_ACTIVE_JOIN_MODEL = "chat::set_active_channel_active_join_model"

export class ChatCore {
    constructor() {
        this._eb = new EventBus("http://localhost:8088/eventbus")
        this._eb.onopen = () => {
            console.log("connect stable...")
        }
    }

    get eventBus() {
        return this._eb
    }

    static get ref() {
        return ChatCore.singleton || (ChatCore.singleton = new ChatCore())
    }

    start() {
        this.stableChatSession().then(channelMeta => {
            this.startChatSession(channelMeta)
        })
    }

    stableChatSession() {
        let p = new Promise((resolve, reject) => {
            this.startRegClient(resolve, reject)
        })
        return p
    }
    activeSession(sessionID) {
        setTimeout(() => {
            this.activeSessionImp(sessionID)
        }, 1000 * 60 * 5);
    }
    activeSessionImp(sessionID) {
        let self = this
        let pData = { sessionID }
        req("/ac/chat/chat/activeChatSession", pData, {
            headers: {
                "content-type": APPLICATION_X_WWW_FORM_URLENCODED
            }
        }, function(data) {
            self.activeSession(sessionID)
        }, function() {
            self.activeSession(sessionID)
        })
    }
    startRegClient(success, fail) {
        let chatSessionID = this.getCurrChatSessionID() || ""
        let self = this 
        new ModelAction("chat", "chat").call("loadChannelMeta", {
            chatSessionID
        }, (ret) => {
            if (ret.errorCode != 0) {
                setTimeout(() => {
                    self.startRegClient(success, fail)
                }, 5000)
            } else {
                self.activeSession(chatSessionID)
                success && success(ret.bag.channelMeta)
            }
        }, () => {
            setTimeout(() => {
                self.startRegClient(success, fail)
            }, 5000)
        })
    }

    getCurrChatUUID() {
        const state = ReducerRegistry.Store.getState()
        return getCurrChatUUID(state)
    }
    getCurrChatSessionID() {
        const state = ReducerRegistry.Store.getState()
        return getCurrChatSessionID(state)
    }
    registerEndpoint(address){
        let self = this
        try{
            self._eb.registerHandler(address, {
                fromUUID: self.getCurrChatUUID()
            }, (_, msg) => {
                MessageBus.ref.send(MESSAGE_COMMING_TOPIC, (msg || {}).body)
            })
        }
        catch(err){
            setTimeout(()=>{
                self.registerEndpoint(address)
            },200)
        }
    }
    startChatSession(channelMeta) {
        let self = this
        let chatSessionID = this.getCurrChatSessionID()
        this.initChatData(channelMeta).then(() => {
            self.loadChannelJoinModels(channelMeta).then(() => {
                const address = "server.to.client." + chatSessionID
                self.registerEndpoint(address)
                MessageBus.ref.consume(SEND_MESSAGE_TO_SERVER_TOPIC, (msg) => {
                    this.sendToServer(msg)
                })
                MessageBus.ref.consume(MESSAGE_COMMING_TOPIC, msg => {
                    this.dispatchResponeMessage(msg)
                })
                MessageBus.ref.consume(MESSAGE_COMMING_TOPIC, msg => {
                    //log add receive message
                    console.log(JSON.stringify(msg))
                })
            })

        })
    }
    dispatchResponeMessage(msg) {
        let resp = this.createMessageResponse(msg)
        if (resp) {
            this.sendToServer(resp)
        }
    }
    createMessageResponse(message) {
        if (MessageApi.mustResponseReceiveStatus(message)) {
            return MessageApi.createResponseReceiveSuccessMessage(message)
        }
        return null
    }
    initChatData(channelMeta) {
        let self = this
        return new Promise((resolve, reject) => {
            //console.log(JSON.stringify(channelMeta))
            let myUUID = self.getCurrChatUUID()
            MessageBus.ref.send(INIT_CHANNEL_LIST_UI, { channelMeta, myUUID })
            resolve()
        })
    }
    loadChannelJoinModels(channelMeta) {
        let tmpChannelMetas = channelMeta || []
        let promises = []
        tmpChannelMetas.map(ch => {
            promises.push(new Promise((resolve, reject) => {
                new ModelAction("chat", "chatChannel").call("getChannelJoinModels", {
                    uuid: ch.uuid
                }, data => {
                    if ((data.bag || {}).joinModels) {
                        MessageBus.ref.send(INIT_CHANNEL_JOIN_MODEL_LIST_UI, {
                            channelUUID: ch.uuid,
                            joinModels: data.bag.joinModels
                        })
                    }
                    resolve()
                }, () => {
                    resolve()
                })
            }))
            return promises
        })
        return Promise.all(promises)
    }
    sendToServer(msg) {
        console.log("start send message" + new Date())
        try{
            this._eb.publish("client.to.server", msg)
        }
        catch(err){

        }
    }
}