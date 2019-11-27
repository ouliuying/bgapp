import React from 'react'
import AppInContainer from '../app/AppInContainer'
import { loadView } from '../app/loadView'
import PartnerRuleCreate from './views/PartnerRuleCreate'
import PartnerViewRuleCreate from './views/PartnerViewRuleCreate'
import PartnerViewRuleList from './views/PartnerViewRuleList'
import PartnerRuleList from './views/PartnerRuleList'
import PartnerMenuRuleList from './views/PartnerMenuRuleList'
import PartnerMenuRuleCreate from './views/PartnerMenuRuleCreate'
const modelViews=[
    loadView("admin", "partnerRuleApi","create",PartnerRuleCreate),
    loadView("admin", "partnerRuleApi","edit",PartnerRuleCreate),
    loadView("admin", "partnerRuleApi","list",PartnerRuleList),
    loadView("admin", "partnerViewRuleApi","list",PartnerViewRuleList),
    loadView("admin", "partnerViewRuleApi","create",PartnerViewRuleCreate),
    loadView("admin", "partnerViewRuleApi","edit",PartnerViewRuleCreate),
    loadView("admin", "partnerMenuRuleApi","list",PartnerMenuRuleList),
    loadView("admin", "partnerMenuRuleApi","create",PartnerMenuRuleCreate),
    loadView("admin", "partnerMenuRuleApi","edit",PartnerMenuRuleCreate),
]
export default function AdminInContainer(props){
    return <AppInContainer app="admin" modelViews={modelViews}></AppInContainer>
}

