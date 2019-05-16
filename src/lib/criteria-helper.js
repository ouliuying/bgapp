import {and,or,eq,gt_eq,lt,lt_eq, iLike, like} from '../criteria'
import {ViewFieldType} from '../app/modelView/ViewFieldType'
export function getExpression(name,value,viewType){
    switch(viewType){
        case ViewFieldType.CriteriaEnumSelect:
        case ViewFieldType.CriteriaNumberEqualInput:
        case ViewFieldType.CriteriaStringEqualInput:
        case ViewFieldType.CriteriaDateEqualInput:
        case ViewFieldType.CriteriaDateTimeEqualInput:
        case ViewFieldType.CriteriaMobileEqualInput:
        case ViewFieldType.CriteriaNumberEqualInput:{
            return eq(name,value)
        }
        case ViewFieldType.CriteriaDateTimeRangeInput:
        case ViewFieldType.CriteriaDateRangeInput:
        case ViewFieldType.CriteriaNumberRangeInput:
        {
            return and(gt_eq(name,value[0]),lt(name,value[1]))
        }
        case ViewFieldType.CriteriaNumberLessEqualInput:
        {
            return lt_eq(name,value)
        }
        case ViewFieldType.CriteriaNumberGreaterEqualInput:
        {
            return gt_eq(name,value)
        }
        case ViewFieldType.CriteriaStringILikeEqualInput:
        {
            return iLike(name,value)
        }
        case ViewFieldType.CriteriaStringLikeEqualInput:
        {
            return like(name,value)
        }
        default:
            return undefined
    }
}