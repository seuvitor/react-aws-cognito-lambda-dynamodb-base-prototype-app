import React from 'react';
import { render } from 'react-dom';

import { BaseApp, makeAppConfig } from '../../src';

const myAppMessages = {
  LOGIN_SUCCESSFUL: 'User logged-in successfully',
  LOGIN_FAILED: 'Login failed',
  LOGOUT_SUCCESSFUL: 'User logged-out successfully',
  LOGOUT_FAILED: 'Log-out failed',
  LOGGED_OUT_USER: 'Logged-out User',
  LOG_COULD_NOT_LOGIN_WITH_REFRESHED_TOKENS: 'Could not login with refreshed tokens',
  LOG_COULD_NOT_DECODE_AUTHENTICATION_RESPONSE: 'Could not decode authentication response',
  LOG_COULD_NOT_GET_REFRESHED_TOKENS: 'Could not get refreshed tokens',
  LOG_NO_REFRESH_TOKEN_AVAILABLE: 'No refresh token available',
  LOG_COULD_NOT_REFRESH_TOKENS: 'Could not refresh tokens',
  LOG_COULD_NOT_GET_IDENTIFICATION_TOKENS: 'Could not get identification tokens with this authorization code'
};

const myEnv = {
  appHost: 'http://localhost:5000',
  appBasePath: '/',
  appLogoUrl: undefined,
  appRegion: 'us-east-N',
  appUserPoolId: 'cognito-idp.us-east-N.amazonaws.com/us-east-N_XYZxyzXYZ',
  appUserPoolDomain: 'my-user-pool-domain',
  appClientId: 'abc123def456ghi789jkl012mn',
  appIdentityPoolId: 'us-east-N:abcd1234-ab12-cd34-de56-abcdef123456'
};

const appConfig = makeAppConfig({
  ...myEnv,
  appRefreshTokenStorageKey: 'my-demo-app-wallet-refresh-token',
  appMessages: myAppMessages
});

const MainContent = () => <div>Main content text.</div>;

const appRoutes = [
  {
    name: 'main',
    label: 'Main',
    path: '/',
    hideFromMenu: false,
    component: MainContent,
    options: { exact: true }
  }
];

const Demo = () => (
  <BaseApp appRoutes={appRoutes} appConfig={appConfig} />
);

export default Demo;

render(<Demo/>, document.querySelector('#demo'));
