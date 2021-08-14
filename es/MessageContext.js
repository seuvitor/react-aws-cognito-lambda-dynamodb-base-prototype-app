import { createContext, createElement as e, useCallback, useContext, useEffect, useState } from 'react';
import { Icon, IconButton, Snackbar } from '@material-ui/core';
var MessageContext = createContext();

var MessageProvider = function MessageProvider(_ref) {
  var children = _ref.children;

  var _useState = useState([]),
      snackPack = _useState[0],
      setSnackPack = _useState[1];

  var _useState2 = useState(undefined),
      message = _useState2[0],
      setMessage = _useState2[1];

  var _useState3 = useState(false),
      showing = _useState3[0],
      setShowing = _useState3[1];

  useEffect(function () {
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
  var showMessage = useCallback(function (newMessage) {
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
    TransitionProps: {
      onExited: handleOnExited
    },
    message: message,
    action: e(IconButton, {
      color: 'inherit',
      onClick: dismissMessage
    }, e(Icon, null, 'close'))
  }, null));
};

var useMessage = function useMessage() {
  var _useContext = useContext(MessageContext),
      showMessage = _useContext.showMessage;

  return {
    showMessage: showMessage
  };
};

export default useMessage;
export { MessageProvider };