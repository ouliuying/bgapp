
import React from "react"
import {connect} from 'react-redux'
import { createDetailParam } from "../../modelView/ViewParam"
import { getModelView } from "../../modelView/ModelViewRegistry"
import { ModalSheetManager } from "../../modelView/ModalSheetManager"

class ModelLogControl extends React.Component{
    render(){
        const {data} = this.props
        return <span className="bg-a" onClick={()=>{
            let {app,model,viewType,modelID}=data
            let viewParam = createDetailParam(undefined,undefined,undefined,modelID,{},{})
            let view = getModelView(app,model,viewType)
            view && (
                ModalSheetManager.openModal(view,{
                    app,
                    model,
                    viewType,
                    viewParam,
                    viewRefType:"none"
                })
            )
        }}>{data.text}</span>
    }
}

function mapStateToProps(state){
    return state
}

export default connect(mapStateToProps)(ModelLogControl)