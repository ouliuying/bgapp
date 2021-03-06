import React from 'react'
import {Icon} from '../ui'
import  { ReactComponent as CorpPartners }  from '../svg/corp-partners.svg'
import  { ReactComponent as CorpRoleMag }  from '../svg/corp-role-mag.svg'
import  { ReactComponent as CorpAppCore }  from '../svg/core-app.svg'
import {ReactComponent as MyWorkTile} from '../svg/my-worktable.svg'
import {ReactComponent as MoreApp} from '../svg/icon-more.svg'
import {ReactComponent as DepartmentApp} from '../svg/department-app.svg'
import {ReactComponent as ProductApp} from '../svg/product-app.svg'
import {ReactComponent as ProductAppMag} from '../svg/product-app-mag.svg'
import {ReactComponent as ProductAppAttr} from '../svg/product-app-attr.svg'
import {ReactComponent as ProductAppUnit} from '../svg/product-app-unit.svg'
import {ReactComponent as CrmApp} from '../svg/crm-app.svg'
import {ReactComponent as CrmAppEvent} from '../svg/crm-app-event.svg'
import {ReactComponent as CrmAppLead} from '../svg/crm-app-lead.svg'
import {ReactComponent as CrmAppOppo} from '../svg/crm-app-oppo.svg'
import {ReactComponent as CrmAppQuot} from '../svg/crm-app-quot.svg'
import {ReactComponent as CrmAppOrder} from '../svg/crm-app-order.svg'
import {ReactComponent as CrmAppCustomer} from '../svg/crm-app-customer.svg'
import {ReactComponent as AccountApp} from '../svg/account-app.svg'
import {ReactComponent as AccountPayReceivable} from '../svg/account-pay.svg'
import {ReactComponent as SettingApp} from '../svg/setting-app.svg'
import {ReactComponent as SmsApp} from '../svg/sms-app.svg'
import {ReactComponent as SmsAppSend} from '../svg/sms-send.svg'
import {ReactComponent as SmsAppSendLog} from '../svg/sms-log.svg'
import {ReactComponent as ChatChannelLogo} from '../svg/chat-channel-logo.svg'
import {ReactComponent as ChatChannelOpMore} from '../svg/chat-channel-op-more.svg'
import {ReactComponent as ChatChannelMembers} from '../svg/chat-channel-members.svg'//chat-channel-ent.svg
import {ReactComponent as ChatChannelEntity} from '../svg/chat-channel-ent.svg'
//

import {ReactComponent as EventLogCreate} from './event-log-create.svg'
import {ReactComponent as EventLogEdit} from './event-log-edit.svg'
import {ReactComponent as EventLogComment} from './event-log-comment.svg'

//action icons
import {ReactComponent as Action_Add} from '../svg/action/add.svg'
import {ReactComponent as Action_Edit} from '../svg/action/edit.svg'
import {ReactComponent as Action_Save} from '../svg/action/save.svg'
import {ReactComponent as Action_Detail} from '../svg/action/detail.svg'
import {ReactComponent as Action_SingleSel} from '../svg/action/singlesel.svg'
import {ReactComponent as Action_Delete} from '../svg/action/delete.svg'

import {ReactComponent as Action_Chat_Join_Channel} from '../svg/action/chat-join-channel.svg'

import {ReactComponent as Action_Chat_Exit_Channel} from '../svg/action/chat-exit-channel.svg'

import {ReactComponent as AdminManagerLogo} from '../svg/admin-manager-logo.svg'

const svgs={
    
}
//TODO  load dynamic svg by server config
svgs["/svg/corp-partners.svg"]=CorpPartners
svgs["/svg/corp-role-mag.svg"]=CorpRoleMag
svgs["/svg/core-app.svg"]=CorpAppCore
svgs["/svg/my-worktable.svg"]=MyWorkTile
svgs["/svg/more-app.svg"]=MoreApp
svgs["/svg/department-app.svg"]=DepartmentApp
svgs["/svg/product-app.svg"]=ProductApp
svgs["/svg/product-app-mag.svg"]=ProductAppMag
svgs["/svg/product-app-attr.svg"]=ProductAppAttr
svgs["/svg/product-app-unit.svg"]=ProductAppUnit
svgs["/svg/crm-app.svg"]=CrmApp
svgs["/svg/crm-app-event.svg"]=CrmAppEvent
svgs["/svg/crm-app-lead.svg"]=CrmAppLead
svgs["/svg/crm-app-oppo.svg"]=CrmAppOppo
svgs["/svg/crm-app-quot.svg"]=CrmAppQuot
svgs["/svg/crm-app-order.svg"]=CrmAppOrder
svgs["/svg/crm-app-customer.svg"]=CrmAppCustomer
svgs["/svg/account-app.svg"]=AccountApp
svgs["/svg/account-pay.svg"]=AccountPayReceivable
svgs["/svg/setting-app.svg"]=SettingApp
svgs["/svg/sms-app.svg"]=SmsApp
svgs["/svg/sms-send.svg"]=SmsAppSend
svgs["/svg/sms-log.svg"]=SmsAppSendLog
svgs["/svg/chat-channel-logo.svg"]=ChatChannelLogo
svgs["/svg/chat-channel-op-more.svg"]=ChatChannelOpMore
svgs["/svg/chat-channel-members.svg"] = ChatChannelMembers
svgs["/svg/chat-channel-ent.svg"] = ChatChannelEntity

svgs["/svg/action/add.svg"] = Action_Add
svgs["/svg/action/edit.svg"] = Action_Edit
svgs["/svg/action/save.svg"] = Action_Save
svgs["/svg/action/detail.svg"] = Action_Detail
svgs["/svg/action/singlesel.svg"] = Action_SingleSel
svgs["/svg/action/delete.svg"] = Action_Delete


svgs["/svg/action/chat-join-channel.svg"] = Action_Chat_Join_Channel
svgs["/svg/action/chat-exit-channel.svg"] = Action_Chat_Exit_Channel

svgs["/svg/event-log-create.svg"] = EventLogCreate
svgs["/svg/event-log-edit.svg"] = EventLogEdit
svgs["/svg/event-log-comment.svg"] = EventLogComment
svgs["/svg/admin-manager-logo.svg"] = AdminManagerLogo

export function regSvg(path,component){
    svgs[path]=component
}

export function getSvg(path){
    return svgs[path]
}

export function getIcon(path){
    console.log("get path "+path)
   let svgIcon = svgs[path]
   if(svgIcon){
        return <Icon component={svgIcon}></Icon>
   }
   return <></>
}