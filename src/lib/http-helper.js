import _ from 'lodash'
import {URLCodeHelper} from './urlcode-helper'
import {TypeHelper} from './type-helper'
import {showGlobalOverlay } from './GlobalOverlay';
 const APPLICATION_X_WWW_FORM_URLENCODED='application/x-www-form-urlencoded'
 const APPLICATION_JSON='application/json'
const RESPONE_JSON='json'
const HTTP_POST='POST'
const HTTP_GET='GET'
function* genReq(url,data=null,reqInfo=null){
    let pData=null
    if(data instanceof Array){
        pData=data||[]
    }
    else{
        pData=data||{}
    }
    let pReqInfo =_.assign({},{
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        response:{
            dataType:'json'
        }
    },reqInfo)

    if(pReqInfo.headers["content-type"]==APPLICATION_X_WWW_FORM_URLENCODED){
        pData=URLCodeHelper.toKeyValue(pData)
    }else{
        pReqInfo.headers["content-type"]=APPLICATION_JSON
        pData=JSON.stringify(pData)
    }
    let hideGlobalOverlay=showGlobalOverlay()
    try
    {
        if(pReqInfo.method==HTTP_POST){
            pReqInfo.headers["content-length"]=pData.length
            let resp = yield fetch(url,{
                cache:pReqInfo.cache,
                credentials:pReqInfo.credentials,
                method:pReqInfo.method,
                mode:pReqInfo.mode,
                body:pData,
                headers:pReqInfo.headers,
            })
            let msg = yield resp.text() 
            return  msg
        }
        else{
            let resp =  fetch(url,{
                cache:pReqInfo.cache,
                credentials:pReqInfo.credentials,
                method:pReqInfo.method,
                mode:pReqInfo.mode,
                headers:pReqInfo.headers,
            })
            let msg = yield resp.text() 
            return  msg
        }
    }
    catch(err){
        let msg = JSON.stringify({errorCode:9999,description:err.message})
        return msg
    }
    finally{
        hideGlobalOverlay()
    }
}
function req(url,data=null,reqInfo=null,successFun,failFun){
    for(let i=0;i<arguments.length;i++){
        if(TypeHelper.isFunction(arguments[i])){
            successFun=arguments[i]
            if(i+1<arguments.length){
                if(TypeHelper.isFunction(arguments[i+1])){
                    failFun=arguments[i+1]
                }
            }
            break
        }
    }
    successFun=successFun|| function(){}
    failFun=failFun||function(){}
    let pData=null
    if(data instanceof Array){
        pData=data||[]
    }
    else{
        pData=data||{}
    }
    let pReqInfo =_.assign({},{
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        response:{
            dataType:'json'
        }
    },reqInfo)

    if(pReqInfo.headers["content-type"]==APPLICATION_X_WWW_FORM_URLENCODED){
        pData=URLCodeHelper.toKeyValue(pData)
    }else{
        pReqInfo.headers["content-type"]=APPLICATION_JSON
        pData=JSON.stringify(pData)
    }
    let hideGlobalOverlay=showGlobalOverlay()
    if(pReqInfo.method==HTTP_POST){
        pReqInfo.headers["content-length"]=pData.length
        return fetch(url,{
            cache:pReqInfo.cache,
            credentials:pReqInfo.credentials,
            method:pReqInfo.method,
            mode:pReqInfo.mode,
            body:pData,
            headers:pReqInfo.headers,
        }).then(resp=>resp.text()).then((data)=>{
            hideGlobalOverlay()
            successFun(data)})
            .catch((res)=>{
                hideGlobalOverlay()
                failFun(res)
            })
    }else{
        return fetch(url,{
            cache:pReqInfo.cache,
            credentials:pReqInfo.credentials,
            method:pReqInfo.method,
            mode:pReqInfo.mode,
            headers:pReqInfo.headers,
        }).then(resp=> resp.text()).then((data)=>{
            hideGlobalOverlay()
            successFun(data)
        }
        ).catch((res)=>{
                hideGlobalOverlay()
                failFun(res)
        })
    }
}

export {
    HTTP_POST,
    HTTP_GET,
    APPLICATION_X_WWW_FORM_URLENCODED,
    APPLICATION_JSON,
    req,
    genReq
}