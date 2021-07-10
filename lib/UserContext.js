"use strict";

exports.__esModule = true;
exports.UserProvider = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _AppConfigContext = _interopRequireDefault(require("./AppConfigContext"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var e = _react["default"].createElement;

var UserContext = _react["default"].createContext();

var useSetInterval = function useSetInterval(callback, seconds) {
  var intervalRef = _react["default"].useRef();

  var cancel = _react["default"].useCallback(function () {
    var interval = intervalRef.current;

    if (interval) {
      intervalRef.current = undefined;
      clearInterval(interval);
    }
  }, [intervalRef]);

  _react["default"].useEffect(function () {
    intervalRef.current = setInterval(callback, seconds);
    return cancel;
  }, [callback, seconds, cancel]);

  return cancel;
};

var UserProvider = function UserProvider(_ref) {
  var children = _ref.children;

  var _React$useContext = _react["default"].useContext(_AppConfigContext["default"]),
      _React$useContext$app = _React$useContext.appConfig,
      appAuthRedirect = _React$useContext$app.appAuthRedirect,
      appAuthUrl = _React$useContext$app.appAuthUrl,
      appClientId = _React$useContext$app.appClientId,
      appIdentityPoolId = _React$useContext$app.appIdentityPoolId,
      appRegion = _React$useContext$app.appRegion,
      appUserPoolId = _React$useContext$app.appUserPoolId,
      appRefreshTokenStorageKey = _React$useContext$app.appRefreshTokenStorageKey,
      appMessages = _React$useContext$app.appMessages;

  var _React$useState = _react["default"].useState({
    identityId: undefined,
    id: undefined,
    name: undefined,
    email: undefined,
    groups: undefined,
    idToken: undefined,
    accessToken: undefined
  }),
      user = _React$useState[0],
      setUser = _React$useState[1];

  var _React$useState2 = _react["default"].useState(sessionStorage.getItem(appRefreshTokenStorageKey)),
      refreshToken = _React$useState2[0],
      setRefreshToken = _React$useState2[1];

  var _React$useState3 = _react["default"].useState(undefined),
      awsConfig = _React$useState3[0],
      setAwsConfig = _React$useState3[1];

  var _React$useState4 = _react["default"].useState(25 * 60000),
      refreshTokenInterval = _React$useState4[0];

  var _React$useState5 = _react["default"].useState(undefined),
      awsCredentials = _React$useState5[0],
      setAwsCredentials = _React$useState5[1];

  _react["default"].useEffect(function () {
    if (refreshToken) {
      sessionStorage.setItem(appRefreshTokenStorageKey, refreshToken);
    } else {
      sessionStorage.removeItem(appRefreshTokenStorageKey);
    }
  }, [refreshToken, appRefreshTokenStorageKey]);

  var logoff = _react["default"].useCallback(function () {
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

  _react["default"].useEffect(function () {
    if (awsCredentials) {
      setAwsConfig(function (oldAwsConfig) {
        if (oldAwsConfig) {
          oldAwsConfig.update({
            credentials: awsCredentials
          });
          return oldAwsConfig;
        }

        return new _awsSdk["default"].Config({
          region: appRegion,
          credentials: awsCredentials
        });
      });
    } else {
      setAwsConfig(undefined);
    }
  }, [awsCredentials, appRegion]);

  var loginWithAwsCognitoIdentityPool = _react["default"].useCallback(function (idToken, accessToken) {
    var _Logins;

    var newCredentials = new _awsSdk["default"].CognitoIdentityCredentials(_extends({
      IdentityPoolId: appIdentityPoolId
    }, idToken && {
      Logins: (_Logins = {}, _Logins[appUserPoolId] = idToken, _Logins)
    }), {
      region: appRegion
    });
    return new Promise(function (resolve, reject) {
      newCredentials.clearCachedId();
      newCredentials.getPromise().then(function () {
        setAwsCredentials(newCredentials);
        setUser(function (oldUser) {
          var idTokenPayload = idToken && JSON.parse(atob(idToken.split('.')[1]));
          oldUser.identityId = newCredentials.identityId;
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

  var refreshIdAndAccessTokens = _react["default"].useCallback(function (refreshTokenParam) {
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

  var scheduledRefreshIdAndAccessTokens = _react["default"].useCallback(function () {
    refreshIdAndAccessTokens(refreshToken)["catch"](function (err) {
      console.error(appMessages.LOG_COULD_NOT_REFRESH_TOKENS, err);
    });
  }, [refreshToken, refreshIdAndAccessTokens, appMessages]);

  useSetInterval(scheduledRefreshIdAndAccessTokens, refreshTokenInterval);

  var loginAnonymously = _react["default"].useCallback(function () {
    return loginWithAwsCognitoIdentityPool();
  }, [loginWithAwsCognitoIdentityPool]);

  var loginWithAuthorizationCode = _react["default"].useCallback(function (authorizationCode) {
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

  _react["default"].useEffect(function () {
    if (refreshToken && !awsCredentials) {
      refreshIdAndAccessTokens(refreshToken)["catch"](function (err) {
        console.error(appMessages.LOG_COULD_NOT_REFRESH_TOKENS, err);
      });
    }
  }, [refreshToken, awsCredentials, refreshIdAndAccessTokens, appMessages]);

  return e(UserContext.Provider, {
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
var _default = UserContext;
exports["default"] = _default;