import registry from '../../app/modelView/ViewFieldTypeRegistry'
import LogView from './LogView'
const  init=()=>{
    registry.add("logView",LogView)
}

export default init
