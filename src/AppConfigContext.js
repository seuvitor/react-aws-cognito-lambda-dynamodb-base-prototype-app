import React from 'react';

const e = React.createElement;

const AppConfigContext = React.createContext();

const AppConfigProvider = ({
  appConfig,
  children
}) => e(AppConfigContext.Provider, { value: { appConfig } }, children);

export default AppConfigContext;
export { AppConfigProvider };
