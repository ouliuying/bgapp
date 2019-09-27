import React from 'react'
import AppInContainer from '../app/AppInContainer'
import {loadView} from '../app/loadView'
import MainFrame from './MainFrame'
import PartnerCreateView from './PartnerCreateView'
import { regModelView } from '../app/modelView/ModelViewRegistry';
const modelViews=[
    loadView("core", "partner","main",MainFrame),
    loadView("core","partner","create",PartnerCreateView)
    ]
export default function CoreInContainer(props){
   
    return <AppInContainer app="core" modelViews={modelViews}></AppInContainer>
}

regModelView("core","partner","create",PartnerCreateView)