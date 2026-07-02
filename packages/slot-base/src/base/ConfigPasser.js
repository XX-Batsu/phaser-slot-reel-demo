export default class ConfigPasser {
    constructor() {
        ConfigPasser.instance = this;
    }

    // 註冊專案傳入的設定值供 slot-base 使用
    register(obj) {
        Object.keys(obj).forEach((key) => {
            this[key] = obj[key];
        });
    }

    registerLanguage(langObj) {
        this.LANGUAGE_CONFIG = Object.create(null);
        Object.keys(langObj).forEach((key) => {
            this.LANGUAGE_CONFIG[key] = langObj[key];
        });
    }
}
