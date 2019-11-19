import React from 'react'
import AppInContainer from '../app/AppInContainer'
import { loadView } from '../app/loadView'
import PartnerRuleCreate from './views/PartnerRuleCreate'
import PartnerRuleList from './views/PartnerRuleList'
const modelViews=[
    loadView("admin", "partnerRuleApi","create",PartnerRuleCreate),
    loadView("admin", "partnerRuleApi","list",PartnerRuleList),
]
export default function AdminInContainer(props){
    return <AppInContainer app="admin" modelViews={modelViews}></AppInContainer>
}

