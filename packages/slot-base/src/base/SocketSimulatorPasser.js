export default class SocketSimulatorPasser {
    constructor() {
        SocketSimulatorPasser.instance = this;
    }

    register(obj) {
        SocketSimulatorPasser.instance.SocketSimulator = obj;
    }
}
