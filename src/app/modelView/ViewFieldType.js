import React from 'react'
import {Input,DatePicker,Select,notification ,Button,Upload,Checkbox,Icon as FontIcon} from "../../ui"

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
        return <div className="bg-many2one-select-co"><Select onChange={(idValue)=>{
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
  
            <Button type="text" onClick={()=>{
                    self.selMore()
            }} className="bg-many2one-select-more-btn">
                <FontIcon type="search" />
            </Button>
          
      </div>
    }
}

//export const Many2OneDataSetSelectField = withRouter(InnerMany2OneDataSetSelectField)

export class CriteriaEnumSelect  extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        const {onChange,fd,value}=this.props
        let meta = fd.meta
        return <Select value={value} placeholder="请选择" onChange={(value)=>{onChange && onChange(value)}}>
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
    }
    onValueChange(value){
        const {onChange}=this.props
        onChange&&onChange(value)
    }
    render(){
        let {value} = this.props
        let [minValue,maxValue] =[undefined,undefined]
        if(value instanceof Array){
            minValue=value[0]
            maxValue=value[1]
        }
        return <div>
            <Input placeholder="最小值" value={minValue} onChange={(evt)=>{
                    this.onValueChange([evt.target.value,maxValue])
            }}></Input> - <Input placeholder="最大值" value={maxValue} onChange={
                (evt)=>{
                    this.onValueChange([minValue,evt.target.value])
                }
            }></Input>
        </div>
    }
}
export class CriteriaNumberLessEqualInput extends React.Component{
    constructor(props){
        super(props)
    }
    onChange(value){
        const {onChange}=this.props
        onChange&&onChange(value)
    }
    render(){
        let {value}=this.props
        return <Input value={value} onChange={(evt)=>{this.onChange(evt.target.value)}}>
        </Input>
    }
}

export class CriteriaNumberGreaterEqualInput extends React.Component{
    constructor(props){
        super(props)
    }
    onChange(value){
        const {onChange}=this.props
        onChange && onChange(value)
    }
    render(){
        const {value}=this.props
        return <Input value={value} onChange={(evt)=>{
            this.onChange(evt.target.value)
        }}>
        </Input>
    }
}

export class CriteriaNumberEqualInput extends React.Component{
    constructor(props){
        super(props)
    }
    onChange(value){
        const {onChange}=this.props
        onChange&&onChange(value)
    }
    render(){
        const {value}=this.props
        return <Input value={value} onChange={(evt)=>{
            this.onChange(evt.target.value)
        }}>
        </Input>
    }
}
export class CriteriaStringILikeEqualInput extends React.Component{
    constructor(props){
        super(props)
    }
    onChange(value){
        const {onChange}=this.props
        onChange&&onChange(value)
    }
    render(){
        let {value,title}=this.props
        return <Input value={value} onChange={(evt)=>{
            this.onChange(evt.target.value)
        }} placeholder={title}>
        </Input>
    }
}

export class CriteriaStringLikeEqualInput extends React.Component{
    constructor(props){
        super(props)
    }
    onChange(value){
        const {onChange}=this.props
        onChange&&onChange(value)
    }
    render(){
        const {value,title}=this.props
        return <Input value={value} onChange={()=>{
            this.onChange(value)
        }} placeholder={title}>
        </Input>
    }
}

export class CriteriaStringEqualInput extends React.Component{
    constructor(props){
        super(props)
    }
    onChange(value){
        const {onChange}=this.props
        onChange&&onChange(value)
    }
    render(){
        const {value,title}=this.props
        return <Input value={value} onChange={(evt)=>this.onChange(evt.target.value)} placeholder={title}>
        </Input>
    }
}

export class CriteriaMobileEqualInput extends React.Component{
    constructor(props){
        super(props)
    }
    onChange(value){
       const {onChange}=this.props
       onChange && onChange(value)
    }
    render(){
        const {value,title}=this.props
        return <Input value={value} onChange={(evt)=>this.onChange(evt.target.value)} placeholder={title}>
        </Input>
    }
}
export class CriteriaDateEqualInput extends React.Component{
    constructor(props){
        super(props)
    }
    onChange(value){
        const {onChange}=this.props
        let strValue = value.format("YYYY-MM-DD")
        onchange && onChange(strValue)
    }
    render(){
        const {value}=this.props
        let mValue=moment(value,["YYYY-MM-DD HH:mm:ss","YYYY-MM-DD"])
        return <DatePicker value={mValue} onChange={evt=>{
            this.onChange(evt.target.value)
        }}>
        </DatePicker>
    }
}

export class CriteriaDateTimeEqualInput extends React.Component{
    constructor(props){
        super(props)
    }
    onChange(value){
        const {onChange}=this.props
        let strValue = value.format("YYYY-MM-DD")
        onchange && onChange(strValue)
    }
    render(){
        const {value}=this.props
        let mValue=moment(value,["YYYY-MM-DD HH:mm:ss","YYYY-MM-DD"])
        return <DatePicker value={mValue} onChange={evt=>{
            this.onChange(evt.target.value)
        }}>
        </DatePicker>
    }
}

export class CriteriaDateRangeInput extends React.Component{
    constructor(props){
        super(props)
    }
    onChange(value){
       
    }
    render(){
        return <RangePicker value={this.state.value} onChange={evt=>{
            this.onChange(evt.target.value)
        }}>
        </RangePicker>
    }
}

export class CriteriaDateTimeRangeInput extends React.Component{
    constructor(props){
        super(props)
    
    }
    onChange(value){
        const {onChange}=this.props
        let strValue = value[0].format("YYYY-MM-DD HH:mm:ss")
        let strValue2 = value[1].format("YYYY-MM-DD HH:mm:ss")
        onchange && onChange([strValue,strValue2])
    }
    render(){
        const {value}=this.props
        let mValue=moment(value[0],["YYYY-MM-DD HH:mm:ss","YYYY-MM-DD"])
        let mValue2=moment(value[1],["YYYY-MM-DD HH:mm:ss","YYYY-MM-DD"])
        return <RangePicker value={[mValue,mValue2]} onChange={evt=>{
            this.onChange(evt.target.value)
        }}>
        </RangePicker>
    }
}


