import {Trigger} from './Trigger'

export class DoCreate extends Trigger{
    static get s_name(){
        return "doCreate"
    }

    do(){
             
    }
}

export class DoCancel extends Trigger{
    static get s_name(){
        return "doCancel"
    }
    constructor(component){

    }
    do(){

    }
}
