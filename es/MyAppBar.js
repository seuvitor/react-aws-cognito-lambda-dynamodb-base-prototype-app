import React from 'react';
import { useLocation } from 'react-router-dom';
import * as MaterialUI from '@material-ui/core';
import AppConfigContext from './AppConfigContext';
import MessageContext from './MessageContext';
import UserContext from './UserContext';
var e = React.createElement;
var AppBar = MaterialUI.AppBar,
    Button = MaterialUI.Button,
    Divider = MaterialUI.Divider,
    Icon = MaterialUI.Icon,
    IconButton = MaterialUI.IconButton,
    Menu = MaterialUI.Menu,
    MenuItem = MaterialUI.MenuItem,
    Toolbar = MaterialUI.Toolbar,
    Typography = MaterialUI.Typography;

var LoginButton = function LoginButton() {
  var _React$useContext = React.useContext(AppConfigContext),
      _React$useContext$app = _React$useContext.appConfig,
      appExternalLoginUrl = _React$useContext$app.appExternalLoginUrl,
      hideLogin = _React$useContext$app.hideLogin;

  var _React$useContext2 = React.useContext(UserContext),
      userName = _React$useContext2.user.name;

  return userName || hideLogin ? null : e(React.Fragment, null, e(Button, {
    color: 'inherit',
    href: appExternalLoginUrl
  }, 'Login'));
};

var AccountButton = function AccountButton() {
  var _React$useContext3 = React.useContext(AppConfigContext),
      _React$useContext3$ap = _React$useContext3.appConfig,
      appMessages = _React$useContext3$ap.appMessages,
      hideLogin = _React$useContext3$ap.hideLogin;

  var _React$useContext4 = React.useContext(MessageContext),
      showMessage = _React$useContext4.showMessage;

  var _React$useContext5 = React.useContext(UserContext),
      userName = _React$useContext5.user.name,
      logoff = _React$useContext5.logoff;

  var _React$useState = React.useState(false),
      accountMenuOpened = _React$useState[0],
      setAccountMenuOpened = _React$useState[1];

  var accountMenuRef = React.useRef(null);

  var handleAccountMenuClick = function handleAccountMenuClick() {
    setAccountMenuOpened(true);
  };

  var handleAccountMenuClose = function handleAccountMenuClose() {
    setAccountMenuOpened(false);
  };

  var handleLogoff = function handleLogoff() {
    logoff().then(function () {
      showMessage(appMessages.LOGOUT_SUCCESSFUL);
    })["catch"](function () {
      showMessage(appMessages.LOGOUT_FAILED);
    });
    setAccountMenuOpened(false);
  };

  return !userName || hideLogin ? null : e(React.Fragment, null, e(IconButton, {
    color: 'inherit',
    ref: accountMenuRef,
    onClick: handleAccountMenuClick
  }, e(Icon, null, 'account_circle')), e(Menu, {
    open: accountMenuOpened,
    onClose: handleAccountMenuClose,
    anchorEl: accountMenuRef.current,
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'right'
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'right'
    }
  }, e(MenuItem, {
    disabled: true
  }, userName), e(Divider, null, null), e(MenuItem, {
    onClick: handleLogoff
  }, 'Logoff')));
};

var MyAppBar = function MyAppBar(_ref) {
  var setDrawerOpen = _ref.setDrawerOpen,
      routes = _ref.routes;
  var location = useLocation();
  var currentRoute = routes.find(function (route) {
    return route.path === location.pathname;
  });
  return e(AppBar, null, e(Toolbar, null, e(IconButton, {
    edge: 'start',
    color: 'inherit',
    onClick: function onClick() {
      return setDrawerOpen(true);
    }
  }, e(Icon, null, 'menu')), e(Typography, {
    style: {
      flexGrow: 1
    }
  }, currentRoute ? currentRoute.label : ''), e(LoginButton, null, null), e(AccountButton, null, null)));
};

export default MyAppBar;