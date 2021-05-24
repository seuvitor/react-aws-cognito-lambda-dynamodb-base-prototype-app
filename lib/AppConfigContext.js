"use strict";

exports.__esModule = true;
exports.makeAppConfig = exports.AppConfigProvider = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var e = _react["default"].createElement;

var AppConfigContext = _react["default"].createContext();

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

exports.makeAppConfig = makeAppConfig;

var AppConfigProvider = function AppConfigProvider(_ref2) {
  var appConfig = _ref2.appConfig,
      children = _ref2.children;
  return e(AppConfigContext.Provider, {
    value: {
      appConfig: appConfig
    }
  }, children);
};

exports.AppConfigProvider = AppConfigProvider;
var _default = AppConfigContext;
exports["default"] = _default;