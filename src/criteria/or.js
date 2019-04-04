import {OR} from './expType'
function or(){
    var criteriaArray=[]
    for(var c of arguments){
        criteriaArray.push(c)
    }
    return {
        "__type__":OR,
        exp:criteriaArray
    }
}

export {or}