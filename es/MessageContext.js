import React from 'react';
import * as MaterialUI from '@material-ui/core';
var e = React.createElement;
var Icon = MaterialUI.Icon,
    IconButton = MaterialUI.IconButton,
    Snackbar = MaterialUI.Snackbar;
var MessageContext = React.createContext();

var MessageProvider = function MessageProvider(_ref) {
  var children = _ref.children;

  var _React$useState = React.useState([]),
      snackPack = _React$useState[0],
      setSnackPack = _React$useState[1];

  var _React$useState2 = React.useState(undefined),
      message = _React$useState2[0],
      setMessage = _React$useState2[1];

  var _React$useState3 = React.useState(false),
      showing = _React$useState3[0],
      setShowing = _React$useState3[1];

  React.useEffect(function () {
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
  var showMessage = React.useCallback(function (newMessage) {
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

export default MessageContext;
export { MessageProvider };