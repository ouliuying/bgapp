
import {ChatCore} from '../bgchat/core/Chat'
export const SYS_INIT = "kernel:sys_init"
export class MessageBus{
    constructor(){
        this._topicHandlersMap={}
    }
    static get ref(){
        return MessageBus.singleton||( MessageBus.singleton=new MessageBus())
    }
    send(topic,msg){
        const handlers = this._topicHandlersMap[topic]
        if(handlers && handlers instanceof Array){
            for(let h of handlers){
                h(msg)
            }
        }
    }
    consume(topic,handler){
        let handlers = this._topicHandlersMap[topic]||(this._topicHandlersMap[topic]=[])
        handlers.push(handler)
    }
}

//initialize kernel topic
MessageBus.ref.consume(SYS_INIT,(data)=>{
    ChatCore.ref.start(data)
})