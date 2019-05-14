import React from 'react'
import {Input,DatePicker,Select,notification ,Button,Upload,Checkbox} from "../../ui"

import {createIconFromSvg} from "../../icon/createIconFromSvg"
import Icon from '../../icon'
import {eq,gt_eq,and,lt,lt_eq,iLike,like} from '../../criteria/index'
import {ModelAction} from  '../mq/ModelAction'
import ViewType from './ViewType'
import {getRoutePath} from '../routerHelper'
import {push} from 'connected-react-router'
import {ReducerRegistry} from '../../ReducerRegistry'
import {getModelView} from './ModelViewRegistry'
import {ModalSheetManager} from './ModalSheetManager'
import ViewRefType from './ViewRefType'
import { createViewParam } from './ViewParam';
import moment from 'moment';
const {RangePicker} = DatePicker
const { TextArea } = Input
export const ViewFieldType={
    TextField:'text',
    SingleLineTextField:'singleLineText',
    MultiLineTextField:'multiLineText',
    TelephoneField:'telephone',
    MobileField:'mobile',
    NumberField:'number',
    RealField:'real',
    LongField:'long',
    IntField:'int',
    ImageUploadField:'imageUpload',
    AvatarField:'avatar',
    DateField:'date',
    EmailField:'email',
    IconLabelField:'iconLabel',
    Many2OneDataSetSelectField:'many2OneDataSetSelect',
    SingleCheckBoxField:'singleCheckbox',
    StaticField:'static'
}

export class StaticField extends React.Component{
    render(){
        const {value} = this.props
        return <span>
                {value}
        </span>
    }
}

export class TextField extends React.Component{
    render(){
        const {type,value,onChange}=this.props
        try{
            return type==="singleLine"?(
                <Input placeholder="请输入内容"  value={value} onChange={(evt)=>{
                    onChange(evt.target.value)
                }}/>
            ):(
                <TextArea value={value} placeholder="请输入内容" onChange={(evt)=>{
                    onChange(evt.target.value)
                }}/>
            )
        }
        catch(err){

        }
        return <></>
    
    }
}
export class SingleLineTextField extends React.Component{

    render(){
        return <TextField type="singleLine" {...this.props}>
            
        </TextField>
    }
}
export class MultiLineTextField extends React.Component{
    render(){
        return <TextField type="multiLine" {...this.props}>
        
        </TextField>
    }
}
export class TelephoneField extends React.Component{
    getTelephone(value){
        return value
    }
    render(){
        const {value,onChange,...rest}=this.props
        const telephone=this.getTelephone(value)
        return <Input {...rest} value={telephone} onChange={(evt)=>{
            onChange(evt.target.value)
        }} placeholder="输入电话号码"></Input>
    }
}
export class MobileField extends React.Component{
    getMobile(value){
        return value
    }
    render(){
        const {value,onChange,...rest}=this.props
        const mobile=this.getMobile(value)
        return <Input {...rest} value={mobile} onChange={(evt)=>{
            onChange(evt.target.value)
        }} placeholder="输入手机号码"></Input>
    }
}
export class NumberField extends React.Component{
    getNumber(value){
        return value
    }
    render(){
        const {value,onChange,getNumber,...rest}=this.props
        const number=(getNumber||this.getNumber)(value)
        return <Input {...rest} value={number} onChange={(evt)=>{
            onChange(evt.target.value)
        }}></Input>
    }
}
export class RealField extends React.Component{
    render(){
        return <NumberField {...this.props} getNumber={(value)=>{
            return value
        }}>
        </NumberField>
    }
}
export class LongField extends React.Component{
    render(){
        return <NumberField {...this.props} getNumber={(value)=>{
            return value
        }}>
        </NumberField>
    }
}
export class IntField extends React.Component{
    render(){
        return <NumberField {...this.props} getNumber={(value)=>{
            return value
        }}>
        </NumberField>
    }
}
export class ImageUploadField extends React.Component{
    render(){
        return <SingleLineTextField></SingleLineTextField>
    }
}

export  class AvatarField extends React.Component{
    render(){
        return <div className="bg-avatar">
            <Upload action="#">
                <Icon.UploadIcon></Icon.UploadIcon>
            </Upload>
            </div>
    }
}

export class SingleCheckBoxField extends React.Component{
    render(){
        const{meta,value,onChange}=this.props

        return value>0?<Checkbox checked label={(meta||{}).label}   onChange={
            (evt)=>{
                onChange && onChange(evt.target.value?1:0)
            }
        }></Checkbox>:<Checkbox  label={(meta||{}).label}  onChange={
            (evt)=>{
                onChange && onChange(evt.target.value?1:0)
            }
        }></Checkbox>
    }
}

export class DateField extends React.Component{
    toDate(value){
        if(typeof value === "string"){
            if(value==""){
                return moment(new Date())
            }
            return  moment(value,["YYYY-MM-DD HH:mm:ss","YYYY-MM-DD"])
        }
        else if(value==undefined || value==null || value==""){
            return moment(new Date())
        }
        else{
            return moment(new Date())
        }
    }
    formatDate(value){
        if(value){
            return value.format("YYYY-MM-DD HH:mm:ss")
        }
        else{
           return moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        }
    }
    render(){
        try{
            const {onChange,value}=this.props
            let setValue = this.toDate(value)
            return <DatePicker onChange={(value)=>{
                let strValue = this.formatDate(value)
                onChange && onChange(strValue)}
            } value={setValue}></DatePicker>
        }
        catch(err){

        }
        return <></>
       
    }
}

export class EmailField extends React.Component{
    getEmail(value){
        return value
    }
    render(){
        const {value,onChange,...rest}=this.props
        const email=this.getEmail(value)
        return <Input {...rest} value={email} onChange={(evt)=>{
            onChange(evt.target.value)
        }} placeholder="输入Email"></Input>
    }
}

export class IconLabelField extends React.Component{
    render(){
        let {title,icon,value,className,style,iconStyle,iconClassName,onClick}=this.props

        let XIcon=createIconFromSvg({src:icon,svgClassName:iconClassName,svgStyle:iconStyle})
        onClick=onClick||function(){}
        return <div className={className} style={style} onClick={onClick}>
                <div>
                    <XIcon></XIcon>
                </div>
                <h3>
                    <span>
                        {title}{value}
                    </span>
                </h3>
        </div>
    }
}

export class Many2OneDataSetSelectField extends React.Component{
    constructor(props){
        super(props)
        this.state={selItem:null}
    }
    onChange(idValue){
        const {meta,onChange}=this.props
        let selItem = meta.options.find(x=>parseInt(x.record["id"])==parseInt(idValue))
        if(!selItem){
            selItem=this.state.selItem
        }
        selItem && onChange && onChange(selItem)
    }
    selMore(){
            let self=this
            const {onChange,field,relationData} = this.props
            let external = {
                selSingleItemAction(data){
                   let selItem={
                            app:relationData.targetApp,
                            model:relationData.targetModel,
                            record:data
                        }
                    self.setState({
                        selItem:selItem
                    })
                   onChange && onChange(selItem)
                }
              
            }
            let view = getModelView(relationData.targetApp,relationData.targetModel,ViewType.LIST)
            let viewParam = createViewParam(undefined,undefined,external,undefined)
            view && (
                ModalSheetManager.openModal(view,{
                    app:relationData.targetApp,
                    model:relationData.targetModel,
                    viewType:ViewType.LIST,
                    viewParam,
                    viewRefType:ViewRefType.SINGLE_SELECTION
                })
            )
        
    }
    render(){
        var self=this
        const {meta,value,relationData}=this.props
        let options=[]
        if(meta && meta.options){
            meta.options.map(r=>{
                options.push({
                    value:parseInt(r.record["id"]),
                    label:r.record[relationData.toName]
                })
            })
        }
        if(self.state.selItem!=null){
            let id = parseInt(self.state.selItem.record["id"])
            if(options.findIndex(x=>x.value == id)<0){
                options.push({
                    value:id,
                    label:self.state.selItem.record[relationData.toName]
                })  
            }
        }
        let idValue =value?parseInt(value.record["id"]):undefined
        return <><Select onChange={(idValue)=>{
           self.onChange(idValue)
        }} value={idValue}>
        {
          options.map(ds => {
            return (
              <Select.Option key={ds.value} label={ds.label} value={ds.value}>
                <span style={{float: 'left'}}>{ds.label}</span>
              </Select.Option>
            )
          })
        }
      </Select>
      <span className="bg-many2one-select-more-btn-container">
            <Button type="text" onClick={()=>{
                    self.selMore()
            }}>选择更多。。。</Button>
            </span> 
      </>
    }
}

//export const Many2OneDataSetSelectField = withRouter(InnerMany2OneDataSetSelectField)

export class CriteriaEnumSelect  extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        const {onCriteriaChange,meta,name,value}=this.props
        return <Select value={value} placeholder="请选择" onChange={(value)=>{onCriteriaChange && onCriteriaChange({
                expression: eq(name,value),
                name,
                value
            }
        )}}>
        {
          meta.options.map(vt => {
            return <Select.Option key={vt.value} label={vt.label} value={vt.value} />
          })
        }
      </Select>
    }
}

export class CriteriaNumberRangeInput extends React.Component{
    constructor(props){
        super(props)
        const{maxValue,minValue}=this.props.meta
        this.state={
            maxValue,
            minValue,
        }
    }
    onValueChange(value){
        const {onCriteriaChange,name,key}=this.props
        var state=Object.assign({},this.state,value)
        this.setState(state)
        onCriteriaChange({
            key,
            expression:and(gt_eq(name,this.state.minValue),lt(name,this.state.maxValue))
        })
    }
    render(){
        return <div>
            <Input placeholder="最小值" value={this.state.minValue} onChange={(evt)=>{
                    this.onValueChange({minValue:evt.target.value})
            }}></Input> - <Input placeholder="最大值" value={this.state.maxValue} onChange={
                (evt)=>{
                    this.onValueChange({maxValue:evt.target.value})
                }
            }></Input>
        </div>
    }
}
export class CriteriaNumberLessEqualInput extends React.Component{
    constructor(props){
        super(props)
        const {value}=this.props
        this.state={value:value}
    }
    onChange(value){
        this.setState({value:value})
        const {onCriteriaChange,key,name}=this.props
        onCriteriaChange({
            key:key,
            expression:lt_eq(name,value)
        })
    }
    render(){
        
        return <Input value={this.state.value} onChange={this.onChange}>
        </Input>
    }
}

export class CriteriaNumberGreaterEqualInput extends React.Component{
    constructor(props){
        super(props)
        const {value}=this.props
        this.state={value:value}
    }
    onChange(evt){
        this.setState({value:evt.target.value})
        const {onCriteriaChange,key,name}=this.props
        onCriteriaChange({
            key:key,
            expression:gt_eq(name,evt.target.value)
        })
    }
    render(){
        
        return <Input value={this.state.value} onChange={this.onChange}>
        </Input>
    }
}
export class CriteriaNumberEqualInput extends React.Component{
    constructor(props){
        super(props)
        const {value}=this.props
        this.state={value:value}
    }
    onChange(evt){
        this.setState({value:evt.target.value})
        const {onCriteriaChange,key,name}=this.props
        onCriteriaChange({
            key:key,
            expression:eq(name,evt.target.value)
        })
    }
    render(){
        
        return <Input value={this.state.value} onChange={this.onChange}>
        </Input>
    }
}
export class CriteriaStringILikeEqualInput extends React.Component{
    constructor(props){
        super(props)
        const {value}=this.props
        this.state={value:value}
    }
    onChange(evt){
        this.setState({value:evt.target.value})
        const {onCriteriaChange,ckey,name}=this.props
        onCriteriaChange(
            iLike(name,evt.target.value),
            ckey
        )
    }
    render(){
        let {title}=this.props
        if(title===undefined){
            title="..."
        }
        return <Input value={this.state.value} onChange={this.onChange} placeholder={"输入 " + title}>
        </Input>
    }
}

export class CriteriaStringLikeEqualInput extends React.Component{
    constructor(props){
        super(props)
        const {value}=this.props
        this.state={value:value}
    }
    onChange(evt){
        this.setState({value:evt.target.value})
        const {onCriteriaChange,ckey,name}=this.props
        onCriteriaChange(
            like(name,evt.target.value),
            ckey
        )
    }
    render(){
        
        return <Input value={this.state.value} onChange={this.onChange}>
        </Input>
    }
}

export class CriteriaStringEqualInput extends React.Component{
    constructor(props){
        super(props)
        const {value}=this.props
        this.state={value}
    }
    onChange(evt){
        this.setState({value:evt.target.value})
        const {onCriteriaChange,ckey,name}=this.props
        onCriteriaChange(
            eq(name,evt.target.value),
            ckey
        )
    }
    render(){
        let {title}=this.props
        if(title===undefined){
            title="..."
        }
        return <Input value={this.state.value} onChange={(value)=>this.onChange(value)} placeholder={"输入 " + title}>
        </Input>
    }
}

export class CriteriaMobileEqualInput extends React.Component{
    constructor(props){
        super(props)
        const {value}=this.props
        this.state={value:value}
    }
    onChange(evt){
        if(!/^[0-9]{1,11}$/g.test(evt.target.value) && evt.target.value!=""){
            Notification.error({
                title: '手机号',
                message: '必须输入数字。。。'
              });
              return;
        }
        this.setState({value:evt.target.value})
        const {onCriteriaChange,ckey,name}=this.props
        onCriteriaChange(
            eq(name,evt.target.value),
            ckey
        )
    }
    render(){
        let {title}=this.props
        if(title===undefined){
            title="..."
        }
        return <Input value={this.state.value} onChange={(value)=>this.onChange(value)} placeholder={"输入 " + title}>
        </Input>
    }
}
export class CriteriaDateEqualInput extends React.Component{
    constructor(props){
        super(props)
        const {value}=this.props
        this.state={value:value}
    }
    onChange(evt){
        this.setState({value:evt.target.value})
        const {onCriteriaChange,key,name}=this.props
        onCriteriaChange({
            key:key,
            expression:eq(name,evt.target.value)
        })
    }
    render(){
        
        return <DatePicker value={this.state.value} onChange={this.onChange}>
        </DatePicker>
    }
}
export class CriteriaDateTimeEqualInput extends React.Component{
    constructor(props){
        super(props)
        const {value}=this.props
        this.state={value:value}
    }
    onChange(evt){
        this.setState({value:evt.target.value})
        const {onCriteriaChange,key,name}=this.props
        onCriteriaChange({
            key:key,
            expression:eq(name,evt.target.value)
        })
    }
    render(){
        
        return <DatePicker value={this.state.value} onChange={this.onChange}>
        </DatePicker>
    }
}

export class CriteriaDateStartInput extends React.Component{
    constructor(props){
        super(props)
        const {value}=this.props
        this.state={value:value}
    }
    onChange(evt){
        this.setState({value:evt.target.value})
        const {onCriteriaChange,key,name}=this.props
        onCriteriaChange({
            key:key,
            expression:gt_eq(name,evt.target.value)
        })
    }
    render(){
        
        return <DatePicker value={this.state.value} onChange={this.onChange}>
        </DatePicker>
    }
}

export class CriteriaDateEndInput extends React.Component{
    constructor(props){
        super(props)
        const {value}=this.props
        this.state={value:value}
    }
    onChange(evt){
        this.setState({value:evt.target.value})
        const {onCriteriaChange,key,name}=this.props
        onCriteriaChange({
            key:key,
            expression:lt_eq(name,evt.target.value)
        })
    }
    render(){
        return <DatePicker value={this.state.value} onChange={this.onChange}>
        </DatePicker>
    }
}

export class CriteriaDateTimeStartInput extends React.Component{
    constructor(props){
        super(props)
        const {value}=this.props
        this.state={value:value}
    }
    onChange(evt){
        this.setState({value:evt.target.value})
        const {onCriteriaChange,key,name}=this.props
        onCriteriaChange({
            key:key,
            expression:gt_eq(name,evt.target.value)
        })
    }
    render(){
        return <DatePicker value={this.state.value} onChange={this.onChange}>
        </DatePicker>
    }
}

export class CriteriaDateTimeEndInput extends React.Component{
    constructor(props){
        super(props)
        const {value}=this.props
        this.state={value:value}
    }
    onChange(evt){
        this.setState({value:evt.target.value})
        const {onCriteriaChange,key,name}=this.props
        onCriteriaChange({
            key:key,
            expression:lt_eq(name,evt.target.value)
        })
    }
    render(){
        return <DatePicker value={this.state.value} onChange={this.onChange}>
        </DatePicker>
    }
}

export class CriteriaDateRangeInput extends React.Component{
    constructor(props){
        super(props)
        const {value}=this.props
        this.state={value:value}
    }
    onChange(evt){
        this.setState({value:evt.target.value})
        const {onCriteriaChange,key,name}=this.props
        onCriteriaChange({
            key:key,
            expression:lt_eq(name,evt.target.value)
        })
    }
    render(){
        return <RangePicker value={this.state.value} onChange={this.onChange}>
        </RangePicker>
    }
}

export class CriteriaDateTimeRangeInput extends React.Component{
    constructor(props){
        super(props)
        const {value}=this.props
        this.state={value:value}
    }
    onChange(value){
        this.setState({value:value})
        const {onCriteriaChange,key,name}=this.props
        onCriteriaChange({
            key:key,
            expression:lt_eq(name,value)
        })
    }
    render(){
        return <RangePicker value={this.state.value} onChange={this.onChange}>
        </RangePicker>
    }
}


