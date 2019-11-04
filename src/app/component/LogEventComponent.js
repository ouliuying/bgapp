
import React from "react"
import {connect} from 'react-redux'
import {Button} from '../../ui'
import { ModelAction } from "../mq/ModelAction"
import eventRegistry from './logEventControl/logEventControlRegisty'
import moment from "moment"
import { getSvg } from "../../svg"
import { Icon } from "antd"
import { CriteriaNumberLessEqualInput } from "../modelView/ViewFieldType"
class EventControlHeader extends React.Component{
    render(){
        const {data} = this.props
        return <><div className="bg-model-event-log-container-event-logo">
                    {
                        (data.icon) && <img src={"/storage/file/" + data.icon} alt="" className="bg-model-event-log-container-event-logo-image"/>
                    }

                    {
                       !(data.icon) &&  (data.text) && <span className="bg-model-event-log-container-event-logo-text">{data.text}</span>
                    }
                    
                </div>

                <div className="bg-model-event-log-container-event-title">
                    {data.title} <span className="bg-model-event-log-container-event-title-time">{data.date}</span>
                </div>
        </>
    }
}

class EventControl extends React.Component{
    render(){
        const {data} = this.props
        let arr=[]
        if(data.data){
            try{
                arr = JSON.parse(data.data)
            }
            catch(err){

            }
        }
        let ctrlIcon = getSvg(data.ctrlIcon)
        return  <div className="bg-model-event-log-container-event">
                    <EventControlHeader data={data}/>
                    {
                        ctrlIcon && <Icon component={ctrlIcon} style={{marginRight:'0.2rem'}}></Icon> 
                    }
                    {
                        arr.map(item=>{
                            if(item instanceof Object){
                                let CtrlType =  eventRegistry.get(item.controlType)
                                return <CtrlType data={item.props} />
                            }
                            else{
                                return <span>{item}</span>
                            }
                        })
                    }
                </div>
    }
}
class LogEventComponent extends React.Component{
    constructor(props){
        super(props)
        this.state={
            editorControl:null
        }
    }
    render(){
        const {eventLogs,controlActions,onSaveEventLog} = this.props
        let self = this 
        let EditorControl = self.state.editorControl
        return <div className="bg-model-event-log-container">
            {
                controlActions && controlActions.length>0 &&<div className="bg-model-event-log-container-action-frame">
                    <div className="bg-model-event-log-container-actions">
                        {
                            controlActions.map(x=>{
                                return <Button type="primary" onClick={()=>{
                                    let EditorControl = eventRegistry.get(x.editor)
                                    self.setState({
                                        editorControl: EditorControl
                                    })
                                }}>{x.title}</Button>
                            })
                        }
                    </div>
                    {
                        EditorControl && <div className="bg-model-event-log-container-action-body">
                            <EditorControl onSave={onSaveEventLog}/>
                        </div>
                    }
                    
                </div>
            }
            {
                eventLogs.map(e=>{
                    return <EventControl data={e}/>
                })
            }
        </div>
    }
}

function mapStateToProps(state,ownProps){
    return Object.assign({},ownProps)
}

export default connect(mapStateToProps)(LogEventComponent)