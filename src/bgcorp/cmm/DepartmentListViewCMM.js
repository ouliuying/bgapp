import React from 'react'
import { ListViewCMM } from '../../app/cmm/ListViewCMM';
import {Tree,Button } from '../../ui'
import { getIcon } from '../../svg';
import { ARGS, RECORD_TAG } from '../../app/ReservedKeyword';
import {produce} from 'immer'

export class DepartmentListViewCMM extends ListViewCMM{

    getDepartmentTree(view){
        const {viewData} = view.props
        const {data} = viewData||{}
        const TreeView = this.buildDepartmentTree(view,data,viewData)
        return TreeView
    }
    buildDepartmentTree(view,data,viewData){
        let self = this
        let treeData =[]
        let record = (data||{}).record
        let allkeys=[]
        let {viewParam}= view.props
        const {ownerModelID}=viewParam||{}
        if(record){
            if(record instanceof Array){
                allkeys=record.map(x=>x.id+"")
                let topNodes = record.filter(x=>{
                    let parentID = x.parent
                    if(parentID && parentID instanceof Object){
                        parentID = parentID.record.id
                    }
                    return parentID == 0 || parentID==undefined || parentID==null || parentID==ownerModelID
                })
               
                let ids = []
                topNodes.map(t=>{
                     let title=t.name
                    treeData.push({
                        id:t.id,
                        name:t.name,
                        key:t.id,
                        title:title,
                        comment:t.comment,
                        record:t
                    })
                    ids.push(t.id)
                })
                treeData.sort((a,b)=>{
                    return a.id - b.id
                })
                let restNodes = record.filter(x=> {
                    return ids.findIndex(y=>y == x.id) < 0
                })
                this.fillChildren(treeData ,restNodes)
            }
            self.updateTitle(treeData,view,viewData)
        }
        return <div className="bg-model-list-view-body bg-flex-full">
                    <Tree showLine treeData={treeData} defaultExpandedKeys={allkeys} blockNode={true} >
                    </Tree>
            </div>
    }
    fillChildren(parentDatas,recordArr){
        for(let pd of parentDatas){
            let children = []
            let ids = []
            for(let r of recordArr){
                if(r.parent && r.parent instanceof Object){
                    if(pd.id == r.parent.record.id){
                        children.push({
                            id:r.id,
                            name:r.name,
                            key:r.id,
                            title:<span>{r.name}</span>,
                            comment:r.comment,
                            record:r
                        })
                        ids.push(r.id)
                    }
                }
            }
            children.sort((a,b)=>{
                return a.id - b.id
            })
            pd.children=children
            if(children.length>0){
                let restNodes = recordArr.filter(x=> {
                    return ids.findIndex(y=>y == x.id) < 0
                })
                this.fillChildren(pd.children,restNodes)
            }
        }
    }
    updateTitle(nodes,view,viewData){
        let self=this
        let {data,totalCount,view:viewMeta,triggerGroups} = viewData
        let excludeGroups=["main","selSingleItemAction"]
        //let tg= triggerGroups.find(x=>x.name=="opAction")
        let selSingleItemActionTg = triggerGroups.find(x=>x.name=="selSingleItemAction")
        let tgs = triggerGroups.filter(x=>{
            return excludeGroups.indexOf(x.name)<0
        })
        const {viewParam} = view.props
        const {external} = (viewParam||{})
        const hasSelectedItem = external && external.getSingleSelectItem()
  
        nodes.map(t=>{
            let isSelected = hasSelectedItem?self.isSameItem(hasSelectedItem,t.record):false
            const title=<span>{t.name}<span className="bg-corp-department-op">
            {
                tgs && tgs.map(tg=>{
                    return tg.triggers.map(tr=>{
                        let IconCtrl =getIcon(t.icon)
                        return <Button type="text" size="small" onClick={()=>{
                            produce(tr,draft=>{
                                if(!draft.app || draft.app=="*"){
                                    draft.app = self.app
                                }
                                if(!draft.model || draft.model=="*"){
                                    draft.model = self.model
                                }
                                draft[ARGS]={id:t.record["id"],tag:t.record[RECORD_TAG],data:t.record}
                                self.doAction(view,draft)
                            })
                        
                        }} key={tr.name}>{IconCtrl}{tr.title}</Button>
                    })
                })
            }
            </span>
            <span style={{marginLeft:"0.4rem"}}>
            {
                selSingleItemActionTg && selSingleItemActionTg.triggers.map(tr=>{
                    let IconCtrl =getIcon(tr.icon)
                    return !isSelected?<Button type="text" size="small" onClick={()=>{
                        produce(tr,draft=>{
                            if(!draft.app || draft.app=="*"){
                                draft.app = self.app
                            }
                            if(!draft.model || draft.model=="*"){
                                draft.model = self.model
                            }
                            draft[ARGS]={id:t.record["id"],tag:t.record[RECORD_TAG],data:t.record}
                            self.doAction(view,draft)
                            const {external} = view.props
                            external && external.close && external.close()
                        })
                    
                    }} key={tr.name}>{IconCtrl}{tr.title}</Button>:<span style={{color:"red"}}>当前设置</span>
                })
            }
            </span>
        </span>
         t.title=title
        })
        for(let n of nodes){
            this.updateTitle(n.children,view,viewData)
        }
    }
}