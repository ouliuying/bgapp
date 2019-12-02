import React from 'react'
import AppInContainer from '../app/AppInContainer'
import {loadView} from '../app/loadView'
import DepartmentListView from './views/DepartmentListView'
const modelViews=[
   loadView("corp", "department","list",DepartmentListView),
]
export default function CorpInContainer(props){
    return <AppInContainer app="corp" modelViews={modelViews}></AppInContainer>
}