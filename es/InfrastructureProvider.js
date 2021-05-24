import React from 'react';
import AppThemeProvider from './AppThemeProvider';
import { MessageProvider } from './MessageContext';
import { UserProvider } from './UserContext';
import { DDBProvider } from './DDBContext';
import { LambdaProvider } from './LambdaContext';
import { AppConfigProvider } from './AppConfigContext';
var e = React.createElement;

var InfrastructureProvider = function InfrastructureProvider(_ref) {
  var appConfig = _ref.appConfig,
      children = _ref.children;
  return e(AppThemeProvider, null, e(MessageProvider, null, e(AppConfigProvider, {
    appConfig: appConfig
  }, e(UserProvider, null, e(DDBProvider, null, e(LambdaProvider, null, children))))));
};

export default InfrastructureProvider;