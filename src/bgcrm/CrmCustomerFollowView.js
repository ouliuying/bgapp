import React from 'react'
import {connect} from 'react-redux'
import {ReducerRegistry} from '../ReducerRegistry'
import {
    withRouter,
    Switch,
    Route
} from 'react-router-dom'
import { goBack,push } from 'connected-react-router';
import { getIcon, getSvg } from '../svg'
import { Button } from 'antd';
import {Icon,Form,InputNumber,Rate,Card} from '../ui'
import { ModelAction } from '../app/mq/ModelAction';
import { DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import { ModalSheetManager } from '../app/modelView/ModalSheetManager';
import { CrmCustomerFollowStepList } from './CrmCustomerFollowStepList';
import { CrmAddCustomerToFollowStepView } from './CrmAddCustomerToFollowStepView';
import { createViewParam, createDetailParam } from '../app/modelView/ViewParam';
import produce from 'immer';
import { SelectModelFromListViewField } from '../app/modelView/ViewFieldType';
import { getColor } from '../lib/color-helper';
import { getModelView } from '../app/modelView/ModelViewRegistry';
import ViewType from '../app/modelView/ViewType';

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
            doDelete,
            isDragging,
            isGroupedOver,
            provided
          } = self.props;
          let record = (data||{}).record||{}
          let customer = record.customer||{}
          let customerRecord = customer.record||{}
          let detailSvg = getSvg("/svg/action/detail.svg")
          let title = customerRecord.name
          let color = getColor(title)
          let iconTxt = (title||"").substring(0,1)
        return <div 
        className="bg-customer-follow-body-step-customer" 
        ref={provided.innerRef}  
        isDragging={isDragging} 
        isGroupedOver={isGroupedOver}   
        data-is-dragging={isDragging}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        >
          
            <Card bordered={false}  actions={[
                <Icon component={detailSvg}  key="detail"  onClick={
                    ()=>{
                        let id = customerRecord.id
                        let app = "crm"
                        let model = "customer"
                        let dViewParam = createDetailParam(undefined,undefined,undefined,id,{},{})
                        let view = getModelView(app,model,ViewType.DETAIL)
                        ModalSheetManager.openModal(view,{
                            app,
                            model,
                            viewType:ViewType.DETAIL,
                            viewParam:dViewParam,
                            viewRefType:"none"
                        })
                    }
                }/>,
                <Icon type="edit" key="edit"  onClick={
                    ()=>{
                        self.setState({
                            showEdit:true
                        })
                    }
                }/>,
                <Icon type="delete" key="delete" onClick={
                    ()=>{
                        ModalSheetManager.confirm({
                            title:"删除提示",
                            msg:"确定要删除吗？",
                            ok:()=>{
                                let id = record.id
                                doDelete && doDelete(id)
                            }
                        })
                    }
                } />,
          ]}>
                <Card.Meta
                    avatar={
                      <span className="bg-step-customer-icon" style={
                          {color:color.color,background:color.background}
                      }><span>
                          {iconTxt.toUpperCase()}
                          </span></span>
                    }
                    title={customerRecord.name}
                    description={customerRecord.comment}
                />
                <div className = "bg-step-customer-rate">
                     <Rate disabled  value={record.rate} size="small" />
                </div>
                
            </Card>
           

       
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
        const {customers,step,doCreate,doDelete} = this.props
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
                    doDelete={doDelete}
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
        const {data,doCreate,doDelete} = this.props
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
                                     <StepCustomerList customers={customers} step = {data} doCreate={doCreate}  doDelete={doDelete}/>
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
    doDelete(id){
        let self = this
        new ModelAction("crm","customerFollowStep").call("deleteCustomerFollowStepCustomer",{
            id
        },ret=>{
            if(ret.errorCode == 0) {
                self.loadFollowStepCustomers()
            }
            else{
                ModalSheetManager.alert({
                    msg:ret.description
                })
            }
        },err=>{
            ModalSheetManager.alert({
                msg:"通讯失败！"
            })
        })
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
    reOrderStepCustomer(data){
        // {"draggableId":"10","type":"DEFAULT",
        //"source":{"index":0,"droppableId":"11"},
       // "reason":"DROP","mode":"FLUID",
       // "destination":{"droppableId":"8","index":0},"combine":null}
        let self = this
        let steps = produce(this.state.steps,draft=>{
            return draft
        })
        let source = data.source
        let destination = data.destination
        let draggableData={}
        if(destination){
            if(source.droppableId == destination.droppableId){
                let step = steps.find(x=>x.record.id == source.droppableId)
                if(step && source.index != destination.index){
                    step.record = step.record||{}
                    const cloneCustomers = Array.from(step.record.customers||[])
                    const [removed] = cloneCustomers.splice(data.source.index, 1)
                    cloneCustomers.splice(destination.index, 0, removed)
                    step.record.customers = cloneCustomers
                    draggableData.stepCustomerID = data.draggableId
                    draggableData.fromStep = {
                        index: source.index,
                        stepID: source.droppableId
                    }
                    draggableData.toStep = {
                        index: destination.index,
                        stepID:destination.droppableId
                    }
                }
            }
            else{
                let fromStep = steps.find(x=>x.record.id == source.droppableId)
                let toStep = steps.find(x=>x.record.id == destination.droppableId)
                if(fromStep && toStep && destination){
                    fromStep.record = fromStep.record||{}
                    const fromCloneCustomers = Array.from(fromStep.record.customers||[])
                    const [removed] = fromCloneCustomers.splice(data.source.index, 1)
                    fromStep.record.customers = fromCloneCustomers
                    toStep.record = toStep.record||{}
                    const toCloneCustomers = Array.from(toStep.record.customers||[])
                    toCloneCustomers.splice(destination.index,0,removed)
                    toStep.record.customers = toCloneCustomers

                    draggableData.stepCustomerID = data.draggableId
                    draggableData.fromStep = {
                        index: source.index,
                        stepID: source.droppableId
                    }
                    draggableData.toStep = {
                        index: destination.index,
                        stepID:destination.droppableId
                    }
                }
            }
            self.setState({
                steps
            })
            self.forceUpdate()
            if(draggableData.stepCustomerID){
                new ModelAction("crm","customerFollowStep").call("switchFollowStepCustomerSeq",{
                ...draggableData
                },ret=>{
                    if(ret.errorCode==0){

                    }
                    else{
                        ModalSheetManager.alert({
                            msg:ret.description
                        })
                    }
                },err=>{
                    ModalSheetManager.alert({
                        msg:"通讯失败"
                    })
                })
            }
        }
    }
    customerChange(step, customer){

    }
    onBeforeDragStart(){
    
    };
    
    onDragStart(data) {
      
    };
    onDragUpdate(){
     
    };
    onDragEnd(data){
       // alert(JSON.stringify(data))
        let self = this
        self.reOrderStepCustomer(data)
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
                            onDragStart={(data)=>this.onDragStart(data)}
                            onDragUpdate={()=>this.onDragUpdate()}
                            onDragEnd={(data)=>this.onDragEnd(data)}
                        >
                            <div className="bg-customer-follow-body">
                                {
                                    steps.map(s=>{
                                        return <StepContainer data={s} key={s.id} doCreate={(stepCustomer,step,callback)=>{
                                            self.doCreate(stepCustomer,step,callback)
                                        }} doDelete={
                                            (id)=>{
                                                self.doDelete(id)
                                            }
                                        }></StepContainer>
                                    })
                                }
                            </div>
                        </DragDropContext>
                    </div>
               
    }
}


export default CrmCustomerFollowView

