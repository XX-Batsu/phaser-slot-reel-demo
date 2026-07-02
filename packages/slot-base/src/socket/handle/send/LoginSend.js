import DataBase from 'socket/base/DataBase';

export default class LoginSend extends DataBase {
    constructor() {
        super();
        this.media = 'WEB';
        this.token = 'guest';
        this.webID = 1;
    }

    get sendData() {
        return [ 1, this.media, 2, this.token, 3, this.webID ];
    }
}
