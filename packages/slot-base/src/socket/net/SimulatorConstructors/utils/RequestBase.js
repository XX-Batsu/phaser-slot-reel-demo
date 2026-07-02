export default class RequestBase {
    constructor(requestMethod, packetId, payload) {
        this.data = Object.create(null);
        this.data.requestMethod = requestMethod;
        this.data.packet_id = packetId;
        this.data.payload = payload;
    }

    set requestMethod(method) {
        this.data.requestMethod = method;
    }

    set payload(payload) {
        this.data.payload = payload;
    }

    get sendData() {
        this.data.payload = JSON.stringify(this.data.payload);
        return this.data;
    }
}
