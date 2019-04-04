import CreateView from './CreateView'
import EditView from './EditView'
import DetailView from './DetailView'
import ListView from './ListView'
import DummyView from './DummyView'
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
        default:
            return DummyView
    }
}