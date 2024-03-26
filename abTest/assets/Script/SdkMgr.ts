
export default class SdkMgr {
    
    public static sendClickEvent() {
        var className = "org/cocos2dx/javascript/AppActivity";
        var methodName = "LoginClick";
        var methodSignature = "()V";
        jsb.reflection.callStaticMethod(className, methodName, methodSignature);
    }
}
