import React from 'react';
import * as MaterialUI from '@material-ui/core';

const e = React.createElement;
const { Icon, IconButton, Snackbar } = MaterialUI;

const MessageContext = React.createContext();

const MessageProvider = ({ children }) => {
  const [snackPack, setSnackPack] = React.useState([]);
  const [message, setMessage] = React.useState(undefined);
  const [showing, setShowing] = React.useState(false);

  React.useEffect(() => {
    if (snackPack.length && !message) {
      setMessage(snackPack[0]);
      setSnackPack((prev) => prev.slice(1));
      setShowing(true);
    } else if (snackPack.length && message && showing) {
      setShowing(false);
    }
  }, [snackPack, message, showing]);

  const showMessage = React.useCallback((newMessage) => {
    setSnackPack((prev) => [...prev, newMessage]);
  }, []);

  const dismissMessage = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowing(false);
  };

  const handleOnExited = () => {
    setMessage(undefined);
  };

  return e(MessageContext.Provider, { value: { showMessage } },
    children,
    e(Snackbar,
      {
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        open: showing,
        autoHideDuration: 5000,
        onClose: dismissMessage,
        onExited: handleOnExited,
        message,
        action: e(IconButton, { color: 'inherit', onClick: dismissMessage }, e(Icon, null, 'close'))
      },
      null));
};

export default MessageContext;
export { MessageProvider };
