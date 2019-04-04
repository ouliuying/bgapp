export class URLCodeHelper{
    static toKeyValue(obj){
        let data=[]
        for(let key of Object.keys(obj)){
            data.push(key+"="+obj[key])
        }
        return data.join("&")
    }
}