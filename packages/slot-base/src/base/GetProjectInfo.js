export default class GetProjectInfo {
    constructor() {
        GetProjectInfo.instance = this;
    }

    static getPath(env) {
        return (env === 'develop') ? 'src' : '.';
    }

    static getIP(ip) {
        return ip || 'wss://flower-stg.example.com:8080/ws';
    }

    static getHOME(home) {
        return home || 'https://front-demo.example.com/#/System';
    }

    static getStaticPath(env) {
        return (env === 'develop') ? 'static' : '.';
    }

    // 取得 url 參數
    static getUrlParams() {
        const decodeUrl = decodeURIComponent(window.location.href);
        const params = {};

        decodeUrl.replace(/[?&]+([^=&]+)=([^&]*)/gi, (map, key, value) => {
            params[key] = value;
        });

        return params;
    }
}
