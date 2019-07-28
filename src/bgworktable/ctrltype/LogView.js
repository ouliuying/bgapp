import React from 'react'
import {connect} from 'react-redux'
import { ModalSheetManager } from '../../app/modelView/ModalSheetManager';
import { getModelView } from '../../app/modelView/ModelViewRegistry';
import { createDetailParam } from '../../app/modelView/ViewParam';
class LogView extends React.Component{
    render(){
        const {data} = this.props
        return <a onClick={()=>{
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
        }}>{data.title}</a>
    }
}

function mapStateToProps(state){
    return state
}

export default connect(mapStateToProps)(LogView)