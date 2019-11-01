
import React from "react"
import {connect} from 'react-redux'
import {Button} from '../../ui'
import { ModelAction } from "../mq/ModelAction"
import logEventLogControl from './logEventControl/logEventControlRegisty'
import moment from "moment"
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
        return  <div className="bg-model-event-log-container-event">
                    <EventControlHeader data={data}/>
                    {
                        arr.map(item=>{
                            if(item instanceof Object){
                                let CtrlType =  logEventLogControl.get(item.controlType)
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
 


    render(){
        const {eventLogs} = this.props
        return <div className="bg-model-event-log-container">
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