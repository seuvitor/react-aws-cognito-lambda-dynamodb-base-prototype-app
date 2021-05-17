import React from 'react';
import * as MaterialUI from '@material-ui/core';

import AuthRedirect from './AuthRedirect';
import InfrastructureProvider from './InfrastructureProvider';
import MyAppBar from './MyAppBar';
import AppDrawer from './AppDrawer';

const e = React.createElement;

const {
  HashRouter,
  Route,
  Switch
} = window.ReactRouterDOM;

const { Toolbar } = MaterialUI;

const BaseApp = ({ appConfig, appRoutes }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const [routes] = React.useState([
    ...appRoutes,
    {
      name: 'authentication',
      label: 'Athentication',
      path: '/authentication/:authorization_code',
      hideFromMenu: true,
      component: AuthRedirect
    }]);

  React.useLayoutEffect(() => {
    if (window.location.pathname === appConfig.appBasePath) {
      const search = new URLSearchParams(window.location.search);
      if (search.get('auth-redirect') !== null && search.get('code') !== null) {
        window.history.replaceState({}, '', `${appConfig.appBasePath}#/authentication/${search.get('code')}`);
      }
    }
  }, [appConfig.appBasePath]);

  return e(InfrastructureProvider, { appConfig },
    e(HashRouter, null,
      e(MyAppBar, { setDrawerOpen, routes }, null),
      e(AppDrawer, { routes, drawerOpen, setDrawerOpen }),
      e(Toolbar, null, null),
      e(Switch, null, routes.map((route) => (
        e(Route, { key: `${route.name}-route`, path: route.path, ...route.options },
          e(route.component))
      )))));
};

export default BaseApp;
