function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import * as MaterialUI from '@material-ui/core';
import AuthRedirect from './AuthRedirect';
import InfrastructureProvider from './InfrastructureProvider';
import MyAppBar from './MyAppBar';
import AppDrawer from './AppDrawer';
var e = React.createElement;
var Toolbar = MaterialUI.Toolbar;

var BaseApp = function BaseApp(_ref) {
  var appConfig = _ref.appConfig,
      appRoutes = _ref.appRoutes;

  var _React$useState = React.useState(false),
      drawerOpen = _React$useState[0],
      setDrawerOpen = _React$useState[1];

  var _React$useState2 = React.useState([].concat(appRoutes, [{
    name: 'authentication',
    label: 'Athentication',
    path: '/authentication/:authorization_code',
    hideFromMenu: true,
    component: AuthRedirect
  }])),
      routes = _React$useState2[0];

  React.useLayoutEffect(function () {
    if (window.location.pathname === appConfig.appBasePath) {
      var search = new URLSearchParams(window.location.search);

      if (search.get('auth-redirect') !== null && search.get('code') !== null) {
        window.history.replaceState({}, '', appConfig.appBasePath + "#/authentication/" + search.get('code'));
      }
    }
  }, [appConfig.appBasePath]);
  return e(InfrastructureProvider, {
    appConfig: appConfig
  }, e(HashRouter, null, e(MyAppBar, {
    setDrawerOpen: setDrawerOpen,
    routes: routes
  }, null), e(AppDrawer, {
    routes: routes,
    drawerOpen: drawerOpen,
    setDrawerOpen: setDrawerOpen
  }), e(Toolbar, null, null), e(Switch, null, routes.map(function (route) {
    return e(Route, _extends({
      key: route.name + "-route",
      path: route.path
    }, route.options), e(route.component));
  }))));
};

export default BaseApp;