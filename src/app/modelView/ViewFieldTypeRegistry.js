
import React from 'react'
import {TextField,
    SingleLineTextField,
    MultiLineTextField,
    TelephoneField,
    MobileField,
    NumberField,
    RealField,
    LongField,
    IntField,
    ImageUploadField,
    AvatarField,
    DateField,
    EmailField,
    IconLabelField,
    Many2OneDataSetSelectField,
    SingleCheckBoxField,
    // ViewFieldType
    ViewFieldType,
    //** criteria control  begin*/
    CriteriaEnumSelect,
    CriteriaNumberRangeInput,
    CriteriaNumberLessEqualInput,
    CriteriaNumberGreaterEqualInput,
    CriteriaNumberEqualInput,
    CriteriaStringILikeEqualInput,
    CriteriaStringLikeEqualInput,
    CriteriaStringEqualInput,
    CriteriaDateEqualInput,
    CriteriaDateTimeEqualInput,
    CriteriaDateStartInput,
    CriteriaDateEndInput,
    CriteriaDateTimeStartInput,
    CriteriaDateTimeEndInput,
    CriteriaDateRangeInput,
    CriteriaDateTimeRangeInput,
    CriteriaMobileEqualInput
    //** criteria control end */
} from './ViewFieldType'
const registry={
    add(name,component){
        this.fieldTypes[name]=component
    },
    remove(name){
        delete (this.fieldTypes[name])
    },
    getComponent(name){
        const Com= this.fieldTypes[name]
        return Com?Com:notRegistryComponent(name)
    },
    fieldTypes:{}
}

function notRegistryComponent(name){
    class InComponent extends React.Component{
        render(){
            return <div>
                `{name} 没有注册信息`
            </div>
        }
    }
    return InComponent
}

registry.add(ViewFieldType.TextField,TextField)
registry.add(ViewFieldType.SingleLineTextField,SingleLineTextField)
registry.add(ViewFieldType.MultiLineTextField,MultiLineTextField)
registry.add(ViewFieldType.TelephoneField,TelephoneField)
registry.add(ViewFieldType.MobileField,MobileField)
registry.add(ViewFieldType.NumberField,NumberField)
registry.add(ViewFieldType.RealField,RealField)
registry.add(ViewFieldType.IntField,IntField)
registry.add(ViewFieldType.LongField,LongField)
registry.add(ViewFieldType.ImageUploadField,ImageUploadField)
registry.add(ViewFieldType.AvatarField,AvatarField)
registry.add(ViewFieldType.DateField,DateField)
registry.add(ViewFieldType.EmailField,EmailField)
registry.add(ViewFieldType.IconLabelField,IconLabelField)
registry.add(ViewFieldType.Many2OneDataSetSelectField,Many2OneDataSetSelectField)
registry.add(ViewFieldType.SingleCheckBoxField,SingleCheckBoxField)

registry.add("criteriaSelect",CriteriaEnumSelect)
registry.add("criteriaNumberRange",CriteriaNumberRangeInput)
registry.add("criteriaNumberLessEqual",CriteriaNumberLessEqualInput)
registry.add("criteriaNumberGreaterEqual",CriteriaNumberGreaterEqualInput)
registry.add("criteriaNumberEqual",CriteriaNumberEqualInput)
registry.add("criteriaStringILike",CriteriaStringILikeEqualInput)
registry.add("criteriaStringLike",CriteriaStringLikeEqualInput)
registry.add("criteriaStringEqual",CriteriaStringEqualInput)
registry.add("criteriaDateEqual",CriteriaDateEqualInput)
registry.add("CriteriaDateTimeEqual",CriteriaDateTimeEqualInput)
registry.add("CriteriaDateStart",CriteriaDateStartInput)
registry.add("criteriaDateEnd",CriteriaDateEndInput)
registry.add("criteriaDateTimeStart",CriteriaDateTimeStartInput)
registry.add("criteriaDateTimEnd",CriteriaDateTimeEndInput)
registry.add("criteriaDateRange",CriteriaDateRangeInput)
registry.add("criteriaDateTimeRange",CriteriaDateTimeRangeInput)
registry.add("criteriaMobileEqual",CriteriaMobileEqualInput)


export default registry