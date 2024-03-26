import ConstMgr from "./ConstMgr";
import NetMgr from "./NetMgr";
import SceneXLoader from "./SceneXLoader";
import SdkMgr from "./SdkMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.WebView)
    web: cc.WebView = null;

    start() {
        this.web.node.active = false;
        //测试
        // NetMgr.sendHttpGet(ConstMgr.postUrl, (statusCode, resp, respText) => {
        //     console.log(statusCode);
        //     if (statusCode == 200) {
        //         if (JSON.parse(respText).data.v != null) {
        //             this.web.node.active = true;
        //             this.web.url = ConstMgr.getUrl;
        //         }
        //     }
        // })


    }

    onClick() {
        // if (cc.sys.isNative && cc.sys.platform === cc.sys.ANDROID) {
        //     SdkMgr.sendClickEvent();
        //     this.label.string = "点击了";
        // }
        SceneXLoader.startLoad("chat", "game");
    }
}
