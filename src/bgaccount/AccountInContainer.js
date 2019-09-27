import React from 'react'
import AppInContainer from '../app/AppInContainer'
const modelViews=[]
export default function AccountInContainer(props){
    return <AppInContainer app="corp" modelViews={modelViews}></AppInContainer>
}