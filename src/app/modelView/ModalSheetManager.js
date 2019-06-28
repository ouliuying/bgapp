import React from 'react'
import ReactDOM from 'react-dom'
import Dialog from 'rc-dialog'
import {Modal} from '../../ui'
import {ReactReduxContext} from 'react-redux'
import {openModalSheet,closeModalSheet} from '../actions/modalSheetQueue'
export class ModalSheet extends React.Component{
    constructor(props){
        super(props)
        let {sheetIndex}=this.props
        this.sheetIndex=sheetIndex
    }
    get index(){
        return this.sheetIndex
    }
    unHookElement(){
        closeModalSheet(this)
    }

    render(){
        let self = this
        const {view:ComView,sheetIndex,title,viewParam,...rest} = this.props
        let {external} = (viewParam||{})

        external=Object.assign(external||{},{
            close:()=>{
                self.unHookElement()
            }
        })
        let newViweParam = Object.assign({},viewParam,{external})
        //copy from element-react and antd
       return  <div className="bg-sheet-dialog" style={{zIndex:sheetIndex}}>
            <div class="bg-sheet-dialog-header">
                <span>标题</span>
                <button onClick={()=>{
                    self.unHookElement()
                }}>
                    <i aria-label="图标: close" className="anticon anticon-close ant-modal-close-icon">
                        <svg viewBox="64 64 896 896"  data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false">
                            <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z">
                                </path>
                                </svg></i>
                </button>
            </div>
            <div class="bg-sheet-dialog-body">
                <ComView  {...rest} inModalQueue={true} viewParam={newViweParam}></ComView> 
            </div>
       </div>
    }
}

class WaitingSheet extends React.Component{
    render(){
        let {sheetIndex} = this.props
        return <div style={{zIndex:sheetIndex}} className="bg-waiting-sheet">
            <div className="bg-waiting-sheet-show">
                <div className="bg-waiting-g bg-waiting-g1">

                </div>
                <div className="bg-waiting-g bg-waiting-g2">

                </div>
                <div className="bg-waiting-g bg-waiting-g3">

                </div>
                <div className="bg-waiting-g bg-waiting-g4">

                </div>
                <div className="bg-waiting-g bg-waiting-g5">

                </div>
                <div className="bg-waiting-g bg-waiting-g6">

                </div>
                <div className="bg-waiting-g bg-waiting-g7">

                </div>
                <div className="bg-waiting-g bg-waiting-g8">

                </div>
            </div>
        </div>
    }
}

class ConfirmSheet extends React.Component{
    constructor(props){
        super(props)
        this.state={
            show:true
        }
    }
    unHookElement(){
        const {sheetHookElement}= this.props
        if(sheetHookElement){
            try{
                document.body.removeChild(sheetHookElement)
            }
            catch{

            }
        
        }
    }

    render(){
        let self = this
        const {sheetIndex,title,msg,cancel,ok} = this.props
        let cCancel = cancel||function(){}
        let cOk = ok||function(){}
        return <Modal
                zIndex={sheetIndex}
                title={title}
                visible={this.state.show}
                destroyOnClose={true}
                afterClose={()=>{
                    this.unHookElement();
                }}
                onOk={()=>{
                    this.setState({
                        show:false
                    })
                    cOk()}
                }
                onCancel={
                    ()=>{cCancel()
                    this.setState({
                        show:false
                    })
                }
                }
                okText="确认"
                cancelText="取消"
                >
                     <span>{msg}</span>
                </Modal>
    }
}

class AlertSheet extends React.Component{
    constructor(props){
        super(props)
        this.state={
            show:true
        }
    }
    unHookElement(){
        const {sheetHookElement}= this.props
        try{
            document.body.removeChild(sheetHookElement)
        }
        catch(err){
            console.log(err)

        }
    }
    render(){
        let self = this
        const {sheetIndex,title,msg} = this.props
        return <div><Modal
                zIndex={sheetIndex}
                title={title}
                destroyOnClose={true}
                visible={this.state.show}
                onCancel={()=>{
                    this.unHookElement();
                    this.setState({
                        show:false
                    })
                }}
                onOk={()=>{
                    this.unHookElement();
                    this.setState({
                        show:false
                    })
                }}
                afterClose={()=>{
                }}
                okText="确认"
                cancelText="取消"
                >
              <span>{msg}</span>
        </Modal>
        </div>
    }
}


export const ModalSheetManager={
    sheetIndex:20000,
    openModal(view,props){
      let sheetIndex = this.nextSheetIndex()
      openModalSheet(view,props,sheetIndex)
    }
    ,nextSheetIndex(){
        return this.sheetIndex++
    },
    openWaiting(props){
        var hookDiv = document.createElement("div")
        document.body.appendChild(hookDiv)
        let sheetIndex = this.nextSheetIndex()
        ReactDOM.render(<WaitingSheet  {...props} sheetIndex={sheetIndex}/>,hookDiv)
        return function(){
            try{
                document.body.removeChild(hookDiv)
            }
            catch(err){

            }
           
        }
    },
    openConfirm(props){
        let sheetIndex = this.nextSheetIndex()
        const {title,msg,ok,cancel} =props
        let cCancel = cancel||function(){}
        let cOk = ok||function(){}
        let confirm=Modal.confirm({
            zIndex:sheetIndex,
            onCancel:()=>{
                cCancel()
                confirm.destroy()
            },
            onOk:()=>{
                cOk()
                confirm.destroy()
            }
        })
        confirm.update({
            title:title,
            content:msg
        })
    },
    openAlert(props){
        let sheetIndex = this.nextSheetIndex()
        const{title,msg}=props
        let alert=Modal.info({
            zIndex:sheetIndex,
            onCancel:()=>{
                alert.destroy()
            },
            onOk:()=>{
                alert.destroy()
            }
        })
        alert.update({
            title:title,
            content:msg
        })
    }
}

