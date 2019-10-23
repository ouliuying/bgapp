import React from 'react'
import {Tag, Icon, List, Avatar} from '../ui'

class CrmSalesTopListView extends React.Component{
    render(){
        const data = [
            {
              title: '王夏华',
              description:'$50000',
              avatar:'/storage/file/5a9e3a7e15c347f396e9bc0e5ba7f12b',
              starCount:[1,1,1,1,1]
            },
            {
              title: '王尚渠',
              description:'$48000',
              avatar:'/storage/file/5a9e3a7e15c347f396e9bc0e5ba7f12b',
              starCount:[1,1,1]
            },
            {
                title: '肖江林',
                description:'$47000',
                avatar:'/storage/file/5a9e3a7e15c347f396e9bc0e5ba7f12b',
                starCount:[1]
            },
            {
                title: '马大浩',
                description:'$46000',
                avatar:'/storage/file/5a9e3a7e15c347f396e9bc0e5ba7f12b',
                starCount:[]
            },
          ];
        return <div className="bg-work-sales-top-list-view">
            <div className="area-header">
                <span><Icon type="calculator" /> 销售榜 </span> 
                <Tag color="blue" className="active" style={{marginLeft:10}}>本周</Tag>
                        <Tag color="blue">本月</Tag>
                        <Tag color="blue">本年</Tag>
                        <Tag color="blue">全部</Tag> 
            </div>
            <div>
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={item => (
                <List.Item extra={<span>
                    {
                       item.starCount.map(x=><Icon type="star" theme="filled" style={{color:"gold"}} />)
                    }
                    </span>}>
                    <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={<a href="#">{item.title}</a>}
                    description={item.description}
                    />
                </List.Item>
                )}
            />
            </div>
        </div>
    }
}

export default CrmSalesTopListView;