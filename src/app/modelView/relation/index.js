import RelationCreateView from './RelationCreateView'
import RelationEditView from './RelationEditView'
import RelationDetailView from './RelationDetailView'
import RelationListView from './RelationListView'
import RelationDummyView from './RelationDummyView'

export  function getDefaultRelationModelView(viewType){
    switch(viewType){
        case "list":
            return RelationListView
        case "edit":
            return RelationEditView
        case "create":
            return RelationCreateView
        case "detail":
            return RelationDetailView
        default:
            return RelationDummyView
    }
}