// Base
import ConfigPasser from 'base/ConfigPasser';
import ConfigTools from 'base/ConfigTools';
import EffectPasser from 'base/EffectPasser';
import types from 'base/types';
import Event from 'base/Event';
import GameBase from 'base/GameBase';
import GetProjectInfo from 'base/GetProjectInfo';
import GlobalEvent from 'base/GlobalEvent';
import LoadSources from 'base/LoadSources';
import MessageManager from 'base/MessageManager';
import Overlay from 'base/Overlay';
import ReelControl from 'base/ReelControl';
import RunScore from 'base/RunScore';
import Signal from 'base/Signal';
import SlotSignalSchedule from 'base/SlotSignalSchedule';
import SlowControl from 'base/SlowControl';
import SlowborderEffect from 'base/SlowborderEffect';
import Sound from 'base/Sound';
import Tool from 'base/Tool';
import UIButton from 'base/UIButton';
import McButton from 'base/McButton';
import UiApp from 'base/UiApp';
import FullScreen from 'base/FullScreen';
import SocketSimulatorPasser from 'base/SocketSimulatorPasser';
// Stage
import ErrorStage from 'base/stage/ErrorStage';
// spine
import SpineBase from 'base/SpineBase';
// Socket
import SocketManager from 'socket/SocketManager';
import SocketStatesConfig from 'socket/SocketStatesConfig';
import WebApiStatesConfig from 'socket/net/SimulatorConstructors/WebApiStatesConfig';
// Tools
import KeyCtlCenter from 'tools/KeyCtlCenter';
import PPAP from 'tools/PPAP';
import PPAP2 from 'tools/PPAP2';

import LikeMoveIt from 'tools/LikeMoveIt';
// Tools - Function
import getCurLangID from 'tools/getCurLangID';
import setCreatureAnimation from 'tools/setCreatureAnimation';
import createSerialBitmap from 'tools/createSerialBitmap';
import makeSpriteAnimation from 'tools/makeSpriteAnimation';

// vertical
import FullScreenVertical from 'base/vertical/FullScreenVertical';
// import SlotBase from 'game/base/SlotBase';
import * as SlotGame from 'game/Index';

// data packet
import LoginSend from 'socket/net/SimulatorConstructors/request/LoginSend';
import InitialSend from 'socket/net/SimulatorConstructors/request/InitialSend';
import RefreshSend from 'socket/net/SimulatorConstructors/request/RefreshSend';
import ExchangeSend from 'socket/net/SimulatorConstructors/request/ExchangeSend';
import CashoutSend from 'socket/net/SimulatorConstructors/request/CashoutSend';

export {
    SlotGame,
    EffectPasser,
    Event,
    GameBase,
    GetProjectInfo,
    GlobalEvent,
    LoadSources,
    MessageManager,
    Overlay,
    ReelControl,
    RunScore,
    Signal,
    SlotSignalSchedule,
    SlowControl,
    SlowborderEffect,
    Sound,
    Tool,
    UIButton,
    McButton,
    UiApp,
    FullScreen,
    SocketManager,
    SocketStatesConfig,
    WebApiStatesConfig,
    ConfigPasser,
    ConfigTools,
    KeyCtlCenter,
    PPAP,
    PPAP2,
    LikeMoveIt,
    ErrorStage,
    types,
    getCurLangID,
    setCreatureAnimation,
    makeSpriteAnimation,
    createSerialBitmap,
    SpineBase,
    FullScreenVertical,
    SocketSimulatorPasser,
    LoginSend,
    InitialSend,
    RefreshSend,
    ExchangeSend,
    CashoutSend
};
