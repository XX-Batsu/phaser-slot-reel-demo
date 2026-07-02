import Event from 'base/Event';

// jackpot轉場後鍵盤取分
export default class JackpotKeyboardTakeWinEvent extends Event {
    constructor() {
        super(JackpotKeyboardTakeWinEvent.ON_JACKPOT_KEYBOARD_TAKE_WIN);
    }
}
JackpotKeyboardTakeWinEvent.ON_JACKPOT_KEYBOARD_TAKE_WIN = 'ON_JACKPOT_KEYBOARD_TAKE_WIN';
