"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

var MaterialUI = _interopRequireWildcard(require("@material-ui/core"));

var _AuthRedirect = _interopRequireDefault(require("./AuthRedirect"));

var _InfrastructureProvider = _interopRequireDefault(require("./InfrastructureProvider"));

var _MyAppBar = _interopRequireDefault(require("./MyAppBar"));

var _AppDrawer = _interopRequireDefault(require("./AppDrawer"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var e = _react["default"].createElement;
var Toolbar = MaterialUI.Toolbar;

var BaseApp = function BaseApp(_ref) {
  var appConfig = _ref.appConfig,
      appRoutes = _ref.appRoutes;

  var _React$useState = _react["default"].useState(false),
      drawerOpen = _React$useState[0],
      setDrawerOpen = _React$useState[1];

  var _React$useState2 = _react["default"].useState([].concat(appRoutes, [{
    name: 'authentication',
    label: 'Athentication',
    path: '/authentication/:authorization_code',
    hideFromMenu: true,
    component: _AuthRedirect["default"]
  }])),
      routes = _React$useState2[0];

  _react["default"].useLayoutEffect(function () {
    if (window.location.pathname === appConfig.appBasePath) {
      var search = new URLSearchParams(window.location.search);

      if (search.get('auth-redirect') !== null && search.get('code') !== null) {
        window.history.replaceState({}, '', appConfig.appBasePath + "#/authentication/" + search.get('code'));
      }
    }
  }, [appConfig.appBasePath]);

  return e(_InfrastructureProvider["default"], {
    appConfig: appConfig
  }, e(_reactRouterDom.HashRouter, null, e(_MyAppBar["default"], {
    setDrawerOpen: setDrawerOpen,
    routes: routes
  }, null), e(_AppDrawer["default"], {
    routes: routes,
    drawerOpen: drawerOpen,
    setDrawerOpen: setDrawerOpen
  }), e(Toolbar, null, null), e(_reactRouterDom.Switch, null, routes.map(function (route) {
    return e(_reactRouterDom.Route, _extends({
      key: route.name + "-route",
      path: route.path
    }, route.options), e(route.component));
  }))));
};

var _default = BaseApp;
exports["default"] = _default;
module.exports = exports.default;