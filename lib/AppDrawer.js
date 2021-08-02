"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = require("react");

var _reactRouterDom = require("react-router-dom");

var _core = require("@material-ui/core");

var _AppConfigContext = _interopRequireDefault(require("./AppConfigContext"));

var _UserContext = _interopRequireDefault(require("./UserContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

  return (0, _react.createElement)(_core.Drawer, {
    open: drawerOpen,
    onClose: handleClose
  }, (0, _react.createElement)(_core.Toolbar, {
    onClick: handleClose,
    style: {
      padding: 'inherit'
    }
  }, (0, _react.createElement)(_core.ListItem, {
    button: true,
    style: {
      justifyContent: 'space-between',
      height: '100%'
    }
  }, (0, _react.createElement)(_core.Box, {
    style: {
      flex: 'auto',
      textAlign: 'center'
    }
  }, (0, _react.createElement)('img', {
    src: appLogoUrl,
    width: '70px',
    height: '70px'
  }, null)), (0, _react.createElement)(_core.Icon, null, 'chevron_left'))), (0, _react.createElement)(_core.Divider, null, null), routes.filter(function (route) {
    return !route.hideFromMenu;
  }).filter(function (route) {
    return userFromAuthorizedGroup(route.authorizedGroups);
  }).map(function (route) {
    return (0, _react.createElement)(_core.ListItem, _extends({
      key: route.name + "-route-drawer-item",
      button: true,
      component: _reactRouterDom.NavLink,
      activeClassName: 'Mui-selected',
      to: route.path,
      onClick: handleClose
    }, route.options), (0, _react.createElement)(_core.ListItemText, {
      primary: route.label
    }, null));
  }));
};

var _default = AppDrawer;
exports["default"] = _default;
module.exports = exports.default;