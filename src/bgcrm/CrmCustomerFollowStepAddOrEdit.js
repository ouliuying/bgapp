import React from 'react'
import {Button,Form,Input} from '../ui'
import produce from 'immer'
import { ModelAction } from '../app/mq/ModelAction'
import { ModalSheetManager } from '../app/modelView/ModalSheetManager'
import { TypeHelper } from '../lib/type-helper'
export class CmdCustomerFollowStepAddOrEdit extends React.Component{
    constructor(props){
        super(props)
        let data=props.data || {
            name:'',
        }
        this.state={
            data:data
        }
    }

    doSave(){
        let data = this.state.data
        let self = this
        new ModelAction("crm","customerFollowStep").call("addOrEdit",{data},ret=>{
            if(ret.errorCode == 0){

                const {viewParam} = self.props
                const {external} = viewParam||{}
                if(external && external.reload && TypeHelper.isFunction(external.reload)){
                    external.reload()
                }
                if(external && external.close && TypeHelper.isFunction(external.close)){
                    external.close()
                }
            }
            else{
                ModalSheetManager.alert({
                    title: "提示",
                    msg: ret.description
                })
            }
        },err=>{

        })
    }
    updateItem(itemName,value){
        let data = produce(this.state.data,draft=>{
            draft[itemName] = value
        })
        this.setState({
            data
        })
    }
    render(){
        let self = this
        return <div className="bg-model-op-view bg-flex-full ">
                <div className="bg-model-op-view-actions">
                    <div className="bg-model-op-view-actions-main-group">
                        <Button type="primary" onClick={()=>{
                            self.doSave()
                        }}>确定</Button>
                    </div>
                </div>
                <div className="bg-model-op-view-body">
                    <div className="bg-model-op-view-body-main">
                        <div className="bg-model-op-view-body-main-h">
                            <div className="bg-model-op-view-body-main-h1">
                                   <Form >
                                        <Form.Item label={"名称"}>
                                            <Input onChange={e=>{
                                                self.updateItem("name",e.target.value)
                                            }} value={self.state.data.name}></Input>
                                        </Form.Item>
                                   </Form>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    }
}