import React from "react"
import {connect} from 'react-redux'
import { createDetailParam } from "../../modelView/ViewParam"
import { getModelView } from "../../modelView/ModelViewRegistry"
import { ModalSheetManager } from "../../modelView/ModalSheetManager"
import {Button,Input } from '../../../ui'

class ModelCommentControlEditor extends React.Component{
    constructor(props){
        super(props)
        this.state={
            comment:""
        }
    }
    render(){
        const {onSave} = this.props
        return <div className="bg-comment-control-editor">
            <div>
            <Input.TextArea rows={4}  onChange={
                e=>{
                    this.setState({
                        comment:e.target.value
                    })
                }
            }/>
            </div>
            <div style={{paddingTop:10,paddingBottom:10,textAlign:'right'}}>
                <Button type="danger" onClick={
                    ()=>{
                        if(this.state.comment!=""){
                            onSave && onSave(
                                "modelCommentControlEditor", 
                                "modelCommentControl", 
                                "/svg/event-log-comment.svg",this.state)
                        }
                        else{
                            ModalSheetManager.alert({
                                title:"提示",
                                msg:"不能为空！"
                            })
                        }
                    }
                }>添加</Button>
            </div>
        </div>
    }
}
export default ModelCommentControlEditor