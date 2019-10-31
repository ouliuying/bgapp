
import React from 'react'
import ModelLogControl from './ModelLogControl'
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
export default eventRegistry