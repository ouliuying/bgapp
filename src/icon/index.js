import {createIconFromSvg} from './createIconFromSvg'
const IconColor='#0ab73d'
const Logo = createIconFromSvg({
    src:"/icon/res/logo.svg",
    svgStyle:{width:32,height:32}
})

const AppGroup= createIconFromSvg({
    src:"/icon/res/work_group.svg",
    svgStyle:{
        width:28,
        height:28,
        fill:IconColor,
    }
})
const ChatApp = createIconFromSvg({
    src:"/icon/res/chat_app.svg",
    svgStyle:{
        width:28,
        height:28,
        fill:IconColor,
    }
})

const AddRmApp = createIconFromSvg({
    src:"/icon/res/add_rm_app.svg",
    svgStyle:{
        width:28,
        height:28,
        fill:IconColor,
    }
})

const LocationGoBack = createIconFromSvg({
    src:"/icon/res/location_back.svg",
    svgStyle:{
        width:18,
        height:18,
        fill:IconColor,
    }
})
const UploadIcon = createIconFromSvg({
    src:"/icon/res/icon_upload.svg",
    svgStyle:{
        width:54,
        height:54,
        fill:IconColor,
    }
})

export default{
    Logo,
    AppGroup,
    ChatApp,
    AddRmApp,
    LocationGoBack,
    UploadIcon
}

