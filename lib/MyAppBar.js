"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

var MaterialUI = _interopRequireWildcard(require("@material-ui/core"));

var _AppConfigContext = _interopRequireDefault(require("./AppConfigContext"));

var _MessageContext = _interopRequireDefault(require("./MessageContext"));

var _UserContext = _interopRequireDefault(require("./UserContext"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var e = _react["default"].createElement;
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
  var _useAppConfig = (0, _AppConfigContext["default"])(),
      _useAppConfig$appConf = _useAppConfig.appConfig,
      appExternalLoginUrl = _useAppConfig$appConf.appExternalLoginUrl,
      hideLogin = _useAppConfig$appConf.hideLogin;

  var _useUser = (0, _UserContext["default"])(),
      userName = _useUser.user.name;

  return userName || hideLogin ? null : e(_react["default"].Fragment, null, e(Button, {
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

  var _React$useState = _react["default"].useState(false),
      accountMenuOpened = _React$useState[0],
      setAccountMenuOpened = _React$useState[1];

  var accountMenuRef = _react["default"].useRef(null);

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

  return !userName || hideLogin ? null : e(_react["default"].Fragment, null, e(IconButton, {
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
  var location = (0, _reactRouterDom.useLocation)();
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

var _default = MyAppBar;
exports["default"] = _default;
module.exports = exports.default;