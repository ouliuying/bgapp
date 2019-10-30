import React from 'react'
import {Tag, Icon, List, Avatar} from '../ui'
import { ModelAction } from '../app/mq/ModelAction'
import moment from 'moment'

class CrmSalesTopListView extends React.Component{
    constructor(props){
        super(props)
        this.state={
                timeSpanType:0,
                data:[]
        }
    }

    getTimeSpan(timeSpanType){
        let startDate=undefined
        let endDate = undefined
        if(timeSpanType == 0){
            let wd = new Date().getDay()
            let nw = moment()
            let nw2 = nw.clone()
            startDate = nw.add("days", 0-wd)
            endDate = nw2.add("days", 7-wd + 2)
        }
        else if(timeSpanType == 1){
            startDate =   moment(moment().format("YYYY-MM-01 00:00:00"),"YYYY-MM-DD HH:mm:ss")
            let startDate2 = startDate.clone()
            endDate = startDate2.add("months",1)

        }
        else if(timeSpanType ==2 ){
            startDate =  moment(moment().format("YYYY-01-01 00:00:00"),"YYYY-MM-DD HH:mm:ss")
            let startDate2 = startDate.clone()
            endDate =  startDate2.add("years",1)
        }
        else if(timeSpanType == 3){

        }
        else{

        }
        return [startDate,endDate]
    }

    loadTopList(timeSpanType,timeSpan){
        let ts = (timeSpan && (timeSpan[0] || timeSpan[1]))?timeSpan:this.getTimeSpan(timeSpanType)
        new ModelAction("account","accountApi").call("loadTopListData",{
            startDate:ts[0]?ts[0].format("YYYY-MM-DD HH:mm:ss"):undefined,
            endDate:ts[1]?ts[1].format("YYYY-MM-DD HH:mm:ss"):undefined
        },data=>{
            if(data.errorCode == 0){
                let topList = data.bag.topList
                topList.map(x=>{
                    var stars = []
                    for(let i=0;i<x.starCount;i++){
                        stars.push(1)
                    }
                    x.stars = stars
                })
                this.setState({
                    data:topList
                })
            }
        },err=>{
            
        })
    }

    componentDidMount(){
        this.loadTopList(0)
    }
    render(){
        let activeClass = [undefined,undefined,undefined,undefined]
        activeClass[this.state.timeSpanType] = "active"
        return <div className="bg-work-sales-top-list-view">
            <div className="area-header">
                <span><Icon type="trophy" /> 销售榜 </span> 
                <Tag color="blue" className={activeClass[0]} style={{marginLeft:10}} onClick={()=>{
                    this.setState({
                        timeSpanType:0
                    })
                    this.loadTopList(0)
                }}>本周</Tag>
                        <Tag color="blue" className={activeClass[1]} onClick={()=>{
                    this.setState({
                        timeSpanType:1
                    })
                    this.loadTopList(1)
                }}>本月</Tag>
                        <Tag color="blue" className={activeClass[2]} onClick={()=>{
                    this.setState({
                        timeSpanType:2
                    })
                    this.loadTopList(2)
                }}>本年</Tag>
                        <Tag color="blue" className={activeClass[3]} onClick={()=>{
                    this.setState({
                        timeSpanType:3
                    })
                    this.loadTopList(3)
                }}>全部</Tag> 
            </div>
            <div>
            <List
                itemLayout="horizontal"
                dataSource={this.state.data}
                renderItem={item => (
                <List.Item extra={<span>
                    {
                       item.stars.map(x=><Icon type="star" theme="filled" style={{color:"gold"}} />)
                    }
                    </span>}>
                    <List.Item.Meta
                    avatar={<Avatar src={"/storage/file/"+item.icon} />}
                    title={<a href="#">{item.name}</a>}
                    description={<span><span>{item.totalAmount}</span><span style={{color:'red',marginLeft:3}}>元</span></span>}
                    />
                </List.Item>
                )}
            />
            </div>
        </div>
    }
}

export default CrmSalesTopListView;