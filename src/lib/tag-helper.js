const __record_tag_header__ = "cleint_tag"
var __record_tag_seq__ = 1
export function nextRecordTag(){
    __record_tag_seq__+=1
    return __record_tag_header__+__record_tag_seq__
}