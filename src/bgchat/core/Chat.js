import EventBus  from 'vertx3-eventbus-client'
import { MessageBus } from '../../mb/MessageBus';
import { ReducerRegistry } from '../../ReducerRegistry';
import { ModelAction } from '../../app/mq/ModelAction';
import { getCurrChatSessionID, getCurrChatUUID } from '../../reducers/partner';
export const MESSAGE_COMMING_TOPIC = "chat:message_comming_topic"
export const SEND_MESSAGE_TO_SERVER_TOPIC = "chat:send_message_to_server_topic"
export const INIT_UI = "chat:init_ui"
export class ChatCore {
    constructor(){
      this._eb = new EventBus("http://localhost:8088/eventbus")
    }

    get eventBus(){
        return this._eb
    }

    static get ref(){
        return ChatCore.singleton || (ChatCore.singleton = new ChatCore())
    }

    start(){
         this.stableChatSession().then(channelMeta=>{
             this.startChatSession(channelMeta)
         })
    }

    stableChatSession(){
        let p =new Promise((resolve,reject)=>{
            this.startRegClient(resolve,reject)
        })
        return p
    }

    startRegClient(success,fail){
        let chatSessionID = this.getCurrChatSessionID()||""
        new ModelAction("chat","chat").call("loadChannelMeta",{
            chatSessionID
        },(ret)=>{
            if(ret.errorCode!=0){
                setTimeout(()=>{
                    this.startRegClient(success,fail)
                },5000)   
            }
            else{
                success && success(ret.bag.channelMeta)
            }
        },()=>{
            setTimeout(()=>{
                this.startRegClient(success,fail)
            },5000)
        })
    }

    getCurrChatUUID(){
        const state = ReducerRegistry.Store.getState()
        return getCurrChatUUID(state)
    }
    getCurrChatSessionID(){
        const state = ReducerRegistry.Store.getState()
        return getCurrChatSessionID(state)
    }

    startChatSession(channelMeta){
        let chatSessionID = this.getCurrChatSessionID()
        this.initChatData(channelMeta).then(()=>{
            const address = "server.to.client." + chatSessionID
            this._eb.consume(address,(msg)=>{
                MessageBus.ref.send(MESSAGE_COMMING_TOPIC,msg)
            })
            MessageBus.ref.consume(SEND_MESSAGE_TO_SERVER_TOPIC,(msg)=>{
                this.sendToServer(msg)
            })
        })
    }


    initChatData(channelMeta){
        return  new Promise((resolve,reject)=>{
            console.log(JSON.stringify(channelMeta))
        })
    }

    sendToServer(msg){
        this._eb.publish("client.to.server",msg)
    }
}

