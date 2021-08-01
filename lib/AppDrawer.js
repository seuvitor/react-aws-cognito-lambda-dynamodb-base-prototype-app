"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

var MaterialUI = _interopRequireWildcard(require("@material-ui/core"));

var _AppConfigContext = _interopRequireDefault(require("./AppConfigContext"));

var _UserContext = _interopRequireDefault(require("./UserContext"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var e = _react["default"].createElement;
var Box = MaterialUI.Box,
    Divider = MaterialUI.Divider,
    Drawer = MaterialUI.Drawer,
    Icon = MaterialUI.Icon,
    ListItem = MaterialUI.ListItem,
    ListItemText = MaterialUI.ListItemText,
    Toolbar = MaterialUI.Toolbar;

var AppDrawer = function AppDrawer(_ref) {
  var routes = _ref.routes,
      drawerOpen = _ref.drawerOpen,
      setDrawerOpen = _ref.setDrawerOpen;

  var _useAppConfig = (0, _AppConfigContext["default"])(),
      appLogoUrl = _useAppConfig.appConfig.appLogoUrl;

  var _useUser = (0, _UserContext["default"])(),
      userGroups = _useUser.user.groups;

  var handleClose = function handleClose() {
    return setDrawerOpen(false);
  };

  var userFromAuthorizedGroup = function userFromAuthorizedGroup(authorizedGroups) {
    if (!authorizedGroups) {
      return true;
    }

    if (!userGroups) {
      return false;
    }

    return authorizedGroups.some(function (authorizedGroup) {
      return userGroups.includes(authorizedGroup);
    });
  };

  return e(Drawer, {
    open: drawerOpen,
    onClose: handleClose
  }, e(Toolbar, {
    onClick: handleClose,
    style: {
      padding: 'inherit'
    }
  }, e(ListItem, {
    button: true,
    style: {
      justifyContent: 'space-between',
      height: '100%'
    }
  }, e(Box, {
    style: {
      flex: 'auto',
      textAlign: 'center'
    }
  }, e('img', {
    src: appLogoUrl,
    width: '70px',
    height: '70px'
  }, null)), e(Icon, null, 'chevron_left'))), e(Divider, null, null), routes.filter(function (route) {
    return !route.hideFromMenu;
  }).filter(function (route) {
    return userFromAuthorizedGroup(route.authorizedGroups);
  }).map(function (route) {
    return e(ListItem, _extends({
      key: route.name + "-route-drawer-item",
      button: true,
      component: _reactRouterDom.NavLink,
      activeClassName: 'Mui-selected',
      to: route.path,
      onClick: handleClose
    }, route.options), e(ListItemText, {
      primary: route.label
    }, null));
  }));
};

var _default = AppDrawer;
exports["default"] = _default;
module.exports = exports.default;