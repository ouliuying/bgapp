import React from 'react'
import AppInContainer from '../app/AppInContainer'
import CreateView from './views/attribute_value_map/CreateView'
import EditView from './views/attribute_value_map/EditView'
import {loadView} from '../app/loadView'
const modelViews=[
    loadView("product", "productAttributeValueMap","create",CreateView),
    loadView("product", "productAttributeValueMap","edit",EditView),
]
export default function ProductInContainer(props){

    return <AppInContainer app="corp" modelViews={modelViews}></AppInContainer>
}