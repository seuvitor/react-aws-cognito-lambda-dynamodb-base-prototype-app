import { createContext, createElement as e, useContext } from 'react';
var AppConfigContext = createContext();

var makeAppConfig = function makeAppConfig(_ref) {
  var appHost = _ref.appHost,
      appBasePath = _ref.appBasePath,
      appRegion = _ref.appRegion,
      appUserPoolId = _ref.appUserPoolId,
      appUserPoolDomain = _ref.appUserPoolDomain,
      appClientId = _ref.appClientId,
      appIdentityPoolId = _ref.appIdentityPoolId,
      appRefreshTokenStorageKey = _ref.appRefreshTokenStorageKey,
      appLogoUrl = _ref.appLogoUrl,
      appMessages = _ref.appMessages,
      hideLogin = _ref.hideLogin;
  var appBaseAuthUrl = "https://" + appUserPoolDomain + ".auth." + appRegion + ".amazoncognito.com";
  var appAuthRedirect = "" + appHost + appBasePath + "?auth-redirect";
  var appAuthUrl = appBaseAuthUrl + "/oauth2/token";
  var appExternalLoginUrl = appBaseAuthUrl + "/login?client_id=" + appClientId + "&response_type=code&scope=email+openid+profile&redirect_uri=" + appAuthRedirect;
  return {
    appHost: appHost,
    appBasePath: appBasePath,
    appRegion: appRegion,
    appUserPoolId: appUserPoolId,
    appUserPoolDomain: appUserPoolDomain,
    appClientId: appClientId,
    appIdentityPoolId: appIdentityPoolId,
    appBaseAuthUrl: appBaseAuthUrl,
    appAuthRedirect: appAuthRedirect,
    appAuthUrl: appAuthUrl,
    appExternalLoginUrl: appExternalLoginUrl,
    appRefreshTokenStorageKey: appRefreshTokenStorageKey,
    appLogoUrl: appLogoUrl,
    appMessages: appMessages,
    hideLogin: hideLogin || false
  };
};

var AppConfigProvider = function AppConfigProvider(_ref2) {
  var appConfig = _ref2.appConfig,
      children = _ref2.children;
  return e(AppConfigContext.Provider, {
    value: {
      appConfig: appConfig
    }
  }, children);
};

var useAppConfig = function useAppConfig() {
  var _useContext = useContext(AppConfigContext),
      appConfig = _useContext.appConfig;

  return {
    appConfig: appConfig
  };
};

export default useAppConfig;
export { AppConfigProvider, makeAppConfig };