import {
  createContext,
  createElement as e,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { Icon, IconButton, Snackbar } from '@material-ui/core';

const MessageContext = createContext();

const MessageProvider = ({ children }) => {
  const [snackPack, setSnackPack] = useState([]);
  const [message, setMessage] = useState(undefined);
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    if (snackPack.length && !message) {
      setMessage(snackPack[0]);
      setSnackPack((prev) => prev.slice(1));
      setShowing(true);
    } else if (snackPack.length && message && showing) {
      setShowing(false);
    }
  }, [snackPack, message, showing]);

  const showMessage = useCallback((newMessage) => {
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
        TransitionProps: {
          onExited: handleOnExited
        },
        message,
        action: e(IconButton, { color: 'inherit', onClick: dismissMessage }, e(Icon, null, 'close'))
      },
      null));
};

const useMessage = () => {
  const { showMessage } = useContext(MessageContext);

  return { showMessage };
};

export default useMessage;
export { MessageProvider };
