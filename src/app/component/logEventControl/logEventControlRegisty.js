
import React from 'react'
import ModelLogControl from './ModelLogControl'
import ModelCommentControl from './ModelCommentControl'
import ModelCommentControlEditor from './ModelCommentControlEditor'
const eventRegistry={
    add(name,control){
        this.logEventControls[name]=control
    },
    remove(name){
        delete (this.logEventControls[name])
    },
    get(name){
        const ctl= this.logEventControls[name]
        return ctl?ctl:<div>`{name} 事件控件`</div>
    },
    logEventControls:{}
}
eventRegistry.add("modelLogControl",ModelLogControl)
eventRegistry.add("modelCommentControl",ModelCommentControl)
eventRegistry.add("modelCommentControlEditor",ModelCommentControlEditor)
export default eventRegistry