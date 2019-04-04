
const Emitter = require('component-emitter');
import { MsgToken } from '../msg/msg-token';
import {Console} from '../lib/console'
import { STABLE_CONNECTION_MSG } from '../msg/msg-types';
const CONNECT_CLOSE = 1;
const CONNECT_CONNECTING = 2;
const CONNECT_CONNECTED = 3;
export class ClientSocket {
    constructor(opts) {
        this.opts = Object.assign({
            protocol: 'ws:',
            host: location.host,
            sessionID: '',
            path: '/',
            partnerTag: 0
        }, opts);
        this.connect = CONNECT_CLOSE;
        this.packetCache = [];
        this.stableConnection();
    }

    stableConnection() {
        let msg = MsgToken.createMsg(0, STABLE_CONNECTION_MSG);
        msg.sessionID = this.opts.sessionID;
        this.packetCache.push(msg);
    }
    startTick() {
        this.tickHandle = setInterval(() => {
            this.stableConnection();
            this.emit('packet', null);
        }, 1000 * 60);
    }
    closeTick() {
        if (this.tickHandle) {
            clearInterval(this.tickHandle);
            this.tickHandle = null;
        }
    }

    async open() {
        var promise = new Promise((function(resolve, reject) {
            this.socket = new WebSocket(this.opts.protocol + "//" + this.opts.host + this.opts.path + '?yxid=' + this.opts.sessionID + "&pid=" + this.opts.partnerTag);
            this.socket.binaryType = 'arraybuffer';
            this.connect = CONNECT_CONNECTING;
            this.socket.onopen = (evt) => {
                this.connect = CONNECT_CONNECTED;
                this.emit('packet', null);
                this.startTick();
                this.emit("open", evt);
                resolve && resolve(true);
            };
            this.socket.onerror = (evt) => {
                this.closeTick();
                if (this.socket) {
                    this.socket.close();
                    this.socket = null;
                }
                this.emit('error', evt);
                resolve && resolve(false);
                this.connect = CONNECT_CLOSE;
                Console.log('client websocket closed!!!');
            };
            this.socket.onmessage = (evt) => {
                let packet = this.parsePacket(new Uint8Array(evt.data));
                this.emit('message', packet);
            };

            this.socket.onclose = (evt) => {
                this.connect = CONNECT_CLOSE;
                this.closeTick();
                if (this.socket) {
                    this.socket.close();
                    this.socket = null;
                }
                this.emit('close', evt);
                resolve && resolve(false);
                Console.log('client websocket closed!!!');
            };
            this.on('message', (msg) => {
                Console.log(JSON.stringify(msg));
            });
            this.on('packet', (packet) => {
                if (this.connect == CONNECT_CONNECTED) {
                    if (this.packetCache.length > 0) {
                        for (let p of this.packetCache) {
                            this.send(p);
                        }
                        this.packetCache = [];
                    }
                    if (packet) {
                        this.send(packet);
                    }
                } else if (packet) {
                    this.packetCache.push(packet);
                }
                if (this.connect == CONNECT_CLOSE) {
                    this.reOpen();
                }
            });
        }).bind(this));
        return promise;
    }

    close() {
        this.closeTick();
        this.socket.close();
    }

    send(packet) {
        let bin = this.toBinary(packet);
        this.socket.send(bin.buffer);
    }

    parsePacket(data) {
        return MsgToken.toMsg(data);
    }

    toBinary(packet) {
        return MsgToken.toBinary(packet);
    }
    reOpen() {
        if (this.connect == CONNECT_CONNECTED || this.connect == CONNECT_CONNECTING) {
            return;
        }
        return this.open();
    }
}
Emitter(ClientSocket.prototype);