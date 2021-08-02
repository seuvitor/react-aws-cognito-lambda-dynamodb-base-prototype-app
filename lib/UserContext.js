"use strict";

exports.__esModule = true;
exports.UserProvider = exports["default"] = void 0;

var _react = require("react");

var _credentialProviderCognitoIdentity = require("@aws-sdk/credential-provider-cognito-identity");

var _clientCognitoIdentity = require("@aws-sdk/client-cognito-identity");

var _AppConfigContext = _interopRequireDefault(require("./AppConfigContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var UserContext = (0, _react.createContext)();

var useSetInterval = function useSetInterval(callback, seconds) {
  var intervalRef = (0, _react.useRef)();
  var cancel = (0, _react.useCallback)(function () {
    var interval = intervalRef.current;

    if (interval) {
      intervalRef.current = undefined;
      clearInterval(interval);
    }
  }, [intervalRef]);
  (0, _react.useEffect)(function () {
    intervalRef.current = setInterval(callback, seconds);
    return cancel;
  }, [callback, seconds, cancel]);
  return cancel;
};

var UserProvider = function UserProvider(_ref) {
  var children = _ref.children;

  var _useAppConfig = (0, _AppConfigContext["default"])(),
      _useAppConfig$appConf = _useAppConfig.appConfig,
      appAuthRedirect = _useAppConfig$appConf.appAuthRedirect,
      appAuthUrl = _useAppConfig$appConf.appAuthUrl,
      appClientId = _useAppConfig$appConf.appClientId,
      appIdentityPoolId = _useAppConfig$appConf.appIdentityPoolId,
      appRegion = _useAppConfig$appConf.appRegion,
      appUserPoolId = _useAppConfig$appConf.appUserPoolId,
      appRefreshTokenStorageKey = _useAppConfig$appConf.appRefreshTokenStorageKey,
      appMessages = _useAppConfig$appConf.appMessages;

  var _useState = (0, _react.useState)({
    identityId: undefined,
    id: undefined,
    name: undefined,
    email: undefined,
    groups: undefined,
    idToken: undefined,
    accessToken: undefined
  }),
      user = _useState[0],
      setUser = _useState[1];

  var _useState2 = (0, _react.useState)(sessionStorage.getItem(appRefreshTokenStorageKey)),
      refreshToken = _useState2[0],
      setRefreshToken = _useState2[1];

  var _useState3 = (0, _react.useState)(undefined),
      awsConfig = _useState3[0],
      setAwsConfig = _useState3[1];

  var _useState4 = (0, _react.useState)(25 * 60000),
      refreshTokenInterval = _useState4[0];

  var _useState5 = (0, _react.useState)(undefined),
      awsCredentials = _useState5[0],
      setAwsCredentials = _useState5[1];

  (0, _react.useEffect)(function () {
    if (refreshToken) {
      sessionStorage.setItem(appRefreshTokenStorageKey, refreshToken);
    } else {
      sessionStorage.removeItem(appRefreshTokenStorageKey);
    }
  }, [refreshToken, appRefreshTokenStorageKey]);
  var logoff = (0, _react.useCallback)(function () {
    return new Promise(function (resolve) {
      setUser({
        identityId: undefined,
        id: undefined,
        name: undefined,
        email: undefined,
        groups: undefined,
        idToken: undefined,
        accessToken: undefined
      });
      setRefreshToken(undefined);
      setAwsConfig(undefined);
      resolve();
    });
  }, []);
  (0, _react.useEffect)(function () {
    if (awsCredentials) {
      setAwsConfig(function (oldAwsConfig) {
        if (oldAwsConfig) {
          oldAwsConfig.update({
            credentials: awsCredentials
          });
          return oldAwsConfig;
        }

        return {
          region: appRegion,
          credentials: awsCredentials
        };
      });
    } else {
      setAwsConfig(undefined);
    }
  }, [awsCredentials, appRegion]);
  var loginWithAwsCognitoIdentityPool = (0, _react.useCallback)(function (idToken, accessToken) {
    var _logins;

    var newCredentials = (0, _credentialProviderCognitoIdentity.fromCognitoIdentityPool)(_extends({
      client: new _clientCognitoIdentity.CognitoIdentityClient({
        region: appRegion
      }),
      identityPoolId: appIdentityPoolId
    }, idToken && {
      logins: (_logins = {}, _logins[appUserPoolId] = idToken, _logins)
    }));
    return new Promise(function (resolve, reject) {
      newCredentials().then(function (creds) {
        setAwsCredentials(newCredentials);
        setUser(function (oldUser) {
          var idTokenPayload = idToken && JSON.parse(atob(idToken.split('.')[1]));
          oldUser.identityId = creds.identityId;
          oldUser.id = idTokenPayload && idTokenPayload.sub;
          oldUser.name = idTokenPayload ? idTokenPayload.name : appMessages.LOGGED_OUT_USER;
          oldUser.email = idTokenPayload && idTokenPayload.email;
          oldUser.groups = idTokenPayload && idTokenPayload['cognito:groups'];
          oldUser.idToken = idToken;
          oldUser.accessToken = accessToken;
          return oldUser;
        });
        resolve();
      })["catch"](function (err) {
        setAwsCredentials(undefined);
        setUser({
          identityId: undefined,
          id: undefined,
          name: undefined,
          email: undefined,
          groups: undefined,
          idToken: undefined,
          accessToken: undefined
        });
        reject(err);
      });
    });
  }, [appIdentityPoolId, appRegion, appUserPoolId, appMessages]);
  var refreshIdAndAccessTokens = (0, _react.useCallback)(function (refreshTokenParam) {
    return new Promise(function (resolve, reject) {
      if (refreshTokenParam) {
        fetch(appAuthUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: "grant_type=refresh_token&client_id=" + appClientId + "&refresh_token=" + refreshTokenParam
        }).then(function (response) {
          response.json().then(function (res) {
            loginWithAwsCognitoIdentityPool(res.id_token, res.access_token).then(function () {
              resolve();
            })["catch"](function (err) {
              console.error(appMessages.LOG_COULD_NOT_LOGIN_WITH_REFRESHED_TOKENS, err);
              reject(err);
            });
          })["catch"](function (err) {
            console.error(appMessages.LOG_COULD_NOT_DECODE_AUTHENTICATION_RESPONSE, err);
            reject(err);
          });
        })["catch"](function (err) {
          console.error(appMessages.LOG_COULD_NOT_GET_REFRESHED_TOKENS, err);
          reject(err);
        });
      } else {
        console.warn(appMessages.LOG_NO_REFRESH_TOKEN_AVAILABLE);
        reject(new Error(appMessages.LOG_NO_REFRESH_TOKEN_AVAILABLE));
      }
    });
  }, [loginWithAwsCognitoIdentityPool, appAuthUrl, appClientId, appMessages]);
  var scheduledRefreshIdAndAccessTokens = (0, _react.useCallback)(function () {
    refreshIdAndAccessTokens(refreshToken)["catch"](function (err) {
      console.error(appMessages.LOG_COULD_NOT_REFRESH_TOKENS, err);
    });
  }, [refreshToken, refreshIdAndAccessTokens, appMessages]);
  useSetInterval(scheduledRefreshIdAndAccessTokens, refreshTokenInterval);
  var loginAnonymously = (0, _react.useCallback)(function () {
    return loginWithAwsCognitoIdentityPool();
  }, [loginWithAwsCognitoIdentityPool]);
  var loginWithAuthorizationCode = (0, _react.useCallback)(function (authorizationCode) {
    return new Promise(function (resolve, reject) {
      fetch(appAuthUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: "grant_type=authorization_code&client_id=" + appClientId + "&code=" + authorizationCode + "&redirect_uri=" + appAuthRedirect
      }).then(function (response) {
        response.json().then(function (res) {
          refreshIdAndAccessTokens(res.refresh_token).then(function () {
            setRefreshToken(res.refresh_token);
            resolve();
          })["catch"](function (err) {
            console.error(appMessages.LOG_COULD_NOT_LOGIN_WITH_REFRESHED_TOKENS, err);
            setRefreshToken(undefined);
            reject(err);
          });
        })["catch"](function (err) {
          console.error(appMessages.LOG_COULD_NOT_DECODE_AUTHENTICATION_RESPONSE, err);
          setRefreshToken(undefined);
          reject(err);
        });
      })["catch"](function (err) {
        console.error(appMessages.LOG_COULD_NOT_GET_IDENTIFICATION_TOKENS, err);
        setRefreshToken(undefined);
        reject(err);
      });
    });
  }, [refreshIdAndAccessTokens, appAuthRedirect, appAuthUrl, appClientId, appMessages]);
  (0, _react.useEffect)(function () {
    if (refreshToken && !awsCredentials) {
      refreshIdAndAccessTokens(refreshToken)["catch"](function (err) {
        console.error(appMessages.LOG_COULD_NOT_REFRESH_TOKENS, err);
      });
    }
  }, [refreshToken, awsCredentials, refreshIdAndAccessTokens, appMessages]);
  return (0, _react.createElement)(UserContext.Provider, {
    value: {
      user: user,
      awsConfig: awsConfig,
      awsCredentials: awsCredentials,
      loginAnonymously: loginAnonymously,
      loginWithAuthorizationCode: loginWithAuthorizationCode,
      logoff: logoff
    }
  }, children);
};

exports.UserProvider = UserProvider;

var useUser = function useUser() {
  var _useContext = (0, _react.useContext)(UserContext),
      user = _useContext.user,
      awsConfig = _useContext.awsConfig,
      awsCredentials = _useContext.awsCredentials,
      loginAnonymously = _useContext.loginAnonymously,
      loginWithAuthorizationCode = _useContext.loginWithAuthorizationCode,
      logoff = _useContext.logoff;

  return {
    user: user,
    awsConfig: awsConfig,
    awsCredentials: awsCredentials,
    loginAnonymously: loginAnonymously,
    loginWithAuthorizationCode: loginWithAuthorizationCode,
    logoff: logoff
  };
};

var _default = useUser;
exports["default"] = _default;