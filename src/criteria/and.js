
 import {AND} from './expType';
function and(){
    var criteriaArray=[]
    for(var c of arguments){
        criteriaArray.push(c)
    }
    return {
        op:AND,
        exp:criteriaArray
    }
}

export {and}
