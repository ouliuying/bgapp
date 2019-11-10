import React from 'react'
import AppInContainer from '../app/AppInContainer'
import CrmCustomerFollowView from './CrmCustomerFollowView'
import {CRM_CUSTOMER_FOLLOW_VIEW} from './CrmViewType'
import { loadView } from '../app/loadView'
const modelViews=[
    loadView("crm", "customer",CRM_CUSTOMER_FOLLOW_VIEW,CrmCustomerFollowView),
]
export default function CrmInContainer(props){
    return <AppInContainer app="crm" modelViews={modelViews}></AppInContainer>
}