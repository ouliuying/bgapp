
import React from "react"
import PartnerRuleListStore from "../store/PartnerRuleListStore"
import { addAppModelViewStore } from "../../app/reducers/appModelViewDataStore"
import {connect} from 'react-redux'
import { BaseTemplateView } from "../../app/template/BaseTemplateView"
import {Table,Pagination,Button} from '../../ui'
import PartnerMenuRuleListStore from "../store/PartnerMenuRuleListStore"

const store = new PartnerMenuRuleListStore()
class PartnerMenuRuleList extends React.Component{
    componentDidMount(){
        store.didMount(this)
    }
    render(){
        let self = this
        const {rows,columns,pageSize,pageIndex,totalCount} = store.getPageInfo(self)
        return <BaseTemplateView actions={
            <>
            <Button type="danger" onClick={
                    () => {
                        //self.props.appModelViewStore.put({ type: "doSave" })
                        store.reloadCorpRule(self)
                    }
                }>
                    重载配置
                </Button>
            </>
        }>
                            <Table style={{width:'100%'}}
                                    columns={columns}
                                    dataSource={rows}
                                    bordered={true}
                                    pagination={false}
                                    rowKey={(record)=>{
                                        return record.id
                                    }}
                                    >
                            </Table>
                            <div className="bg-model-list-view-body-control-footer">
                                <Pagination
                                    total={totalCount} 
                                    pageSizeOptions={['10', '20', '30', '40']}
                                    showSizeChanger={true}
                                    showQuickJumper={true}
                                    pageSize={pageSize} 
                                    current={pageIndex}
                                    onShowSizeChange={(size)=>{store.onSizeChange(self,size)}}
                                    onChange={(page)=>{store.onCurrentChange(self,page)}}
                                />
                            </div>
        </BaseTemplateView>
    }
}

addAppModelViewStore(store)

export default connect(state=>{
    return store.mapStateToProps(state)
})(PartnerMenuRuleList)




