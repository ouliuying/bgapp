import React from 'react'
import AppInContainer from '../app/AppInContainer'
import { loadView } from '../app/loadView'
import PartnerRuleCreate from './views/PartnerRuleCreate'
import PartnerViewRuleCreate from './views/PartnerViewRuleCreate'
import PartnerViewRuleList from './views/PartnerViewRuleList'
import PartnerRuleList from './views/PartnerRuleList'
const modelViews=[
    loadView("admin", "partnerRuleApi","create",PartnerRuleCreate),
    loadView("admin", "partnerRuleApi","edit",PartnerRuleCreate),
    loadView("admin", "partnerRuleApi","list",PartnerRuleList),
    loadView("admin", "partnerViewRuleApi","list",PartnerViewRuleList),
    loadView("admin", "partnerViewRuleApi","create",PartnerViewRuleCreate),
]
export default function AdminInContainer(props){
    return <AppInContainer app="admin" modelViews={modelViews}></AppInContainer>
}

