import { createElement as e, useLayoutEffect, useState } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Toolbar } from '@material-ui/core';

import AuthRedirect from './AuthRedirect';
import InfrastructureProvider from './InfrastructureProvider';
import MyAppBar from './MyAppBar';
import AppDrawer from './AppDrawer';

const BaseApp = ({ appConfig, appRoutes }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [routes] = useState([
    ...appRoutes,
    {
      name: 'authentication',
      label: 'Athentication',
      path: '/authentication/:authorization_code',
      hideFromMenu: true,
      component: AuthRedirect
    }]);

  useLayoutEffect(() => {
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
