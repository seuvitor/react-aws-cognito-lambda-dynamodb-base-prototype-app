import React from 'react';
import { createRoot } from 'react-dom/client';

import { makeAppConfig } from '../../src';
import DemoBaseApp from './DemoBaseApp';

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
  appLogoUrl: 'demoapp.png',
  appRegion: 'us-east-N',
  appUserPoolId: 'cognito-idp.us-east-N.amazonaws.com/us-east-N_XYZxyzXYZ',
  appUserPoolDomain: 'demoapp-abcdef12',
  appClientId: 'abc123def456ghi789jkl012mn',
  appIdentityPoolId: 'us-east-N:abcd1234-ab12-cd34-de56-abcdef123456'
};

const appConfig = makeAppConfig({
  ...myEnv,
  appRefreshTokenStorageKey: 'demoapp-refresh-token',
  appMessages: myAppMessages
});

const MainContent = () => <main><p>Main content text.</p></main>;

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
  <DemoBaseApp appRoutes={appRoutes} appConfig={appConfig} />
);

export default Demo;

const root = createRoot(document.querySelector('#demo'));
root.render(<Demo/>);
