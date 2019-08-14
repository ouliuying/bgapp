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

export function regSvg(path,component){
    svgs[path]=component
}

export function getSvg(path){
    return svgs[path]
}