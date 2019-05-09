

export function createViewParam(ownerField,
    ownerFieldValue,
    external,
    orgState){
        return {
            ownerField,
            ownerFieldValue,
            external,
            orgState
        }
}

export function createDetailParam(ownerField,
    ownerFieldValue,
    external,
    orgState,modelID){
        let p = createViewParam(ownerField,ownerFieldValue,external,orgState)
        p.modelID=modelID
        return p
}

export function createEditParam(ownerField,
    ownerFieldValue,
    external,
    orgState,modelID){
        let p = createViewParam(ownerField,ownerFieldValue,external,orgState)
        p.modelID=modelID
        return p
}