import React from "react"
import {connect} from 'react-redux'
import { createDetailParam } from "../../modelView/ViewParam"
import { getModelView } from "../../modelView/ModelViewRegistry"
import { ModalSheetManager } from "../../modelView/ModalSheetManager"

class ModelCommentControl extends React.Component{
    render(){
        const {data} = this.props
        return <span>
            {data.comment}
        </span>
    }
}


export default ModelCommentControl