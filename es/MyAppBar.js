import React from 'react';
import { useLocation } from 'react-router-dom';
import * as MaterialUI from '@material-ui/core';
import useAppConfig from './AppConfigContext';
import useMessage from './MessageContext';
import useUser from './UserContext';
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
  var _useAppConfig = useAppConfig(),
      _useAppConfig$appConf = _useAppConfig.appConfig,
      appExternalLoginUrl = _useAppConfig$appConf.appExternalLoginUrl,
      hideLogin = _useAppConfig$appConf.hideLogin;

  var _useUser = useUser(),
      userName = _useUser.user.name;

  return userName || hideLogin ? null : e(React.Fragment, null, e(Button, {
    color: 'inherit',
    href: appExternalLoginUrl
  }, 'Login'));
};

var AccountButton = function AccountButton() {
  var _useAppConfig2 = useAppConfig(),
      _useAppConfig2$appCon = _useAppConfig2.appConfig,
      appMessages = _useAppConfig2$appCon.appMessages,
      hideLogin = _useAppConfig2$appCon.hideLogin;

  var _useMessage = useMessage(),
      showMessage = _useMessage.showMessage;

  var _useUser2 = useUser(),
      userName = _useUser2.user.name,
      logoff = _useUser2.logoff;

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