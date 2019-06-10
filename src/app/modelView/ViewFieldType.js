import React from 'react'
import {Input,DatePicker,Select,notification ,Button,Upload,Checkbox,Icon as FontIcon,Row,Col,Cascader} from "../../ui"

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
import chinaArea from '../../lib/china-area'
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
    StaticField:'static',
    ChinaFullAddress:'chinaFullAddress',


    //criteria
    CriteriaEnumSelect:"criteriaSelect",
    CriteriaNumberRangeInput:"criteriaNumberRange",
    CriteriaNumberLessEqualInput:"criteriaNumberLessEqual",
    CriteriaNumberGreaterEqualInput:"criteriaNumberGreaterEqual",
    CriteriaNumberEqualInput:"criteriaNumberEqual",
    CriteriaStringILikeEqualInput:"criteriaStringILike",
    CriteriaStringLikeEqualInput:"criteriaStringLike",
    CriteriaStringEqualInput:"criteriaStringEqual",
    CriteriaDateEqualInput:"criteriaDateEqual",
    CriteriaDateTimeEqualInput:"CriteriaDateTimeEqual",
    CriteriaDateRangeInput:"criteriaDateRange",
    CriteriaDateTimeRangeInput:"criteriaDateTimeRange",
    CriteriaMobileEqualInput:"criteriaMobileEqual"
}

export class StaticField extends React.Component{
    getText(value){
        if(typeof value ==="string"){
            return value
        }
        return JSON.stringify(value)
    }
    render(){
        const {value} = this.props
        return <span>
                {this.getText(value)}
        </span>
    }
}

export class TextField extends React.Component{
    render(){
        const {type,value,onChange,enable}=this.props
        try{
            return type==="singleLine"?(
                <Input placeholder="请输入内容" disabled={!enable}  value={value} onChange={(evt)=>{
                    onChange(evt.target.value)
                }}/>
            ):(
                <TextArea value={value} placeholder="请输入内容" disabled={!enable} onChange={(evt)=>{
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
        const {enable,...rest} = this.props
        return <TextField type="singleLine" enable={enable} {...rest}>
            
        </TextField>
    }
}
export class MultiLineTextField extends React.Component{
    render(){
        const {enable,...rest} = this.props
        return <TextField type="multiLine" enable={enable} {...rest}>
        
        </TextField>
    }
}
export class TelephoneField extends React.Component{
    getTelephone(value){
        return value
    }
    render(){
        const {value,onChange,enable,...rest}=this.props
        const telephone=this.getTelephone(value)
        return <Input {...rest} value={telephone} disabled={!enable} onChange={(evt)=>{
            onChange(evt.target.value)
        }} placeholder="输入电话号码"></Input>
    }
}
export class MobileField extends React.Component{
    getMobile(value){
        return value
    }
    render(){
        const {value,onChange,enable,...rest}=this.props
        const mobile=this.getMobile(value)
        return <Input {...rest} value={mobile} disabled={!enable} onChange={(evt)=>{
            onChange(evt.target.value)
        }} placeholder="输入手机号码"></Input>
    }
}
export class NumberField extends React.Component{
    getNumber(value){
        return value
    }
    render(){
        const {value,onChange,getNumber,enable,...rest}=this.props
        const number=(getNumber||this.getNumber)(value)
        return <Input {...rest} value={number} disabled={!enable} onChange={(evt)=>{
            onChange(evt.target.value)
        }}></Input>
    }
}
export class RealField extends React.Component{
    render(){
        const {enable,...rest} = this.props
        return <NumberField enable={enable} {...rest} getNumber={(value)=>{
            return value
        }}>
        </NumberField>
    }
}
export class LongField extends React.Component{
    render(){
        const {enable,...rest} = this.props
        return <NumberField enable={enable} {...rest} getNumber={(value)=>{
            return value
        }}>
        </NumberField>
    }
}

export class IntField extends React.Component{
    render(){
        const {enable,...rest} = this.props
        return <NumberField enable={enable} {...rest} getNumber={(value)=>{
            return value
        }}>
        </NumberField>
    }
}
export class ImageUploadField extends React.Component{
    render(){
        const {enable,...rest} = this.props
        return <SingleLineTextField enable={enable} {...rest}></SingleLineTextField>
    }
}

export  class AvatarField extends React.Component{
    render(){
        const {enable,...rest} = this.props
        return <div className="bg-avatar">
            <Upload action="#" disabled={!enable} {...rest}>
                <Icon.UploadIcon></Icon.UploadIcon>
            </Upload>
            </div>
    }
}

export class SingleCheckBoxField extends React.Component{
    render(){
        const{meta,value,enable,onChange}=this.props
        let checked = false
        if(value==1){
            checked=true
        }
        return <Checkbox  checked={checked} label={(meta||{}).label} disabled={!enable}   onChange={
            (evt)=>{
                onChange && onChange(evt.target.checked?1:0)
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
            const {onChange,value,enable}=this.props
            let setValue = this.toDate(value)
            return <DatePicker disabled ={!enable} onChange={(value)=>{
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
        const {value,onChange,enable,...rest}=this.props
        const email=this.getEmail(value)
        return <Input {...rest} disabled={!enable} value={email} onChange={(evt)=>{
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
            let view = getModelView(relationData.targetApp,
                relationData.targetModel,
                ViewType.LIST)
            let viewParam = createViewParam(undefined,
                undefined,
                undefined,
                external,
                undefined)
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
        const {meta,value,relationData,enable,ctrlProps}=this.props
        const {moreBtn} = ctrlProps||{}
        console.log("ctrlProps = "+ctrlProps)
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
        return <div className="bg-many2one-select-co"><Select disabled={!enable} onChange={(idValue)=>{
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
    {
        (moreBtn!==false && enable)?<Button type="text" onClick={()=>{
            self.selMore()
    }} className="bg-many2one-select-more-btn">
        <FontIcon type="search" />
        </Button>:null
    }
      
          
      </div>
    }
}

//export const Many2OneDataSetSelectField = withRouter(InnerMany2OneDataSetSelectField)

export class CriteriaEnumSelect  extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        const {onChange,fd,enable,value}=this.props
        let meta = fd.meta
        return <Select disabled={!enable} value={value} placeholder="请选择" onChange={(value)=>{onChange && onChange(value)}}>
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
        let {value,enable} = this.props
        let [minValue,maxValue] =[undefined,undefined]
        if(value instanceof Array){
            minValue=value[0]
            maxValue=value[1]
        }
        return <div>
            <Input disabled={!enable} placeholder="最小值" value={minValue} onChange={(evt)=>{
                    this.onValueChange([evt.target.value,maxValue])
            }}></Input> - <Input disabled={!enable} placeholder="最大值" value={maxValue} onChange={
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
        let {value,enable}=this.props
        return <Input disabled={!enable} value={value} onChange={(evt)=>{this.onChange(evt.target.value)}}>
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
        const {value,enable}=this.props
        return <Input disabled={!enable} value={value} onChange={(evt)=>{
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
        const {value,enable}=this.props
        return <Input disabled={!enable} value={value} onChange={(evt)=>{
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
        let {value,title,enable}=this.props
        return <Input disabled={!enable} value={value} onChange={(evt)=>{
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
        const {value,title,enable}=this.props
        return <Input disabled={!enable} value={value} onChange={()=>{
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
        const {value,title,enable}=this.props
        return <Input disabled={!enable} value={value} onChange={(evt)=>this.onChange(evt.target.value)} placeholder={title}>
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
        const {value,title,enable}=this.props
        return <Input disabled={!enable} value={value} onChange={(evt)=>this.onChange(evt.target.value)} placeholder={title}>
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
        const {value,enable}=this.props
        let mValue=moment(value,["YYYY-MM-DD HH:mm:ss","YYYY-MM-DD"])
        return <DatePicker disabled={!enable} value={mValue} onChange={evt=>{
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
        const {value,enable}=this.props
        let mValue=moment(value,["YYYY-MM-DD HH:mm:ss","YYYY-MM-DD"])
        return <DatePicker disabled={!enable} value={mValue} onChange={evt=>{
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
        const {enable} = this.props
        return <RangePicker disabled={!enable} value={this.state.value} onChange={evt=>{
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
        const {value,enable}=this.props
        let mValue=moment(value[0],["YYYY-MM-DD HH:mm:ss","YYYY-MM-DD"])
        let mValue2=moment(value[1],["YYYY-MM-DD HH:mm:ss","YYYY-MM-DD"])
        return <RangePicker disabled={!enable} value={[mValue,mValue2]} onChange={evt=>{
            this.onChange(evt.target.value)
        }}>
        </RangePicker>
    }
}

export class ChinaFullAddress extends React.Component{
    constructor(props){
        super(props)
        this.options = []
        chinaArea.map(p=>{
            let option = {
                label:p.p,
                value:p.p,
                children:[]
            }
            p.cs.map(c=>{
                let ci = {
                    label:c.c,
                    value:c.c,
                    children:[]
                }
                c.s.map(s=>{
                    let si={
                        label:s,
                        value:s
                    }
                    ci.children.push(si)
                })
                option.children.push(ci)
            })
            this.options.push(option)
        })
    }

    render(){
        const {onChange,value,enable} = this.props
        let jVal ={}
        try
        {
            jVal=JSON.parse(value)
        }
        catch{
            jVal={
                province:"",
                city:"",
                district:"",
                streetAddress:""
            }
        }
        let rVal = [jVal.province,jVal.city,jVal.district]
        if(rVal[0]=="" || rVal[0]==null || rVal[0]==undefined){
            rVal=undefined
        }
        return <div>
                <div>
                    <Cascader disabled={!enable} placeholder="选择 省份/市/区/县" value={rVal} options={this.options} onChange={
                        v=>{
                            let nVal= Object.assign({},jVal,{province:v[0],city:v[1],district:v[2]})

                            onChange(JSON.stringify(nVal))
                        }
                    }></Cascader>
                </div>
                <div>
                   <Input placeholder="街道/乡/村信息" value={jVal.streetAddress} onChange={
                       evt=>{
                            let nVal= Object.assign({},jVal,{streetAddress:evt.target.value})
                            onChange(JSON.stringify(nVal))
                       }
                   }></Input>
                </div>
        </div>
    }
}


