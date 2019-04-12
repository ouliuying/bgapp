import React from 'react'
import AppInContainer from '../app/AppInContainer'
import {loadView} from '../app/loadView'
import MainFrame from './MainFrame'
import PartnerCreateView from './PartnerCreateView'
export default function CoreInContainer(props){
    const modelViews=[
        loadView("core", "partner","main",MainFrame),
        loadView("core","partner","create",PartnerCreateView)
        ]
    return <AppInContainer app="core" modelViews={modelViews}></AppInContainer>
}