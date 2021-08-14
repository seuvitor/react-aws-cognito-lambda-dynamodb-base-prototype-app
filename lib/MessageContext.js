"use strict";

exports.__esModule = true;
exports.MessageProvider = exports["default"] = void 0;

var _react = require("react");

var _core = require("@material-ui/core");

var MessageContext = (0, _react.createContext)();

var MessageProvider = function MessageProvider(_ref) {
  var children = _ref.children;

  var _useState = (0, _react.useState)([]),
      snackPack = _useState[0],
      setSnackPack = _useState[1];

  var _useState2 = (0, _react.useState)(undefined),
      message = _useState2[0],
      setMessage = _useState2[1];

  var _useState3 = (0, _react.useState)(false),
      showing = _useState3[0],
      setShowing = _useState3[1];

  (0, _react.useEffect)(function () {
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
  var showMessage = (0, _react.useCallback)(function (newMessage) {
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

  return (0, _react.createElement)(MessageContext.Provider, {
    value: {
      showMessage: showMessage
    }
  }, children, (0, _react.createElement)(_core.Snackbar, {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left'
    },
    open: showing,
    autoHideDuration: 5000,
    onClose: dismissMessage,
    TransitionProps: {
      onExited: handleOnExited
    },
    message: message,
    action: (0, _react.createElement)(_core.IconButton, {
      color: 'inherit',
      onClick: dismissMessage
    }, (0, _react.createElement)(_core.Icon, null, 'close'))
  }, null));
};

exports.MessageProvider = MessageProvider;

var useMessage = function useMessage() {
  var _useContext = (0, _react.useContext)(MessageContext),
      showMessage = _useContext.showMessage;

  return {
    showMessage: showMessage
  };
};

var _default = useMessage;
exports["default"] = _default;