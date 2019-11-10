
import React from "react"
import { ModelAction } from "../app/mq/ModelAction"
import { Button, Table } from "antd"
import { ModalSheetManager } from "../app/modelView/ModalSheetManager"
import { CmdCustomerFollowStepAddOrEdit } from "./CrmCustomerFollowStepAddOrEdit"
import { TypeHelper } from "../lib/type-helper"
import produce from "immer"

export class CrmCustomerFollowStepList extends React.Component{
    constructor(props){
        super(props)
        this.state={
            columns:[],
            rows:[],
        }
    }

    componentDidMount(){
       this.loadAllStepsViewData()
    }

    loadAllStepsViewData(){
        let self = this
        new ModelAction("crm","customerFollowStep").call("loadAllStepsViewData",{
            
        },data=>{
            if(data.errorCode == 0){
                self.setState(self.getClientViewData(data.bag.viewData))
            }
        },err=>{

        })
    }

    getClientViewData(viewData){
        let self = this 
       let tViewData = viewData||{}
       let rows  = []
       let columns = []
        if(tViewData.fields && tViewData.datas){
            tViewData.fields.map(f=>{
                columns.push({
                    title: f.title,
                    dataIndex: f.name,
                    key: 'id',
                })
                return f
            })
            columns.push({
                title:"操作",
                key:'id',
                width:120,
                render:(data)=>{
                   return <><Button onClick={()=>{
                        self.editCustomerFollowStep(data)
                   }}>编辑</Button><Button onClick={()=>{
                        self.deleteCustomerFollowStep(data)
                   }}>删除</Button></> 
                }
            })
            columns.push({
                title:"操作",
                key:'id',
                width:120,
                render:(data)=>{
                   return <><Button onClick={()=>{
                     self.moveToPreFollowStep(data)
                   }}>上移</Button><Button onClick={
                       ()=>{
                           self.moveToNextFollowStep(data)
                       }
                   }>下移</Button></> 
                }
            })
            tViewData.datas.map(d=>{
                rows.push(d.record)
            })
        }
        return {
            columns,
            rows
        }
    }
    moveToPreFollowStep(data){
        this.reOrder(data,false)
    }
    moveToNextFollowStep(data){
        this.reOrder(data,true)
    }
    reOrder(data,flag){
        let self = this
        let index = this.state.rows.findIndex(x=>x.id == data.id)
        if(flag){
            if(index < self.state.rows.length - 1){
               let nRows =  produce(this.state.rows,draft=>{
                    let oldRow = draft[index+1]
                    draft[index+1] = data
                    draft[index] = oldRow
               })
               self.setState({
                   rows:nRows
               }) 
            }
        }
        else{
            if(index >0){
                let nRows =  produce(this.state.rows,draft=>{
                     let oldRow = draft[index-1]
                     draft[index-1] = data
                     draft[index] = oldRow
                })
                self.setState({
                    rows:nRows
                }) 
             }
        }
    }
    deleteCustomerFollowStep(data){
        let self = this
        new ModelAction("crm","customerFollowStep").call("delete",{
            id:data.id
        },function(res){
        if(res.errorCode==0){
           self.loadAllStepsViewData()
        }
        else{
            ModalSheetManager.openAlert({
                msg:res.description
            })
        }
        },function(err){
            ModalSheetManager.openAlert({
                msg:"通讯失败！"
            })
        })
    }
    editCustomerFollowStep(data){
        let self = this
        let viewParam={
            external:{
                reload:()=>{
                    self.loadAllStepsViewData()
                }
            }
        }
        ModalSheetManager.openModal(CmdCustomerFollowStepAddOrEdit,{
            viewParam,
            data
        })
    }
    addCustomerFollowStep(){
        let self = this
        let viewParam={
            external:{
                reload:()=>{
                    self.loadAllStepsViewData()
                }
            }
        }
        ModalSheetManager.openModal(CmdCustomerFollowStepAddOrEdit,{
            viewParam
        })
    }

    saveCustomerFollowStepSeq(){
        const {viewParam} = this.props
        const {external} = viewParam||{}
        var ids = []
        this.state.rows.map(x=>{
            ids.push(x.id)
        })
        new ModelAction("crm","customerFollowStep").call("saveFollowStepSeq",{
            ids
        },ret=>{
            if(ret.errorCode == 0){
                if(external && external.reload && TypeHelper.isFunction(external.reload)){
                    external.reload()
                }
                if(external && external.close && TypeHelper.isFunction(external.close)){
                    external.close()
                }
            }
            else{
                ModalSheetManager.openAlert({
                    msg:ret.description
                })
            }
        },err=>{
            ModalSheetManager.openAlert({
                msg:"通讯失败！"
            })
        })
    }
    render(){
        let self = this
        return <div className="bg-model-op-view bg-flex-full">
                    <div className="bg-list-view-action-search-section">
                        <div className="bg-list-view-action">
                            <Button type="primary" onClick={
                                ()=>{
                                    self.addCustomerFollowStep()
                                }
                            }>添加</Button> <Button type="danger" onClick={
                                ()=>{
                                    self.saveCustomerFollowStepSeq()
                                }
                            }>保存顺序</Button>
                        </div>
                    </div>
                                    
                    <div className="bg-model-list-view-body bg-flex-full">
                        <div className="bg-model-list-view-body-control">
                            <Table style={{width: '100%'}}
                                    columns={self.state.columns}
                                    dataSource={self.state.rows}
                                    bordered={true}
                                    rowKey={(row)=>{
                                        return row.id
                                    }}
                                    pagination={false}
                                    >
                            </Table>
                        </div>
                    </div>
                </div>
    }
}

