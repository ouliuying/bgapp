import { MessageBox } from 'element-react';
 function msgAlert(msg,props={size:"mini"}){
    MessageBox.alert(msg);
}

export default {
    alert:msgAlert
}