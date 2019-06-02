import React from 'react'
import AppInContainer from '../app/AppInContainer'
import CreateView from './views/attribute_value_map/CreateView'
import {loadView} from '../app/loadView'
export default function ProductInContainer(props){
    const modelViews=[
        loadView("product", "productAttributeValueMap","create",CreateView),
    ]
    return <AppInContainer app="corp" modelViews={modelViews}></AppInContainer>
}