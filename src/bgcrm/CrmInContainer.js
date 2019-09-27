import React from 'react'
import AppInContainer from '../app/AppInContainer'
const modelViews=[]
export default function CrmInContainer(props){
    return <AppInContainer app="crm" modelViews={modelViews}></AppInContainer>
}