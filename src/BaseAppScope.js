import React, { useEffect, useState } from 'react';
import {
  HashRouter, Route, Routes, useNavigate
} from 'react-router-dom';

import AuthRedirect from './AuthRedirect';
import InfrastructureProvider from './InfrastructureProvider';

const useBaseAppScopeState = (appRoutes) => {
  const [routes] = useState([
    ...appRoutes,
    {
      name: 'authentication',
      label: 'Athentication',
      path: '/authentication/:authorization_code',
      hideFromMenu: true,
      component: AuthRedirect
    }]);
  return { routes };
};

const RedirectAuthCode = ({ appConfig }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === appConfig.appBasePath) {
      const search = new URLSearchParams(window.location.search);
      if (search.get('auth-redirect') !== null && search.get('code') !== null) {
        window.history.replaceState({}, '', window.location.pathname);
        navigate(`/authentication/${search.get('code')}`, { replace: true });
      }
    }
  }, []);

  return null;
};

const BaseAppScope = ({ appConfig, routes, children }) => (
  <InfrastructureProvider appConfig={appConfig}>
    <HashRouter>
      {children}
      <RedirectAuthCode appConfig={appConfig} />
      <Routes>
        {routes.map((route) => (
          <Route key={`${route.name}-route`} exact={true} path={route.path} element={<route.component />} {...route.options} />
        ))}
      </Routes>
    </HashRouter>
  </InfrastructureProvider>
);

export default BaseAppScope;
export { useBaseAppScopeState };
