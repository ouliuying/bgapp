
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
    StaticField,
    EnumStaticTextField,
    ChinaFullAddress,
    SelectField,
    // ViewFieldType
    ViewFieldType,
    PasswordField,
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
registry.add(ViewFieldType.StaticField,StaticField)
registry.add(ViewFieldType.EnumStaticTextField,EnumStaticTextField)
registry.add(ViewFieldType.ChinaFullAddress,ChinaFullAddress)
registry.add(ViewFieldType.SelectField,SelectField)
registry.add(ViewFieldType.PasswordField,PasswordField)

registry.add(ViewFieldType.CriteriaEnumSelect,CriteriaEnumSelect)
registry.add(ViewFieldType.CriteriaNumberRangeInput,CriteriaNumberRangeInput)
registry.add(ViewFieldType.CriteriaNumberLessEqualInput,CriteriaNumberLessEqualInput)
registry.add(ViewFieldType.CriteriaNumberGreaterEqualInput,CriteriaNumberGreaterEqualInput)
registry.add(ViewFieldType.CriteriaNumberEqualInput,CriteriaNumberEqualInput)
registry.add(ViewFieldType.CriteriaStringILikeEqualInput,CriteriaStringILikeEqualInput)
registry.add(ViewFieldType.CriteriaStringLikeEqualInput,CriteriaStringLikeEqualInput)
registry.add(ViewFieldType.CriteriaStringEqualInput,CriteriaStringEqualInput)
registry.add(ViewFieldType.CriteriaDateEqualInput,CriteriaDateEqualInput)
registry.add(ViewFieldType.CriteriaDateTimeEqualInput,CriteriaDateTimeEqualInput)
registry.add(ViewFieldType.CriteriaDateRangeInput,CriteriaDateRangeInput)
registry.add(ViewFieldType.CriteriaDateTimeRangeInput,CriteriaDateTimeRangeInput)
registry.add(ViewFieldType.CriteriaMobileEqualInput,CriteriaMobileEqualInput)


export default registry