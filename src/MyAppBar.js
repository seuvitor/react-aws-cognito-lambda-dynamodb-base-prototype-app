import {
  createElement as e,
  Fragment,
  useRef,
  useState
} from 'react';
import { useLocation } from 'react-router-dom';
import {
  AppBar,
  Button,
  Divider,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from '@material-ui/core';

import useAppConfig from './AppConfigContext';
import useMessage from './MessageContext';
import useUser from './UserContext';

const LoginButton = () => {
  const { appConfig: { appExternalLoginUrl, hideLogin } } = useAppConfig();
  const { user: { name: userName } } = useUser();

  return (userName || hideLogin) ? null : e(Fragment, null,
    e(Button, { color: 'inherit', href: appExternalLoginUrl }, 'Login'));
};

const AccountButton = () => {
  const { appConfig: { appMessages, hideLogin } } = useAppConfig();
  const { showMessage } = useMessage();
  const { user: { name: userName }, logoff } = useUser();
  const [accountMenuOpened, setAccountMenuOpened] = useState(false);
  const accountMenuRef = useRef(null);

  const handleAccountMenuClick = () => {
    setAccountMenuOpened(true);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuOpened(false);
  };

  const handleLogoff = () => {
    logoff().then(() => {
      showMessage(appMessages.LOGOUT_SUCCESSFUL);
    }).catch(() => {
      showMessage(appMessages.LOGOUT_FAILED);
    });
    setAccountMenuOpened(false);
  };

  return (!userName || hideLogin) ? null : e(Fragment, null,
    e(IconButton, { color: 'inherit', ref: accountMenuRef, onClick: handleAccountMenuClick },
      e(Icon, null, 'account_circle')),
    e(Menu,
      {
        open: accountMenuOpened,
        onClose: handleAccountMenuClose,
        anchorEl: accountMenuRef.current,
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        transformOrigin: { vertical: 'top', horizontal: 'right' }
      },
      e(MenuItem, { disabled: true }, userName),
      e(Divider, null, null),
      e(MenuItem, { onClick: handleLogoff }, 'Logoff')));
};

const MyAppBar = ({ setDrawerOpen, routes }) => {
  const location = useLocation();

  const currentRoute = routes.find((route) => route.path === location.pathname);

  return e(AppBar, null,
    e(Toolbar, null,
      e(IconButton, { edge: 'start', color: 'inherit', onClick: () => setDrawerOpen(true) },
        e(Icon, null, 'menu')),
      e(Typography, { style: { flexGrow: 1 } }, currentRoute ? currentRoute.label : ''),
      e(LoginButton, null, null),
      e(AccountButton, null, null)));
};

export default MyAppBar;
