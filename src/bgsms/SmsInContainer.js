import React from 'react'
import AppInContainer from '../app/AppInContainer'
import { loadView } from '../app/loadView';
import SmsSettingEditView from './SmsSettingEditView';
import SendSmsView from './SendSmsView';
import ImportSendSmsView from './ImportSendSmsView';
export default function SmsInContainer(props){
    const modelViews=[
        loadView("sms","smsSetting","edit",SmsSettingEditView),
        loadView("sms","sms","sendSms",SendSmsView),
        loadView("sms","sms","importSendSms",ImportSendSmsView),
        ]
    return <AppInContainer app="sms" modelViews={modelViews}></AppInContainer>
}