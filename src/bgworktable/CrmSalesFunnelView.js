import React from 'react'
import {Tag, Icon} from '../ui'
import G2 from '@antv/g2'
import DataSet from '@antv/data-set'
import { ModelAction } from '../app/mq/ModelAction'
import moment from 'moment'
let  chart =null
class CrmSalesFunnelView extends React.Component{
    constructor(props){
        super(props)
        this.state={
            timeSpanType:0,
            data:[]
        }
     
    }
    componentDidMount(){
      chart =null
      this.showFunnelChart(0)
    }
    reCreateConatiner(){

    }
    drawFunnelChart(funnelData){
        this.reCreateConatiner()
        let maxCount = funnelData.reduce((maxValue,data)=>{
            if(maxValue<data.count){
                return data.count
            }
            return maxValue
        },1)
        var _DataSet = DataSet,
        DataView = _DataSet.DataView;
        var dv = new DataView().source(funnelData);
        dv.transform({
            type: 'map',
            callback: function callback(row) {
            row.percent = row.count / maxCount;
            return row;
            }
        });
       let data = dv.rows;
        if(chart){
            chart.clear()
            chart.changeData(data)
        }
        else{
            chart = new G2.Chart({
                container: 'bg-work-worktable-salesfunnel-chart-1',
                forceFit: true,
                padding: [20, 120, 95]
            });
            chart.source(data, {
                percent: {
                nice: false
                }
            });
        }
       
        chart.axis(false);
        chart.tooltip({
            showTitle: false,
            itemTpl: '<li data-index={index} style="margin-bottom:4px;">' + 
            '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' + 
            '{name}<br/>' + 
            '<span style="padding-left: 16px">数量{count}</span><br/>' + 
            '<span style="padding-left: 16px">占比：{percent}</span><br/>' + 
            '</li>'
        });
        chart.coord('rect').transpose().scale(1, -1);
        chart.intervalSymmetric().position('step*percent').shape('funnel').color('step', ['#0050B3', '#1890FF', '#40A9FF', '#69C0FF', '#BAE7FF']).label('step*count', function(step, count) {
            return step + ' ' + count;
        }, {
            offset: 35,
            labelLine: {
            lineWidth: 1,
            stroke: 'rgba(0, 0, 0, 0.15)'
            }
        }).tooltip('step*count*percent', function(step, count, percent) {
            return {
            name: step,
            percent: parseInt(percent * 100) + '%',
            count: count
            };
        });
        data.forEach(function(obj) {
            // 中间标签文本
            chart.guide().text({
            top: true,
            position: {
                step: obj.step,
                percent: 'median'
            },
            content: parseInt(obj.percent * 100) + '%', // 显示的文本内容
            style: {
                fill: '#fff',
                fontSize: '12',
                textAlign: 'center',
                shadowBlur: 2,
                shadowColor: 'rgba(0, 0, 0, .45)'
            }
            });
        });
        chart.render();
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
    showFunnelChart(timeSpanType,timeSpan){
        let ts = (timeSpan && (timeSpan[0] || timeSpan[1]))?timeSpan:this.getTimeSpan(timeSpanType)
        new ModelAction("crm","crmApi").call("loadSalesFunnelData",{
            startDate:ts[0]?ts[0].format("YYYY-MM-DD HH:mm:ss"):undefined,
            endDate:ts[1]?ts[1].format("YYYY-MM-DD HH:mm:ss"):undefined
        },data=>{
            this.drawFunnelChart(data.bag.funnelData)
        },err=>{

        })
    }

    render(){
        let activeClass = [undefined,undefined,undefined,undefined]
        activeClass[this.state.timeSpanType] = "active"
        return <div className="bg-work-funnel-view">
            <div className="area-header">
                <span><Icon type="filter" /> 销售漏斗 </span> 
                <Tag color="blue" className={activeClass[0]} style={{marginLeft:10}} onClick={()=>{
                    this.setState({
                        timeSpanType:0
                    })
                    this.showFunnelChart(0)
                }}>本周</Tag>
                        <Tag color="blue" className={activeClass[1]} onClick={()=>{
                    this.setState({
                        timeSpanType:1
                    })
                    this.showFunnelChart(1)
                }}>本月</Tag>
                        <Tag color="blue" className={activeClass[2]} onClick={()=>{
                    this.setState({
                        timeSpanType:2
                    })
                    this.showFunnelChart(2)
                }}>本年</Tag>
                        <Tag color="blue" className={activeClass[3]} onClick={()=>{
                    this.setState({
                        timeSpanType:3
                    })
                    this.showFunnelChart(3)
                }}>全部</Tag> 
            </div>
            <div className="bg-work-worktable-salesfunnel-chart" id="bg-work-worktable-salesfunnel-chart-1">
               
            </div>
        </div>
    }
}

export default CrmSalesFunnelView;