import CreateView from './CreateView'
import EditView from './EditView'
import DetailView from './DetailView'
import ListView from './ListView'
import DummyView from './DummyView'
import ModelActionView from './ModelActionView';
import ConfirmView from '../commonView/ConfirmView';
import EventLogView from './EventLogView'
export default function getDefaultModelView(viewType){
    switch(viewType){
        case "list":
            return ListView
        case "edit":
            return EditView
        case "create":
            return CreateView
        case "detail":
            return DetailView
        case "modelAction":
            return ModelActionView
        case "modelActionConfirm":
            return ConfirmView
        case "eventLogList":
            return EventLogView
        default:
            return DummyView
    }
}