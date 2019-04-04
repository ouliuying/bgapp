import React from 'react'
import AppInContainer from '../app/AppInContainer'
import {loadView} from '../app/loadView'
import MainFrame from './MainFrame'
import PartnerCreateView from './PartnerCreateView'
export default function CoreInContainer(props){
    const modelViews=[
        loadView("partner","main",MainFrame),
        loadView("partner","create",PartnerCreateView)
        ]
    return <AppInContainer app="core" modelViews={modelViews}></AppInContainer>
}