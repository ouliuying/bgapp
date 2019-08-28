import { SEND_MESSAGE_TO_SERVER_TOPIC } from "./core/Chat";
import { MessageBus } from "../mb/MessageBus";
let msgSeq=Math.floor(Math.random()*10000000)
export class MessageApi{
    static send(msg){
        msg.seq = msgSeq
        msgSeq++
        MessageBus.ref.send(SEND_MESSAGE_TO_SERVER_TOPIC,msg)
    }
    static isUUIDResponse(msg){
        return msg && msg.isResponse==1 && msg.type==0
    }
    static mustResponseReceiveStatus(msg){
        return msg && msg.responseType==1 && !msg.isResponse
    }

    static mustConfirmReceiveStatus(msg){
        return msg && msg.responseType==2 && !msg.isResponse
    }

    static createResponseWithConfirmMessage(message,confirmMessage){
        return {
            type: 2,
            isResponse: 1,
            uuid: message.uuid,
            timestamp: Date().getTime(),
            confirm:confirmMessage,
            channelUUID:message.channelUUID,
            toUUID:message.fromUUID
        }
    }

    static createResponseReceiveSuccessMessage(message){
        return {
            type: 1,
            isResponse: 1,
            uuid: message.uuid,
            timestamp: Date().getTime(),
            channelUUID:message.channelUUID,
            toUUID:message.fromUUID
        }
    }
}