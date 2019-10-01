


import React from 'react'
import {connect} from 'react-redux'
import {
    withRouter,
    Switch,
    Route
} from 'react-router-dom'
import {push} from 'connected-react-router'
import {Button,Table,Pagination,Tag,Row, Col,Icon as FontIcon,Divider,Upload,message} from "../ui"
import hookView from '../app/HookView'
import ListView from '../app/modelView/ListView'
import { imageListViewMapStateToProps } from './stateMapProps/imageListViewStateToProps'

class ImageListView extends React.Component{
    constructor(props){
        super(props)
        const {cmmHost,parent}=this.props
        if(!parent){
            this.cmmHost=cmmHost
            this.cmmHost.init(this)
        }
        else{
            this.parent=parent
            this.cmmHost=cmmHost
        }
        this.state={
            uploadFile:[]
        }
    }
    
    componentDidMount(){
       // console.log("listview componentDidMount")
       // window.addEventListener("resize", ()=>{this.windowSizeUpdate()});
        this.cmmHost.didMount(this)
    }
    componentWillUnmount(){
       // window.removeEventListener("resize", ()=>{this.windowSizeUpdate()});
    }
    componentWillMount(){
      //  this.windowSizeUpdate();
    }

    windowSizeUpdate(){
        try
        {
            var w = window,
            d = document,
            documentElement = d.documentElement,
            body = d.getElementsByTagName('body')[0],
            width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
            height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight;
            this.setState({width: width, height: height});
        }
        catch(err){

        }
    }

    overrideRender(hookTag,props){
        const self = this
        const {viewParam,viewData} = self.props
        let {localData} = self.props
        const {ownerField} = (viewParam||{})
        let {criterias, triggerGroups,subViews} = viewData
        triggerGroups=triggerGroups||[]
        switch(hookTag){
            case "list-view-action-items":
                {
                    const groups=["main"]
                    let tGroups = triggerGroups.filter(x=>{
                        return groups.indexOf(x.name)>-1
                    })
                    const props = {
                        name: 'file',
                        action: '/storage/upload/image',
                        withCredentials:true,
                        fileList:self.state.uploadFile,
                        showUploadList:{
                            showPreviewIcon:true,
                            showRemoveIcon:false
                        },
                        headers: {
                          authorization: 'authorization-text',
                        },
                        onChange(info) {
                          if (info.file.status !== 'uploading') {
                            console.log(info.file, info.fileList);
                          }
                          if (info.file.status === 'done') {
                              if(info.file.response.errorCode!=0){
                                message.error(`${info.file.name}上传失败!`);
                                self.setState({
                                    uploadFile:[]
                                })
                                return
                              }
                              else{
                                message.success(`${info.file.name}上传成功!`);
                                self.setState({
                                    uploadFile:[info.file]
                                })
                                self.cmmHost.didMount(self)
                                return
                              }
                          } else if (info.file.status === 'error') {
                            message.error(`${info.file.name} 上传失败.`);
                            self.setState({
                                uploadFile:[]
                            })
                            return
                          }
                          self.setState({
                            uploadFile:[...info.fileList]
                          })
                        }
                    }
                    return <div className="bg-list-view-action-search-section">
                                <div className="bg-list-view-action">
                                    <Upload {...props}>
                                        <Button>
                                        <FontIcon type="upload" /> 上传文件
                                        </Button>
                                    </Upload>
                                </div>
                            </div>
                }
              
            default:
                    return null
        }
    }
    render(){
        const self=this
        self.cmmHost.update(this)
        return  <hookView.HookProvider value={{cmmHost:self.cmmHost,parent:self}}>
                    <ListView {...self.props}></ListView>
                </hookView.HookProvider>
       
    }
}

export default hookView.withHook(withRouter(connect(imageListViewMapStateToProps)(ImageListView)))