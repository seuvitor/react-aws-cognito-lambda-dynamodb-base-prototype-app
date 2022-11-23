import React, { createContext, useContext } from 'react';

const AppConfigContext = createContext();

const makeAppConfig = ({
  appHost,
  appBasePath,
  appRegion,
  appUserPoolId,
  appUserPoolDomain,
  appClientId,
  appIdentityPoolId,
  appRefreshTokenStorageKey,
  appLogoUrl,
  appMessages,
  hideLogin
}) => {
  const appBaseAuthUrl = `https://${appUserPoolDomain}.auth.${appRegion}.amazoncognito.com`;
  const appAuthRedirect = `${appHost}${appBasePath}?auth-redirect`;
  const appAuthUrl = `${appBaseAuthUrl}/oauth2/token`;
  const appExternalLoginUrl = `${appBaseAuthUrl}/login?client_id=${appClientId}&response_type=code&scope=email+openid+profile&redirect_uri=${appAuthRedirect}`;

  return {
    appHost,
    appBasePath,
    appRegion,
    appUserPoolId,
    appUserPoolDomain,
    appClientId,
    appIdentityPoolId,
    appBaseAuthUrl,
    appAuthRedirect,
    appAuthUrl,
    appExternalLoginUrl,
    appRefreshTokenStorageKey,
    appLogoUrl,
    appMessages,
    hideLogin: hideLogin || false
  };
};

const AppConfigProvider = ({ appConfig, children }) => (
  <AppConfigContext.Provider value={{ appConfig }}>
    {children}
  </AppConfigContext.Provider>
);

const useAppConfig = () => {
  const { appConfig } = useContext(AppConfigContext);

  return { appConfig };
};

export default useAppConfig;
export { AppConfigProvider, makeAppConfig };
