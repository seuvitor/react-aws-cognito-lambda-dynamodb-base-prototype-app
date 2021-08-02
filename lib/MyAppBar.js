"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = require("react");

var _reactRouterDom = require("react-router-dom");

var _core = require("@material-ui/core");

var _AppConfigContext = _interopRequireDefault(require("./AppConfigContext"));

var _MessageContext = _interopRequireDefault(require("./MessageContext"));

var _UserContext = _interopRequireDefault(require("./UserContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var LoginButton = function LoginButton() {
  var _useAppConfig = (0, _AppConfigContext["default"])(),
      _useAppConfig$appConf = _useAppConfig.appConfig,
      appExternalLoginUrl = _useAppConfig$appConf.appExternalLoginUrl,
      hideLogin = _useAppConfig$appConf.hideLogin;

  var _useUser = (0, _UserContext["default"])(),
      userName = _useUser.user.name;

  return userName || hideLogin ? null : (0, _react.createElement)(_react.Fragment, null, (0, _react.createElement)(_core.Button, {
    color: 'inherit',
    href: appExternalLoginUrl
  }, 'Login'));
};

var AccountButton = function AccountButton() {
  var _useAppConfig2 = (0, _AppConfigContext["default"])(),
      _useAppConfig2$appCon = _useAppConfig2.appConfig,
      appMessages = _useAppConfig2$appCon.appMessages,
      hideLogin = _useAppConfig2$appCon.hideLogin;

  var _useMessage = (0, _MessageContext["default"])(),
      showMessage = _useMessage.showMessage;

  var _useUser2 = (0, _UserContext["default"])(),
      userName = _useUser2.user.name,
      logoff = _useUser2.logoff;

  var _useState = (0, _react.useState)(false),
      accountMenuOpened = _useState[0],
      setAccountMenuOpened = _useState[1];

  var accountMenuRef = (0, _react.useRef)(null);

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

  return !userName || hideLogin ? null : (0, _react.createElement)(_react.Fragment, null, (0, _react.createElement)(_core.IconButton, {
    color: 'inherit',
    ref: accountMenuRef,
    onClick: handleAccountMenuClick
  }, (0, _react.createElement)(_core.Icon, null, 'account_circle')), (0, _react.createElement)(_core.Menu, {
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
  }, (0, _react.createElement)(_core.MenuItem, {
    disabled: true
  }, userName), (0, _react.createElement)(_core.Divider, null, null), (0, _react.createElement)(_core.MenuItem, {
    onClick: handleLogoff
  }, 'Logoff')));
};

var MyAppBar = function MyAppBar(_ref) {
  var setDrawerOpen = _ref.setDrawerOpen,
      routes = _ref.routes;
  var location = (0, _reactRouterDom.useLocation)();
  var currentRoute = routes.find(function (route) {
    return route.path === location.pathname;
  });
  return (0, _react.createElement)(_core.AppBar, null, (0, _react.createElement)(_core.Toolbar, null, (0, _react.createElement)(_core.IconButton, {
    edge: 'start',
    color: 'inherit',
    onClick: function onClick() {
      return setDrawerOpen(true);
    }
  }, (0, _react.createElement)(_core.Icon, null, 'menu')), (0, _react.createElement)(_core.Typography, {
    style: {
      flexGrow: 1
    }
  }, currentRoute ? currentRoute.label : ''), (0, _react.createElement)(LoginButton, null, null), (0, _react.createElement)(AccountButton, null, null)));
};

var _default = MyAppBar;
exports["default"] = _default;
module.exports = exports.default;