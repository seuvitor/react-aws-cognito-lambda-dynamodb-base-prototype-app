"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = require("react");

var _reactRouterDom = require("react-router-dom");

var _core = require("@material-ui/core");

var _AuthRedirect = _interopRequireDefault(require("./AuthRedirect"));

var _InfrastructureProvider = _interopRequireDefault(require("./InfrastructureProvider"));

var _MyAppBar = _interopRequireDefault(require("./MyAppBar"));

var _AppDrawer = _interopRequireDefault(require("./AppDrawer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var BaseApp = function BaseApp(_ref) {
  var appConfig = _ref.appConfig,
      appRoutes = _ref.appRoutes;

  var _useState = (0, _react.useState)(false),
      drawerOpen = _useState[0],
      setDrawerOpen = _useState[1];

  var _useState2 = (0, _react.useState)([].concat(appRoutes, [{
    name: 'authentication',
    label: 'Athentication',
    path: '/authentication/:authorization_code',
    hideFromMenu: true,
    component: _AuthRedirect["default"]
  }])),
      routes = _useState2[0];

  (0, _react.useLayoutEffect)(function () {
    if (window.location.pathname === appConfig.appBasePath) {
      var search = new URLSearchParams(window.location.search);

      if (search.get('auth-redirect') !== null && search.get('code') !== null) {
        window.history.replaceState({}, '', appConfig.appBasePath + "#/authentication/" + search.get('code'));
      }
    }
  }, [appConfig.appBasePath]);
  return (0, _react.createElement)(_InfrastructureProvider["default"], {
    appConfig: appConfig
  }, (0, _react.createElement)(_reactRouterDom.HashRouter, null, (0, _react.createElement)(_MyAppBar["default"], {
    setDrawerOpen: setDrawerOpen,
    routes: routes
  }, null), (0, _react.createElement)(_AppDrawer["default"], {
    routes: routes,
    drawerOpen: drawerOpen,
    setDrawerOpen: setDrawerOpen
  }), (0, _react.createElement)(_core.Toolbar, null, null), (0, _react.createElement)(_reactRouterDom.Switch, null, routes.map(function (route) {
    return (0, _react.createElement)(_reactRouterDom.Route, _extends({
      key: route.name + "-route",
      path: route.path
    }, route.options), (0, _react.createElement)(route.component));
  }))));
};

var _default = BaseApp;
exports["default"] = _default;
module.exports = exports.default;