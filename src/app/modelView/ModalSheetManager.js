import React from 'react'
import ReactDOM from 'react-dom'
import {Dialog,Button} from '../../ui'


class ModalSheet extends React.Component{
    unHookElement(){
        const {sheetHookElement}= this.props
        if(sheetHookElement){
            let sheeHookCell = document.querySelector("#sheethookcell")
            sheeHookCell.removeChild(sheetHookElement)
        }
        sheetHookElement=null
    }
    componentDidMount(){
        const {sheetIndex} = this.props
        let sheetTag = "sheet" + sheetIndex
        let selfSheetDom = document.querySelector("div[sheetTag='"+sheetTag+"'] > .el-dialog__wrapper")
        if(selfSheetDom){
            selfSheetDom.style=selfSheetDom.style||{}
            selfSheetDom.style["z-index"]=sheetIndex 
        }
    }
    render(){
        let self = this
        const {view:ComView,sheetHookElement,sheetIndex,title,...rest} = this.props
        let {external} = this.props
        external=Object.assign(external||{},{
            close:()=>{
                self.unHookElement()
            }
        })
        let sheetTag = "sheet" + sheetIndex
        return <div sheetTag={sheetTag}>
                    <Dialog  title={title}
                            closeOnClickModal={false}
                            size="large"
                            visible={true}
                            onCancel={ () => {self.unHookElement()} }
                            onClose={()=>{
                                self.unHookElement()
                            }}
                        >
                        <Dialog.Body>
                            <ComView external={external} {...rest}></ComView>
                        </Dialog.Body>
                        <Dialog.Footer>
                        </Dialog.Footer>
                    </Dialog>
                </div>
    }
}

class WaitingSheet extends React.Component{
    render(){
        let {sheetIndex} = this.props
        return <div style={{zIndex:sheetIndex}} className="bg-waiting-sheet">
                <svg xmlns="http://www.w3.org/2000/svg" width="180" height="80" version="1.1">
                    <rect fill="red" width="100" height="60"></rect>
                </svg>
        </div>
    }
}

class ConfirmSheet extends React.Component{
    
    unHookElement(){
        const {sheetHookElement}= this.props
        if(sheetHookElement){
            document.body.removeChild(sheetHookElement)
        }
        sheetHookElement=null
    }

    componentDidMount(){
        const {sheetIndex} = this.props
        let sheetTag = "sheet" + sheetIndex
        let selfSheetDom = document.querySelector("div[sheetTag='"+sheetTag+"'] > .el-dialog__wrapper")
        if(selfSheetDom){
            selfSheetDom.style=selfSheetDom.style||{}
            selfSheetDom.style["z-index"]=sheetIndex 
        }
    }

    render(){
        let self = this
        const {sheetIndex,title,msg,cancel,ok} = this.props
        let cCancel = cancel||function(){}
        let cOk = ok||function(){}
        let sheetTag = "sheet" + sheetIndex
        return <div sheetTag={sheetTag}>
            <Dialog
                title={title}
                size="tiny"
                visible={ true }
                onCancel={ () =>{ cCancel();self.unHookElement(); }}
                lockScroll={ false }
            >
                <Dialog.Body>
                <span>{msg}</span>
                </Dialog.Body>
                <Dialog.Footer>
                <Button onClick={ () =>{ cCancel();self.unHookElement(); }}>取消</Button>
                <Button type="primary" onClick={ () => {
                    cOk();
                    self.unHookElement();
                } }>确定</Button>
                </Dialog.Footer>
            </Dialog>
        </div>
    }
}

class AlertSheet extends React.Component{
    unHookElement(){
        const {sheetHookElement}= this.props
        if(sheetHookElement){
            document.body.removeChild(sheetHookElement)
        }
        sheetHookElement=null
    }

    componentDidMount(){
        const {sheetIndex} = this.props
        let sheetTag = "sheet" + sheetIndex
        let selfSheetDom = document.querySelector("div[sheetTag='"+sheetTag+"'] > .el-dialog__wrapper")
        if(selfSheetDom){
            selfSheetDom.style=selfSheetDom.style||{}
            selfSheetDom.style["z-index"]=sheetIndex 
        }
    }

    render(){
        let self = this
        const {sheetIndex,title,msg} = this.props
        let sheetTag = "sheet" + sheetIndex
        return <div sheetTag={sheetTag}>
            <Dialog
                title={title}
                size="tiny"
                visible={ true}
                onCancel={()=>self.unHookElement()}
                lockScroll={false}>
                <Dialog.Body>
                <span>{msg}</span>
                </Dialog.Body>
                <Dialog.Footer>
                <Button type="primary" onClick={ () => {
                    self.unHookElement()
                } }>确定</Button>
                </Dialog.Footer>
            </Dialog>
        </div>
    }
}


export const ModalSheetManager={
    sheetIndex:20000,
    openModal(view,props){
      let hookDiv = document.createElement("div")
      let sheeHookCell = document.querySelector("#sheethookcell")
      sheeHookCell.appendChild(hookDiv)
      let sheetIndex = this.nextSheetIndex()
      ReactDOM.render(<ModalSheet view={view} {...props} sheetIndex={sheetIndex} sheetHookElement={hookDiv}/>,hookDiv)
    }
    ,nextSheetIndex(){
        return this.sheetIndex++
    },
    openWaiting(props){
        let hookDiv = document.createElement("div")
        document.body.appendChild(hookDiv)
        let sheetIndex = this.nextSheetIndex()
        ReactDOM.render(<WaitingSheet  {...props} sheetIndex={sheetIndex}/>,hookDiv)
        return function(){
            document.body.removeChild(hookDiv)
        }
    },
    openConfirm(props){
        let hookDiv = document.createElement("div")
        document.body.appendChild(hookDiv)
        let sheetIndex = this.nextSheetIndex()
        ReactDOM.render(<ConfirmSheet  {...props} sheetIndex={sheetIndex} sheetHookElement={hookDiv}/>,hookDiv)
    },
    openAlert(props){
        let hookDiv = document.createElement("div")
        document.body.appendChild(hookDiv)
        let sheetIndex = this.nextSheetIndex()
        ReactDOM.render(<AlertSheet  {...props} sheetIndex={sheetIndex} sheetHookElement={hookDiv}/>,hookDiv)
    }
}

