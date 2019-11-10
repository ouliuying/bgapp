import React from 'react'
import {connect} from 'react-redux'
import {ReducerRegistry} from '../ReducerRegistry'
import {
    withRouter,
    Switch,
    Route
} from 'react-router-dom'
import { goBack,push } from 'connected-react-router';
import { getIcon } from '../svg'
import { Button } from 'antd';
import {Icon,Form,InputNumber,Rate} from '../ui'
import { ModelAction } from '../app/mq/ModelAction';
import { DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import { ModalSheetManager } from '../app/modelView/ModalSheetManager';
import { CrmCustomerFollowStepList } from './CrmCustomerFollowStepList';
import { CrmAddCustomerToFollowStepView } from './CrmAddCustomerToFollowStepView';
import { createViewParam } from '../app/modelView/ViewParam';
import produce from 'immer';
import { SelectModelFromListViewField } from '../app/modelView/ViewFieldType';
class CreateOrEditStepCustomer extends React.Component{
    constructor(props){
        super(props)
        const {stepCustomer} = this.props
        this.state={
            stepCustomer
        }
    }
    render(){
        const {close,doCreate,step} = this.props
        const {stepCustomer} = this.state
        let self = this
        return <div  className="bg-customer-follow-body-step-create">
                    <Form layout="vertical" size="small">
                        <Form.Item label="客户" size="small">
                        <SelectModelFromListViewField size="small" enable={true} value={((stepCustomer||{}).record||{}).customer} relationData={{
                            targetApp:"crm",
                            targetModel:"customer",
                            toName:"name"
                        }} onChange={value=>{
                            let sc = produce(this.state.stepCustomer,draft=>{
                                draft.record["customer"] = value
                            })
                            self.setState({
                                stepCustomer:sc
                            })
                        }}>
                        </SelectModelFromListViewField>
                        </Form.Item>
                        <Form.Item label="机会" size="small">
                            <Rate allowHalf defaultValue={2.5} value={stepCustomer.record.rate} size="small"  onChange={rate=>{
                                 let sc = produce(this.state.stepCustomer,draft=>{
                                    draft.record.rate = rate
                                })
                                self.setState({
                                    stepCustomer:sc
                                })
                            }}/>
                        </Form.Item>
                        <div className="bg-customer-follow-body-step-create-action">
                            <Button type="primary" size="small" onClick={
                                ()=>{
                                    doCreate(this.state.stepCustomer,step,()=>{
                                        close()
                                    })
                                }   
                            }>确定</Button>
                            <Button type="danger" size="small" style={{marginLeft:3}} onClick={
                                ()=>{
                                    close()
                                }
                            }>取消</Button>
                        </div>
                    </Form>
                </div>
    }
}
class StepCustomer extends React.Component{
   constructor(props){
       super(props)
       this.state = {
           showEdit:false
       }
   }
    render(){
        let self = this
        const {
            data,
            step,
            doCreate,
            isDragging,
            isGroupedOver,
            provided
          } = self.props;
        return <div 
        className="bg-customer-follow-body-step-customer" 
        ref={provided.innerRef}  
        isDragging={isDragging} 
        isGroupedOver={isGroupedOver}   
        data-is-dragging={isDragging}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        >
            <div>
            <Button type="danger" onClick={()=>{
               self.setState({
                   showEdit:true
               })
            }}>xx</Button>
            {data.name}
            </div>
           
       
        {
            this.state.showEdit && <CreateOrEditStepCustomer stepCustomer={
                data
            } close={()=>{
                self.setState({
                    showEdit:false
                })
            }} step = {step} doCreate={doCreate}></CreateOrEditStepCustomer>
        }
        </div>
    }
}
class StepCustomerList extends React.Component{
    render(){
        const {customers,step,doCreate} = this.props
        return customers.map((c,index)=>{
            return <Draggable
                    key={c.record.id+""}
                    draggableId={c.record.id+""}
                    index={index}
                >

                {(
                    dragProvided,
                    dragSnapshot
                ) => (
                    <StepCustomer
                    data= {c}
                    step = {step} 
                    doCreate={doCreate}
                    key={c.record.id+""}
                    isDragging={dragSnapshot.isDragging}
                    isGroupedOver={dragSnapshot.combineTargetFor}
                    provided={dragProvided}
                    />
                )}
                </Draggable>
        })
    }
}
class StepContainer extends React.Component{
    constructor(props){
        super(props)
        this.state={
            showCreate:false
        }
    }
    
    render(){
        let self = this
        const {data,doCreate} = this.props
        let customers = data.record.customers||[]
        return <div className="bg-customer-follow-body-step">
                    <div className="bg-customer-follow-body-step-header" title={data.record.name}>
                        {data.record.name}
                        <span  className="bg-customer-follow-body-step-header-actions">
                            <Icon type="plus" onClick={()=>{
                                 self.setState({
                                     showCreate:true
                                 })
                            }}></Icon>
                        </span>
                    </div>
                    {
                        self.state.showCreate && <CreateOrEditStepCustomer stepCustomer={
                            {record:{customer:{}}}
                        } close={()=>{
                            self.setState({
                                showCreate:false
                            })
                        }} step = {data} doCreate={doCreate}></CreateOrEditStepCustomer>
                    }
                    <Droppable droppableId={data.record.id+""}>
                        {
                            (dropProvided, dropSnapshot)=>(
                                <div className="bg-customer-follow-body-step-body"
                                    ref = {dropProvided.innerRef}
                                    {...dropProvided.droppableProps}>
                                     <StepCustomerList customers={customers} step = {data} doCreate={doCreate}/>
                                    {dropProvided.placeholder}
                                </div>
                            )
                        }
                    </Droppable> 
            </div>
    }
}

class CrmCustomerFollowView extends React.Component{
    constructor(props){
        super(props)
        this.state={
            steps:[]
        }
    }
    componentDidMount(){
      this.loadFollowStepCustomers()
    }
    doCreate(stepCustomer,step,callback){
        let self = this
        let tStepCustomerRecord = (stepCustomer||{}).record||{}
        let followStepID = step.record.id
        let rate = tStepCustomerRecord.rate||2.5
        let customerID = ((tStepCustomerRecord.customer||{}).record||{}).id
        let id = tStepCustomerRecord.id
        if(customerID){
            new ModelAction("crm","customerFollowStep").call("addOrEditCustomerToFollowStep",{
                customerID,
                rate,
                followStepID,
                id
            },ret=>{
                if(ret.errorCode == 0) {
                    callback();
                    self.loadFollowStepCustomers()
                }
                else{
                    ModalSheetManager.alert({
                        msg:ret.description
                    })
                }
            },err=>{

            })
        }
        else{
            ModalSheetManager.alert({
                msg:"先指定客户！"
            })
        }
    }
    loadFollowStepCustomers(){
        let self = this
        new ModelAction("crm","customerFollowStep").call("loadFollowStepCustomers",{

        },data=>{
            if(data.errorCode==0){
                let steps = data.bag.steps
                self.setState({steps:[...steps]})
                self.forceUpdate()
            }
        },err=>{

        })
    }
    customerChange(step, customer){

    }
    onBeforeDragStart(){
    
    };
    
    onDragStart() {
   
    };
    onDragUpdate(){
     
    };
    onDragEnd(){
       
    };
    shouldComponentUpdate(){
        return false
    }
    showCustomerFollowStepList(){
        let self = this
        let viewParam = {
            external:{
                reload:()=>{
                    self.loadFollowStepCustomers()
                }
            }
        }
        ModalSheetManager.openModal(CrmCustomerFollowStepList,{
           viewParam
        })
    }
    showAddCutomerToFollowStep(){
        let self = this
        let viewParam = {
            external:{
                reload:()=>{
                    self.loadFollowStepCustomers()
                }
            }
        }
        ModalSheetManager.openModal(CrmAddCustomerToFollowStepView,{viewParam})
    }
    render(){
        let self = this
        let steps = self.state.steps
        return  <div className="bg-customer-follow-container">
                        <div  className ="bg-customer-follow-actions">
                            {/* <Button type="danger" onClick={
                                ()=>{
                                    self.showAddCutomerToFollowStep()
                                }
                            }>添加跟进</Button> */}
                            <Button type="primary" style={{marginLeft:10}} onClick={()=>{
                                self.showCustomerFollowStepList()
                            }}>设置跟进阶段</Button>
                        </div>
                        <DragDropContext
                            onBeforeDragStart={()=>this.onBeforeDragStart()}
                            onDragStart={()=>this.onDragStart()}
                            onDragUpdate={()=>this.onDragUpdate()}
                            onDragEnd={()=>this.onDragEnd()}
                        >
                            <div className="bg-customer-follow-body">
                                {
                                    steps.map(s=>{
                                        return <StepContainer data={s} key={s.id} doCreate={(stepCustomer,step,callback)=>{
                                            self.doCreate(stepCustomer,step,callback)
                                        }}></StepContainer>
                                    })
                                }
                            </div>
                        </DragDropContext>
                    </div>
               
    }
}


export default CrmCustomerFollowView

