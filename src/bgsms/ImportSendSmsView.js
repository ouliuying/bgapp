import React from 'react'
import {connect} from 'react-redux'
import {
    withRouter,
    Redirect,
    Route,
    matchPath
} from 'react-router-dom'
import {Input,Form,Button,Switch,Row,Col,Select,DatePicker,Upload,Icon,message} from '../ui'
import hookView from '../app/HookView'
import moment from  'moment'
import {ModelAction} from '../app/mq/ModelAction'
import {ModalSheetManager} from '../app/modelView/ModalSheetManager'
import {mapStateToProps as createMapStateProps} from '../app/modelView/createViewMapStateToProps'
const { TextArea } = Input
const { Dragger } = Upload;
class ImportSendSmsView extends React.Component{
    constructor(props){
        super(props)
        this.state={
            uploadFile:[],
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
        let requestName = this.state.uploadFile[0]?this.state.uploadFile[0].response.requestName:undefined
        if(!requestName){
            ModalSheetManager.alert({
                title:"提示",
                msg:"先上传文件，然后发送！"
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
        new ModelAction(cmmHost.app,cmmHost.model).call("importSendSms",{
            requestName,
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

        const props = {
            name: 'file',
            multiple: false,
            withCredentials:true,
            showUploadList:{
                showPreviewIcon:true,
                showRemoveIcon:false
            },
            fileList:self.state.uploadFile,
            action: '/storage/upload/mobilefile',
            onChange:(info)=> {
              const { status } = info.file;
              if (status !== 'uploading') {
                console.log(info.file, info.fileList);
              }
              if (status === 'done') {
                  if(info.file.response.errorCode!=0){
                    self.setState({
                        uploadFile:[],
                        mobileDesc:`${info.file.name} 上传失败,${info.file.response.errorMsg}`
                    })
                    message.error(`${info.file.name} 上传失败,${info.file.response.errorMsg}`);
                    return;
                  }
                  else{
                    self.setState({
                        uploadFile:[info.file],
                        mobileDesc:`上传手机号码${info.file.response.bag.mobileCount}个`
                    })
                    message.success(`${info.file.name} 上传成功.`);
                    return;
                  }
               
              } else if (status === 'error') {
                self.setState({
                    uploadFile:[],
                    mobileDesc:`${info.file.name} 上传失败.`
                })
                message.error(`${info.file.name} 上传失败.`);
                return;
              }
              self.setState({
                uploadFile:[...info.fileList]
              })
            },
          };

        return <div className="bg-model-op-view bg-flex-full">
            <div className="bg-form-workarea">
                <Form layout='vertical'>
                    <Form.Item label={<><span>导入手机号码【每行一个】:</span><span style={{marginLeft:'12px',color:'red'}}>{self.state.mobileDesc}</span></>}>
                       

                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">点击或拖文件到该区域，上传号码文件</p>
                        <p className="ant-upload-hint">
                            每次只提交最后一上传的文件，支持文件类型：txt/csv/xls/xlsx
                        </p>
                    </Dragger>
 
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
export default hookView.withHook(withRouter(connect(mapStateToProps)(ImportSendSmsView)))

