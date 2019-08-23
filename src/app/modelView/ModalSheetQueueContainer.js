import React from 'react'
import {connect} from 'react-redux'
import  {getModalSheetQueue} from '../reducers/modalSheetQueue'
import {ModalSheet} from './ModalSheetManager'
class ModalSheetQueueContainer extends React.Component{
    render(){
        const {modalSheetQueue} = this.props
        return <>
            {
                Object.keys(modalSheetQueue||{}).length>0?<div className="bg-sheet-queue-container-lay">
                {
                    Object.keys(modalSheetQueue||{}).map(function(key){
                        let sheet = modalSheetQueue[key]
                        let props = {sheetIndex:key,view:sheet.view,...sheet.props}
                         return <ModalSheet {...props} key={key}></ModalSheet>
                    })
                }
                </div>:null
            }
        </>
    }
}

function mapStateToProps(state){
    return getModalSheetQueue(state)
}

export default connect(mapStateToProps)(ModalSheetQueueContainer)
