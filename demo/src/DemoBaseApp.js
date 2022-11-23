import React, { useState } from 'react';

import {
  BaseAppScope,
  useBaseAppScopeState
} from '../../src';
import AppBar from './AppBar';
import AppDrawer from './AppDrawer';
import MessageArea from './MessageArea';
import SpinnerArea from './SpinnerArea';

const DemoBaseApp = ({ appConfig, appRoutes }) => {
  const { routes } = useBaseAppScopeState(appRoutes);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return <BaseAppScope appConfig={appConfig} routes={routes}>
    <AppBar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} routes={routes} />
    <AppDrawer routes={routes} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
    <MessageArea />
    <SpinnerArea />
  </BaseAppScope>;
};

export default DemoBaseApp;
