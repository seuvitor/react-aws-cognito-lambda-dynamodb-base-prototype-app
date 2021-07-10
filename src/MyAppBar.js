import React from 'react';
import { useLocation } from 'react-router-dom';
import * as MaterialUI from '@material-ui/core';

import AppConfigContext from './AppConfigContext';
import MessageContext from './MessageContext';
import UserContext from './UserContext';

const e = React.createElement;

const {
  AppBar,
  Button,
  Divider,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} = MaterialUI;

const LoginButton = () => {
  const { appConfig: { appExternalLoginUrl, hideLogin } } = React.useContext(AppConfigContext);
  const { user: { name: userName } } = React.useContext(UserContext);

  return (userName || hideLogin) ? null : e(React.Fragment, null,
    e(Button, { color: 'inherit', href: appExternalLoginUrl }, 'Login'));
};

const AccountButton = () => {
  const { appConfig: { appMessages, hideLogin } } = React.useContext(AppConfigContext);
  const { showMessage } = React.useContext(MessageContext);
  const { user: { name: userName }, logoff } = React.useContext(UserContext);
  const [accountMenuOpened, setAccountMenuOpened] = React.useState(false);
  const accountMenuRef = React.useRef(null);

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

  return (!userName || hideLogin) ? null : e(React.Fragment, null,
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
