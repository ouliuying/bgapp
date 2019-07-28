import React from 'react'
import {connect} from 'react-redux'
import {mapStateToProps as createMapStateProps} from '../app/modelView/createViewMapStateToProps'
import {
    withRouter,
    Redirect,
    Route,
    matchPath
} from 'react-router-dom'
import {Input,Form,Button,Switch,Row,Col,Select,DatePicker} from '../ui'
import hookView from '../app/HookView'
import moment from  'moment'
import {ModelAction} from '../app/mq/ModelAction'
import {ModalSheetManager} from '../app/modelView/ModalSheetManager'
const { TextArea } = Input

class SendSmsView extends React.Component{
    constructor(props){
        super(props)
        this.state={
            mobiles:"",
            message:"",
            rmRepeat:true,
            timerValue:moment(),
            timerType:-1,
            mobileDesc:"",
            messageDesc:""
        }
    }
    updateStatus(opts){
        this.setState(opts)
    }
    getMobileCount(mobiles){
        let items = mobiles.split(/\r|\n/)
        let count=0
        for(let item of items){
            if(/^1[3456789]\d{9}$/.test(item)){
                count=count+1
            }
        }
        return count
    }
    doSendSms(){
        const {cmmHost} = this.props
        const {mobiles,message,rmRepeat,timerValue,timerType} = this.state
        let strTimerValue = timerValue.format("YYYY-MM-DD HH:mm:ss")
        if(this.getMobileCount(mobiles)<1){
            ModalSheetManager.alert({
                title:"提示",
                msg:"输入正确的手机号码！"
            })
            return
        }
        if(message.length<1){
            ModalSheetManager.alert({
                title:"提示",
                msg:"短信内容不能为空"
            })
            return
        }
        new ModelAction(cmmHost.app,cmmHost.model).call("sendSms",{
            mobiles,
            message,
            rmRepeat,
            timerValue:strTimerValue,
            timerType
        },(res)=>{
            if(res.errorCode==0){
                ModalSheetManager.alert({
                    title:"提示",
                    msg:"发送成功"
                })
            }
            else{
                ModalSheetManager.alert({
                    title:"提示",
                    msg:res.description
                })
            }

        },(res)=>{
            ModalSheetManager.alert({
                title:"提示",
                msg:"提交失败"
            })
        })
    }
    render(){
        const {cmmHost} = this.props
        cmmHost.update(this)
        let self=this
        return <div className="bg-model-op-view bg-flex-full">
            <div className="bg-form-workarea">
                <Form layout='vertical'>
                    <Form.Item label={<><span>手机号码【每行一个】:</span><span style={{marginLeft:'12px',color:'red'}}>{self.state.mobileDesc}</span></>}>
                         <TextArea rows={8} value={self.state.mobiles}  onChange={(evt)=>{
                                let mobileDesc=`已经输入了${self.getMobileCount(evt.target.value)}个号码！`
                                self.updateStatus({mobiles:evt.target.value,mobileDesc:mobileDesc})
                         }}/>
                    </Form.Item>
                    <Form.Item>

                            <div class="bg-sms-attach-controls">
                                <div>
                                    <span>去除重复</span> <Switch checkedChildren="是" unCheckedChildren="否" checked={self.state.rmRepeat} onChange={(value)=>{
                                        self.updateStatus({
                                            rmRepeat:value
                                        })
                                    }}/>
                                </div>
                                <div>
                                    <span>定时类型</span>  <Select defaultValue="-1" style={{ width: 120 }} onChange={(value)=>{
                                            self.updateStatus({
                                                timerType:value
                                            })
                                    }}>
                                                            <Select.Option value="-1">普通短信</Select.Option>
                                                            <Select.Option value="0">定时一次</Select.Option>
                                                            </Select>
                                </div>
                                {
                                        this.state.timerType>-1 && <div>
                                        <span>时间</span><DatePicker showTime placeholder="选择时间" value={self.state.timerValue} onChange={(dt)=>{
                                            self.updateStatus({
                                                timerValue:dt
                                            })
                                        }} onOk={(dt)=>{
                                            self.updateStatus({
                                                timerValue:dt
                                            })
                                        }} />
                                        </div>
                                }
                                
                            </div>
                        
                    </Form.Item>
                    <Form.Item label={<><span>短信内容:</span><span style={{marginLeft:'12px',color:'red'}}>{self.state.messageDesc}</span></>}>
                        <TextArea rows={4} value={self.state.message} onChange={(evt)=>{
                            let messageDesc=`短信内容有${evt.target.value.length}个字`
                            self.updateStatus({
                                message:evt.target.value,
                                messageDesc:messageDesc
                            })
                        }}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={()=>{
                            self.doSendSms()
                        }}>确定发送</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    }
}
function mapStateToProps(state,ownProps){
    let props= createMapStateProps(state,ownProps)
    return props
}
export default hookView.withHook(withRouter(connect(mapStateToProps)(SendSmsView)))


