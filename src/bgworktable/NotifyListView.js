import React from 'react'
import {connect} from 'react-redux'
import {
    withRouter,
    Redirect,
    Route,
    matchPath
} from 'react-router-dom'
import ListView from '../app/modelView/ListView'
import hookView from '../app/HookView'
import {mapStateToProps} from '../app/modelView/listViewMapStateToProps'
import { regModelView } from '../app/modelView/ModelViewRegistry'
import {List,Icon,Avatar} from '../ui'
import { getCurrCorp } from '../reducers/sys';
import { getCurrPartner } from '../reducers/partner';
import registry from '../app/modelView/ViewFieldTypeRegistry'

const IconText = ({ type, text }) => (
    <span>
      <Icon type={type} style={{ marginRight: 8 }} />
      {text}
    </span>
  )

  const ShowLogData = ({data})=>{
    let da=JSON.parse(data)
    return da.map(item=>{
        if(item instanceof Object){
            let Com = registry.getComponent(item.viewType)
            return Com?<Com data={item.data}></Com>:null
        }
        else{
            return <span>{item}</span>
        }
            
    })
  }

class NotifyListView extends React.Component{
    constructor(props){
        super(props)
        const {cmmHost,parent}=this.props
        if(!parent){
            this.cmmHost=cmmHost
            this.cmmHost.init(this)
        }
        else{
            this.parent=parent
            this.cmmHost=cmmHost
        }
    }
   
    componentDidMount(){
        this.cmmHost.didMount(this)
    }
    readListData(rows){
        return rows
    }
    render(){
        const self=this
        const {viewParam,viewData,currCorp,currPartner} = self.props
        let {localData} = self.props
        const {ownerField} = (viewParam||{})
        let {criterias, triggerGroups,subViews} = viewData
        criterias=criterias||[]
        triggerGroups=triggerGroups||[]
        localData=localData||{}
        subViews=subViews||[]
        const {columns,rows,currentPage,totalCount,pageSize} = self.cmmHost.getViewDatas(self,viewData)
        const {searchBox} = localData
        const {visible:showSearchBox} = (searchBox||{})
        let listData=self.readListData(rows)
        return  <div className="bg-work-log-list-view">
                <div className="area-header">
                        <span><Icon type="table" /> 通知信息 </span> 
                    </div>
        <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: page => {
            console.log(page);
          },
          pageSize: pageSize,
        }}
        dataSource={listData}
        footer={
          <div></div>
        }
        renderItem={item => (
          <List.Item
            key={item.title}
          >
            <List.Item.Meta
              avatar={<Avatar src={item.partner.icon} />}
              title={item.partner.userName}
              description={item.partner.title}
            />
            <ShowLogData data={item.data}></ShowLogData>
          </List.Item>
        )}
      /></div>
        
    }
}
function logListMapStateToProps(state,ownProps){
    let props = mapStateToProps(state,ownProps)
    let currCorp = getCurrCorp(state)
    let currPartner = getCurrPartner(state)
    return Object.assign({},props,{currCorp,currPartner})
}
export default hookView.withHook(withRouter(connect(logListMapStateToProps)(NotifyListView)))
regModelView("core","modelLog","list",NotifyListView)