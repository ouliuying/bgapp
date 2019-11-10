import React, { Component } from 'react'
import {FlashBackground} from './FlashBackground'
import {
    withRouter,
    Redirect,
    Route,
    matchPath
} from 'react-router-dom'
import _ from 'lodash'
import {connect} from 'react-redux'

import PropTypes from 'prop-types'

import ThemeStyle from './ThemeStyle'

import {setPartner,setPartnerUserNamePassword} from './actions/partner'
import {setSys} from './actions/sys'

import {userNamePasswordSelector, statusSelector} from './reducers/partner'
import {req,APPLICATION_X_WWW_FORM_URLENCODED} from './lib/http-helper'
import {ModalSheetManager} from './app/modelView/ModalSheetManager'
import { SYS_INIT, MessageBus } from './mb/MessageBus';
import { WEB_TYPE } from './bgchat/devType';
class Login extends Component {
    static propTypes = {
        store: PropTypes.object,
    }
    static contextTypes = {
        store: PropTypes.object,
    }
    updateData(name,evt){
        var td={}
        td[name]=evt.target.value
        setPartnerUserNamePassword(td)
    }
    doLogin(){
       let self=this
        const {userName,password}=this.props
        let devType= WEB_TYPE
        let pData={userName,password,devType}
        req("/login",pData,{
            headers:{
                "content-type":APPLICATION_X_WWW_FORM_URLENCODED
            }
        },function(data){
            var jData=JSON.parse(data)
            if(jData.errorCode==0){
                jData.bag.partner.password=""
            }
            setPartner(jData)
            setSys(jData)
            if(jData.errorCode!=0){
                ModalSheetManager.openAlert({title:"提示",msg:jData.description})
            }
        },function(){
            ModalSheetManager.openAlert({title:"提示",msg:"请求失败！"})
        })
    }
    getCurrPartner(data){

    }
    isLogin(){
        return this.props.status>0
    }
    render(){
        return (
            (this.isLogin())?(<Redirect to={{
                pathname: "/app/dynamic/worktable",
                state: { from: this.props.location }
              }}/>):(<div>
                <ThemeStyle body={`bg-login-body`} root={`bg-login-root`}/>
                <div className="bg-login-bg">
                    <h1>金云办公</h1>
                    <h3><span>bg.work</span> -- 每个人的办公平台</h3>
                </div>
    
                <div className="bg-login-area">
                    <span>
                        <i className="bg-login-icon">
                            <svg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'>
                                <path d='M768 728.615385v-7.876923-11.815385c-11.815385-110.276923-122.092308-196.923077-256-196.923077s-244.184615 86.646154-256 192.984615v23.63077c0 43.323077 35.446154 78.769231 78.769231 78.76923h354.461538c43.323077 0 78.769231-35.446154 78.769231-78.76923zM512 1024C228.430769 1024 0 795.569231 0 512S228.430769 0 512 0s512 228.430769 512 512-228.430769 512-512 512z m0-555.323077c94.523077 0 169.353846-74.830769 169.353846-169.353846S606.523077 126.030769 512 126.030769s-169.353846 78.769231-169.353846 173.292308 74.830769 169.353846 169.353846 169.353846z'/>
                            </svg>
                        </i>
                        <span className="bg-login-small-title">
                        登陆
                        </span>
                    </span>
                    <div className="bg-login-form">
                        <div className="bg-login-form-group">
                            <label>用户名：</label>
                            <input type="input" id="username" placeholder="默认：admin"  value={this.props.userName}
                                onChange={(val)=>this.updateData("userName",val)}/>
                        </div>
                        <div className="bg-login-form-group">
                            <label>密    码:</label>
                            <input type="password" id="password" placeholder="默认：admin" value={this.props.password}
                                onChange={(val)=>this.updateData("password",val)}/>
                        </div>
                        <div>
                           
                            <button className="bg-login-form-btn" onClick={()=>this.doLogin()}>确 认 登 陆</button>
                        </div>
    
                        <div className="bg-login-form-reg">
                            <a href="https://oa.bg.work/xy">注册 <strong>金云办公</strong>账号</a>
                        </div>
                    </div>
                </div>
            </div>)
        )
    }
}

function mapStateToProps(state){
    return Object.assign({},userNamePasswordSelector(state),statusSelector(state))
}

export default withRouter(connect(mapStateToProps)(Login))

