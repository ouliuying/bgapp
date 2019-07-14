import React from 'react'
import {Avatar,Tabs} from '../ui'
export default function WorktableInContainer(props){
    return <div className="bg-worktable">
        <div className="bg-worktable-header">
            <div className="p-logo">
            <Avatar size={100} src="/images/Avatar.jpg"></Avatar>
            </div>
            <div>
                <span className="p-name">
                    Admin
                </span>
               <h4 className="p-corp-name">
                   上海星野信息科技有限公司
               </h4>
            </div>
        </div>
        <div className="bg-worktable-body">
            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="日志" key="1">
                    Table
                </Tabs.TabPane>
            </Tabs>
        </div>
        <div className="bg-worktable-footer">

        </div>
    </div>
}