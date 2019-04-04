import React from 'react'
import {Input,DatePicker,Select,DateRangePicker,Notification,Button,Upload,Checkbox} from 'element-react'
import {createIconFromSvg} from "../../icon/createIconFromSvg"
import Icon from '../../icon'
import {eq,gt_eq,and,lt,lt_eq,iLike,like} from '../../criteria/index'
import {ModelAction} from  '../mq/ModelAction'
import ViewType from './ViewType'
import {getRoutePath} from '../routerHelper'
import {push} from 'connected-react-router'
import {ReducerRegistry} from '../../ReducerRegistry'
import moment from 'moment'
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
    SingleCheckBoxField:'singleCheckbox'
}
export class TextField extends React.Component{
    render(){
        const {type,...rest}=this.props
        return type==="singleLine"?(
            <Input placeholder="请输入内容" {...rest}/>
        ):(
            <Input type="textarea" {...rest} placeholder="请输入内容"/>
        )
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
        return <Input {...rest} value={telephone} onChange={(value)=>{
            onChange(value)
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
        return <Input {...rest} value={mobile} onChange={(value)=>{
            onChange(value)
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
        return <Input {...rest} value={number} onChange={(value)=>{
            onChange(value)
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
            (value)=>{
                onChange && onChange(value?1:0)
            }
        }></Checkbox>:<Checkbox  label={(meta||{}).label}  onChange={
            (value)=>{
                onChange && onChange(value?1:0)
            }
        }></Checkbox>
    }
}

export class DateField extends React.Component{
    toDate(value){
        if(!value){
            return new Date()
        }
        return moment(value).toDate()
    }
    fromDate(date){
        return moment(date).format("YYYY-MM-DD")
    }
    render(){
        const {onChange,value}=this.props
        let setValue=this.toDate(value)
        return <DatePicker onChange={(value)=>{
            let strValue=this.fromDate(value)
            onChange && onChange(strValue)}
        } value={setValue}></DatePicker>
    }
}

export class EmailField extends React.Component{
    getEmail(value){
        return value
    }
    render(){
        const {value,onChange,...rest}=this.props
        const email=this.getEmail(value)
        return <Input {...rest} value={email} onChange={(value)=>{
            onChange(value)
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
    }
    onChange(value){
        const {onChange,relationData}=this.props
        if(value!=="更多选择..."){
            onChange && onChange(value)
        }
        else{
            let path=getRoutePath(relationData.targetApp,
                relationData.targetModel,ViewType.LIST)
            const {store}=ReducerRegistry
            store.dispatch(push(path,{
                mode:"selectMode",
                app:relationData.targetApp,model:relationData.targetModel,viewType:ViewType.LIST
            }))
        }
    }
    render(){
        var self=this
        const {meta,value,relationData}=this.props
        let options=[]
        if(meta && meta.options){
            meta.options.map(r=>{
                options.push({
                    value:r["id"],
                    label:r[relationData.toName]
                })
            })
        }
        return <Select onChange={(value)=>{
           self.onChange(value)
        }} value={value}>
        {
          options.map(ds => {
            return (
              <Select.Option key={ds.value} label={ds.label} value={ds.value}>
                <span style={{float: 'left'}}>{ds.label}</span>
              </Select.Option>
            )
          })
        }
        <Select.Option key="__NONE__" value="更多选择..." label="更多选择...">
            <div>
                <span>更多选择...</span>
            </div>
        </Select.Option>
      </Select>
    }
}

export class CriteriaEnumSelect  extends React.Component{
    constructor(props){
        super(props)
        const {meta,name,key}=this.props
        this.state={
            selValue:meta.defaultValue,
            options:meta.options,
            key:key,
            name:name
        }
    }
    render(){
        const {onCriteriaChange}=this.props
        return <Select value={this.state.selValue} placeholder="请选择" onChange={(value)=>{onCriteriaChange && onCriteriaChange({
                expression: eq(this.state.name,value),
                key:this.state.key
            }
        );
        this.setState({selValue:value})}}>
        {
          this.state.options.map(vt => {
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
            <Input placeholder="最小值" value={this.state.minValue} onChange={(value)=>{
                    this.onValueChange({minValue:value})
            }}></Input> - <Input placeholder="最大值" value={this.state.maxValue} onChange={
                (value)=>{
                    this.onValueChange({maxValue:value})
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
    onChange(value){
        this.setState({value:value})
        const {onCriteriaChange,key,name}=this.props
        onCriteriaChange({
            key:key,
            expression:gt_eq(name,value)
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
    onChange(value){
        this.setState({value:value})
        const {onCriteriaChange,key,name}=this.props
        onCriteriaChange({
            key:key,
            expression:eq(name,value)
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
    onChange(value){
        this.setState({value:value})
        const {onCriteriaChange,ckey,name}=this.props
        onCriteriaChange(
            iLike(name,value),
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
    onChange(value){
        this.setState({value:value})
        const {onCriteriaChange,ckey,name}=this.props
        onCriteriaChange(
            like(name,value),
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
    onChange(value){
        this.setState({value:value})
        const {onCriteriaChange,ckey,name}=this.props
        onCriteriaChange(
            eq(name,value),
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
    onChange(value){
        if(!/^[0-9]{1,11}$/g.test(value) && value!=""){
            Notification.error({
                title: '手机号',
                message: '必须输入数字。。。'
              });
              return;
        }
        this.setState({value:value})
        const {onCriteriaChange,ckey,name}=this.props
        onCriteriaChange(
            eq(name,value),
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
    onChange(value){
        this.setState({value:value})
        const {onCriteriaChange,key,name}=this.props
        onCriteriaChange({
            key:key,
            expression:eq(name,value)
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
    onChange(value){
        this.setState({value:value})
        const {onCriteriaChange,key,name}=this.props
        onCriteriaChange({
            key:key,
            expression:eq(name,value)
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
    onChange(value){
        this.setState({value:value})
        const {onCriteriaChange,key,name}=this.props
        onCriteriaChange({
            key:key,
            expression:gt_eq(name,value)
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
    onChange(value){
        this.setState({value:value})
        const {onCriteriaChange,key,name}=this.props
        onCriteriaChange({
            key:key,
            expression:lt_eq(name,value)
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
    onChange(value){
        this.setState({value:value})
        const {onCriteriaChange,key,name}=this.props
        onCriteriaChange({
            key:key,
            expression:gt_eq(name,value)
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
    onChange(value){
        this.setState({value:value})
        const {onCriteriaChange,key,name}=this.props
        onCriteriaChange({
            key:key,
            expression:lt_eq(name,value)
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
    onChange(value){
        this.setState({value:value})
        const {onCriteriaChange,key,name}=this.props
        onCriteriaChange({
            key:key,
            expression:lt_eq(name,value)
        })
    }
    render(){
        return <DateRangePicker value={this.state.value} onChange={this.onChange}>
        </DateRangePicker>
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
        return <DateRangePicker value={this.state.value} onChange={this.onChange}>
        </DateRangePicker>
    }
}


