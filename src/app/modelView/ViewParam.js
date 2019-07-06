

export function createViewParam(
    ownerField,
    ownerFieldValue,
    ownerModelID,
    external,
    orgState){
        return {
            ownerField,
            ownerFieldValue,
            ownerModelID,
            external,
            orgState
        }
}
export function createModelActionParam(modelID,ownerField,external,orgState){
    return {
        modelID,
        ownerField,
        external,
        orgState
    }
}
export function createDetailParam(ownerField,
    ownerFieldValue,
    ownerModelID,
    modelID,
    external,
    orgState){
        let p = createViewParam(ownerField,ownerFieldValue,ownerModelID,external,orgState)
        p.modelID=modelID
        return p
}

export function createEditParam(ownerField,
    ownerFieldValue,
    ownerModelID,
    modelID,
    external,
    orgState){
        let p = createViewParam(ownerField,ownerFieldValue,ownerModelID,external,orgState)
        p.modelID=modelID
        return p
}