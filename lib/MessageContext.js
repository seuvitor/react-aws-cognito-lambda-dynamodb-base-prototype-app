"use strict";

exports.__esModule = true;
exports.MessageProvider = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var MaterialUI = _interopRequireWildcard(require("@material-ui/core"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var e = _react["default"].createElement;
var Icon = MaterialUI.Icon,
    IconButton = MaterialUI.IconButton,
    Snackbar = MaterialUI.Snackbar;

var MessageContext = _react["default"].createContext();

var MessageProvider = function MessageProvider(_ref) {
  var children = _ref.children;

  var _React$useState = _react["default"].useState([]),
      snackPack = _React$useState[0],
      setSnackPack = _React$useState[1];

  var _React$useState2 = _react["default"].useState(undefined),
      message = _React$useState2[0],
      setMessage = _React$useState2[1];

  var _React$useState3 = _react["default"].useState(false),
      showing = _React$useState3[0],
      setShowing = _React$useState3[1];

  _react["default"].useEffect(function () {
    if (snackPack.length && !message) {
      setMessage(snackPack[0]);
      setSnackPack(function (prev) {
        return prev.slice(1);
      });
      setShowing(true);
    } else if (snackPack.length && message && showing) {
      setShowing(false);
    }
  }, [snackPack, message, showing]);

  var showMessage = _react["default"].useCallback(function (newMessage) {
    setSnackPack(function (prev) {
      return [].concat(prev, [newMessage]);
    });
  }, []);

  var dismissMessage = function dismissMessage(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    setShowing(false);
  };

  var handleOnExited = function handleOnExited() {
    setMessage(undefined);
  };

  return e(MessageContext.Provider, {
    value: {
      showMessage: showMessage
    }
  }, children, e(Snackbar, {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left'
    },
    open: showing,
    autoHideDuration: 5000,
    onClose: dismissMessage,
    onExited: handleOnExited,
    message: message,
    action: e(IconButton, {
      color: 'inherit',
      onClick: dismissMessage
    }, e(Icon, null, 'close'))
  }, null));
};

exports.MessageProvider = MessageProvider;
var _default = MessageContext;
exports["default"] = _default;