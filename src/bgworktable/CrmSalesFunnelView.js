import React from 'react'
import {Tag, Icon} from '../ui'
import G2 from '@antv/g2'
import DataSet from '@antv/data-set'
class CrmSalesFunnelView extends React.Component{
    componentDidMount(){
        var _DataSet = DataSet,
            DataView = _DataSet.DataView;

        var data = [{
            action: '浏览网站',
            pv: 50000
        }, {
            action: '放入购物车',
            pv: 35000
        }, {
            action: '生成订单',
            pv: 25000
        }, {
            action: '支付订单',
            pv: 15000
        }, {
            action: '完成交易',
            pv: 8000
        }];
        var dv = new DataView().source(data);
        dv.transform({
            type: 'map',
            callback: function callback(row) {
            row.percent = row.pv / 50000;
            return row;
            }
        });
        data = dv.rows;
        var chart = new G2.Chart({
            container: 'bg-work-worktable-salesfunnel-chart-1',
            forceFit: true,
            padding: [20, 120, 95]
        });
        chart.source(data, {
            percent: {
            nice: false
            }
        });
        chart.axis(false);
        chart.tooltip({
            showTitle: false,
            itemTpl: '<li data-index={index} style="margin-bottom:4px;">' + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' + '{name}<br/>' + '<span style="padding-left: 16px">浏览人数：{pv}</span><br/>' + '<span style="padding-left: 16px">占比：{percent}</span><br/>' + '</li>'
        });
        chart.coord('rect').transpose().scale(1, -1);
        chart.intervalSymmetric().position('action*percent').shape('funnel').color('action', ['#0050B3', '#1890FF', '#40A9FF', '#69C0FF', '#BAE7FF']).label('action*pv', function(action, pv) {
            return action + ' ' + pv;
        }, {
            offset: 35,
            labelLine: {
            lineWidth: 1,
            stroke: 'rgba(0, 0, 0, 0.15)'
            }
        }).tooltip('action*pv*percent', function(action, pv, percent) {
            return {
            name: action,
            percent: parseInt(percent * 100) + '%',
            pv: pv
            };
        });
        data.forEach(function(obj) {
            // 中间标签文本
            chart.guide().text({
            top: true,
            position: {
                action: obj.action,
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
    render(){
        return <div className="bg-work-funnel-view">
            <div className="area-header">
                <span><Icon type="filter" /> 销售漏斗 </span> 
                <Tag color="blue" className="active" style={{marginLeft:10}}>本周</Tag>
                        <Tag color="blue">本月</Tag>
                        <Tag color="blue">本年</Tag>
                        <Tag color="blue">全部</Tag> 
            </div>
            <div className="bg-work-worktable-salesfunnel-chart" id="bg-work-worktable-salesfunnel-chart-1">
               
            </div>
        </div>
    }
}

export default CrmSalesFunnelView;