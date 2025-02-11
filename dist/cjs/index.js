var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  BaseAppScope: () => BaseAppScope_default,
  makeAppConfig: () => makeAppConfig_default,
  useAppBarState: () => useAppBarState_default,
  useAppConfig: () => AppConfigContext_default,
  useAppDrawerState: () => useAppDrawerState_default,
  useDDB: () => DDBContext_default,
  useLambda: () => LambdaContext_default,
  useMessage: () => MessageContext_default,
  useMessageAreaState: () => useMessageAreaState,
  useSpinner: () => SpinnerContext_default,
  useSpinnerAreaState: () => useSpinnerAreaState,
  useUser: () => UserContext_default
});
module.exports = __toCommonJS(src_exports);

// src/AppConfigContext.tsx
var import_react = __toESM(require("react"));
var AppConfigContext = (0, import_react.createContext)(void 0);
var AppConfigProvider = ({ appConfig, children }) => /* @__PURE__ */ import_react.default.createElement(AppConfigContext.Provider, {
  value: { appConfig }
}, children);
var useAppConfig = () => {
  const ctx = (0, import_react.useContext)(AppConfigContext);
  if (ctx === void 0) {
    throw new Error(
      "useAppConfig can only be used in the scope of a AppConfigProvider"
    );
  }
  const { appConfig } = ctx;
  return { appConfig };
};
var AppConfigContext_default = useAppConfig;

// src/BaseAppScope.tsx
var import_react9 = __toESM(require("react"));
var import_react_router_dom = require("react-router-dom");

// src/InfrastructureProvider.tsx
var import_react7 = __toESM(require("react"));

// src/DDBContext.tsx
var import_react3 = __toESM(require("react"));
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var import_lib_dynamodb = require("@aws-sdk/lib-dynamodb");

// src/UserContext.tsx
var import_react2 = __toESM(require("react"));

// src/core/authentication.ts
var import_client_cognito_identity = require("@aws-sdk/client-cognito-identity");
var import_credential_provider_cognito_identity = require("@aws-sdk/credential-provider-cognito-identity");
var initialUserState = {
  appConfig: void 0,
  user: {
    identityId: void 0,
    id: void 0,
    name: void 0,
    email: void 0,
    groups: void 0,
    idToken: void 0,
    accessToken: void 0
  },
  refreshToken: void 0,
  awsConfig: void 0,
  awsCredentials: void 0
};
var getRefreshTokenFromSessionStorage = (appRefreshTokenStorageKey) => sessionStorage.getItem(appRefreshTokenStorageKey);
var updateRefreshTokenInSessionStorage = (refreshToken, appRefreshTokenStorageKey) => {
  if (refreshToken) {
    sessionStorage.setItem(appRefreshTokenStorageKey, refreshToken);
  } else {
    sessionStorage.removeItem(appRefreshTokenStorageKey);
  }
};
var stateUpdateFromClearAwsCredentials = {
  awsCredentials: void 0,
  user: {
    identityId: void 0,
    id: void 0,
    name: void 0,
    email: void 0,
    groups: void 0,
    idToken: void 0,
    accessToken: void 0
  },
  awsConfig: void 0
};
var stateUpdateFromFailedLogin = {
  ...stateUpdateFromClearAwsCredentials,
  refreshToken: void 0
};
var stateUpdateFromNewAwsCredentials = (awsCredentials, identityId, idToken, accessToken, appMessages, appRegion) => {
  const idTokenPayload = idToken && JSON.parse(atob(idToken.split(".")[1]));
  const user = {
    identityId,
    id: idTokenPayload?.sub,
    name: idTokenPayload ? idTokenPayload.name : appMessages.LOGGED_OUT_USER,
    email: idTokenPayload?.email,
    groups: idTokenPayload?.["cognito:groups"],
    idToken,
    accessToken
  };
  const awsConfig = awsCredentials ? { region: appRegion, credentials: awsCredentials } : void 0;
  return {
    awsCredentials,
    user,
    awsConfig
  };
};
var loginWithAwsCognitoIdentityPoolSemDispatch = (appConfig, idToken, accessToken) => {
  const { appIdentityPoolId, appRegion, appUserPoolId, appMessages } = appConfig;
  const newCredentials = (0, import_credential_provider_cognito_identity.fromCognitoIdentityPool)({
    client: new import_client_cognito_identity.CognitoIdentityClient({
      region: appRegion
    }),
    identityPoolId: appIdentityPoolId,
    ...idToken && { logins: { [appUserPoolId]: idToken } }
  });
  return new Promise((resolve, reject) => {
    newCredentials().then((creds) => {
      resolve(
        stateUpdateFromNewAwsCredentials(
          newCredentials,
          creds.identityId,
          idToken,
          accessToken,
          appMessages,
          appRegion
        )
      );
    }).catch((err) => {
      reject(err);
    });
  });
};
var refreshIdAndAccessTokensSemDispatch = (appConfig, refreshToken) => {
  const { appAuthUrl, appClientId, appMessages } = appConfig;
  return new Promise((resolve, reject) => {
    if (refreshToken) {
      fetch(appAuthUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=refresh_token&client_id=${appClientId}&refresh_token=${refreshToken}`
      }).then((response) => {
        response.json().then((res) => {
          loginWithAwsCognitoIdentityPoolSemDispatch(
            appConfig,
            res.id_token,
            res.access_token
          ).then((stateUpdate) => {
            resolve(stateUpdate);
          }).catch((err) => {
            console.error(
              appMessages.LOG_COULD_NOT_LOGIN_WITH_REFRESHED_TOKENS,
              err
            );
            reject(err);
          });
        }).catch((err) => {
          console.error(
            appMessages.LOG_COULD_NOT_DECODE_AUTHENTICATION_RESPONSE,
            err
          );
          reject(err);
        });
      }).catch((err) => {
        console.error(appMessages.LOG_COULD_NOT_GET_REFRESHED_TOKENS, err);
        reject(err);
      });
    } else {
      console.warn(appMessages.LOG_NO_REFRESH_TOKEN_AVAILABLE);
      reject(Error(appMessages.LOG_NO_REFRESH_TOKEN_AVAILABLE));
    }
  });
};
var loginWithAuthorizationCodeSemDispatch = (appConfig, authorizationCode) => {
  const { appAuthUrl, appClientId, appAuthRedirect, appMessages } = appConfig;
  return new Promise((resolve, reject) => {
    fetch(appAuthUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=authorization_code&client_id=${appClientId}&code=${authorizationCode}&redirect_uri=${appAuthRedirect}`
    }).then((response) => {
      response.json().then((res) => {
        refreshIdAndAccessTokensSemDispatch(appConfig, res.refresh_token).then((stateUpdate) => {
          resolve({
            ...stateUpdate,
            refreshToken: res.refresh_token
          });
        }).catch((err) => {
          console.error(
            appMessages.LOG_COULD_NOT_LOGIN_WITH_REFRESHED_TOKENS,
            err
          );
          reject(err);
        });
      }).catch((err) => {
        console.error(
          appMessages.LOG_COULD_NOT_DECODE_AUTHENTICATION_RESPONSE,
          err
        );
        reject(err);
      });
    }).catch((err) => {
      console.error(appMessages.LOG_COULD_NOT_GET_IDENTIFICATION_TOKENS, err);
      reject(err);
    });
  });
};
var logoff = (setUserState, appConfig) => new Promise((resolve, _reject) => {
  updateRefreshTokenInSessionStorage(
    void 0,
    appConfig.appRefreshTokenStorageKey
  );
  setUserState((_prevState) => stateUpdateFromFailedLogin);
  resolve();
});
var setAppConfig = (setUserState, appConfig) => {
  const refreshToken = getRefreshTokenFromSessionStorage(
    appConfig.appRefreshTokenStorageKey
  );
  if (refreshToken) {
    refreshIdAndAccessTokens(setUserState, appConfig, refreshToken);
  }
};
var loginWithAwsCognitoIdentityPool = (setUserState, appConfig, idToken, accessToken) => {
  loginWithAwsCognitoIdentityPoolSemDispatch(appConfig, idToken, accessToken).then((stateUpdate) => {
    setUserState((oldState) => ({ ...oldState, stateUpdate }));
  }).catch(() => {
    setUserState((_prevState) => stateUpdateFromFailedLogin);
  });
};
var refreshIdAndAccessTokens = (setUserState, appConfig, refreshToken) => new Promise((resolve, reject) => {
  refreshIdAndAccessTokensSemDispatch(appConfig, refreshToken).then((stateUpdate) => {
    setUserState((prevState) => ({ ...prevState, ...stateUpdate }));
    resolve();
  }).catch((err) => {
    setUserState((_prevState) => stateUpdateFromFailedLogin);
    reject(err);
  });
});
var loginWithAuthorizationCode = (setUserState, appConfig, authorizationCode) => new Promise((resolve, reject) => {
  loginWithAuthorizationCodeSemDispatch(appConfig, authorizationCode).then((stateUpdate) => {
    const { refreshToken } = stateUpdate;
    updateRefreshTokenInSessionStorage(
      refreshToken,
      appConfig.appRefreshTokenStorageKey
    );
    setUserState((_prevState) => stateUpdate);
    resolve();
  }).catch((err) => {
    const refreshToken = void 0;
    updateRefreshTokenInSessionStorage(
      refreshToken,
      appConfig.appRefreshTokenStorageKey
    );
    setUserState((_prevState) => stateUpdateFromFailedLogin);
    reject(err);
  });
});

// src/UserContext.tsx
var initialUserContextValue = {
  user: initialUserState.user,
  awsConfig: initialUserState.awsConfig,
  awsCredentials: initialUserState.awsCredentials,
  loginAnonymously: () => {
  },
  loginWithAuthorizationCode: () => Promise.reject(),
  logoff: () => Promise.reject()
};
var UserContext = (0, import_react2.createContext)(initialUserContextValue);
var useSetInterval = (callback, seconds) => {
  const intervalRef = (0, import_react2.useRef)();
  const cancel = (0, import_react2.useCallback)(() => {
    const interval = intervalRef.current;
    if (interval) {
      intervalRef.current = void 0;
      clearInterval(interval);
    }
  }, []);
  (0, import_react2.useEffect)(() => {
    intervalRef.current = setInterval(callback, seconds);
    return cancel;
  }, [callback, seconds, cancel]);
  return cancel;
};
var REFRESH_TOKEN_INTERVAL = 25 * 6e4;
var UserProvider = ({ children }) => {
  const { appConfig } = AppConfigContext_default();
  const { appMessages } = appConfig;
  const [userState, setUserState] = (0, import_react2.useState)(initialUserState);
  (0, import_react2.useEffect)(() => {
    setAppConfig(setUserState, appConfig);
  }, [appConfig]);
  const logoff2 = (0, import_react2.useCallback)(
    () => logoff(setUserState, appConfig),
    [appConfig]
  );
  const loginWithAwsCognitoIdentityPool2 = (0, import_react2.useCallback)(
    (idToken, accessToken) => loginWithAwsCognitoIdentityPool(
      setUserState,
      appConfig,
      idToken,
      accessToken
    ),
    [appConfig]
  );
  const refreshIdAndAccessTokens2 = (0, import_react2.useCallback)(
    () => refreshIdAndAccessTokens(
      setUserState,
      appConfig,
      userState.refreshToken
    ),
    [appConfig, userState.refreshToken]
  );
  const scheduledRefreshIdAndAccessTokens = (0, import_react2.useCallback)(() => {
    refreshIdAndAccessTokens2().catch(() => {
      console.warn(appMessages.LOG_COULD_NOT_REFRESH_TOKENS);
    });
  }, [refreshIdAndAccessTokens2, appMessages]);
  useSetInterval(scheduledRefreshIdAndAccessTokens, REFRESH_TOKEN_INTERVAL);
  const loginAnonymously = (0, import_react2.useCallback)(
    () => loginWithAwsCognitoIdentityPool2(void 0, void 0),
    [loginWithAwsCognitoIdentityPool2]
  );
  const loginWithAuthorizationCode2 = (0, import_react2.useCallback)(
    (authorizationCode) => loginWithAuthorizationCode(setUserState, appConfig, authorizationCode),
    [appConfig]
  );
  (0, import_react2.useEffect)(() => {
    if (!userState.awsCredentials) {
      refreshIdAndAccessTokens2().catch(() => {
        console.warn(appMessages.LOG_COULD_NOT_REFRESH_TOKENS);
      });
    }
  }, [userState.awsCredentials, refreshIdAndAccessTokens2, appMessages]);
  return /* @__PURE__ */ import_react2.default.createElement(UserContext.Provider, {
    value: {
      user: userState.user,
      awsConfig: userState.awsConfig,
      awsCredentials: userState.awsCredentials,
      loginAnonymously,
      loginWithAuthorizationCode: loginWithAuthorizationCode2,
      logoff: logoff2
    }
  }, children);
};
var useUser = () => {
  const {
    user,
    awsConfig,
    awsCredentials,
    loginAnonymously,
    loginWithAuthorizationCode: loginWithAuthorizationCode2,
    logoff: logoff2
  } = (0, import_react2.useContext)(UserContext);
  return {
    user,
    awsConfig,
    awsCredentials,
    loginAnonymously,
    loginWithAuthorizationCode: loginWithAuthorizationCode2,
    logoff: logoff2
  };
};
var UserContext_default = useUser;

// src/DDBContext.tsx
var DDBContext = (0, import_react3.createContext)({
  documentDB: void 0
});
var DDBProvider = ({ children }) => {
  const { awsConfig, awsCredentials } = UserContext_default();
  const [documentDB, setDocumentDB] = (0, import_react3.useState)();
  (0, import_react3.useEffect)(() => {
    if (awsConfig) {
      const ddbClient = new import_client_dynamodb.DynamoDBClient(awsConfig);
      setDocumentDB(import_lib_dynamodb.DynamoDBDocumentClient.from(ddbClient));
    } else {
      setDocumentDB(void 0);
    }
  }, [awsConfig]);
  (0, import_react3.useEffect)(() => {
    if (awsCredentials) {
      setDocumentDB((oldDocumentDB) => {
        if (oldDocumentDB) {
          oldDocumentDB.config.credentials = awsCredentials;
        }
        return oldDocumentDB;
      });
    }
  }, [awsCredentials]);
  return /* @__PURE__ */ import_react3.default.createElement(DDBContext.Provider, {
    value: { documentDB }
  }, children);
};
var useDDB = () => {
  const { documentDB } = (0, import_react3.useContext)(DDBContext);
  const ddbGet = (0, import_react3.useCallback)(
    (params) => documentDB ? documentDB.send(new import_lib_dynamodb.GetCommand(params)) : Promise.reject(),
    [documentDB]
  );
  const ddbPut = (0, import_react3.useCallback)(
    (params) => documentDB ? documentDB.send(new import_lib_dynamodb.PutCommand(params)) : Promise.reject(),
    [documentDB]
  );
  const ddbUpdate = (0, import_react3.useCallback)(
    (params) => documentDB ? documentDB.send(new import_lib_dynamodb.UpdateCommand(params)) : Promise.reject(),
    [documentDB]
  );
  return {
    documentDB,
    ddbGet,
    ddbPut,
    ddbUpdate
  };
};
var DDBContext_default = useDDB;

// src/LambdaContext.tsx
var import_react4 = __toESM(require("react"));
var import_client_lambda = require("@aws-sdk/client-lambda");
var LambdaContext = (0, import_react4.createContext)({
  invokeLambda: (_functionName, _payload) => Promise.reject()
});
var LambdaProvider = ({ children }) => {
  const {
    user: { accessToken },
    awsConfig,
    awsCredentials
  } = UserContext_default();
  const [lambda, setLambda] = (0, import_react4.useState)();
  (0, import_react4.useEffect)(() => {
    if (awsConfig) {
      setLambda(new import_client_lambda.LambdaClient(awsConfig));
    } else {
      setLambda(void 0);
    }
  }, [awsConfig]);
  (0, import_react4.useEffect)(() => {
    if (awsCredentials) {
      setLambda((oldLambda) => {
        if (oldLambda) {
          oldLambda.config.credentials = awsCredentials;
        }
        return oldLambda;
      });
    }
  }, [awsCredentials]);
  const invokeLambda = (0, import_react4.useCallback)(
    (functionName, payload) => {
      if (lambda) {
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        const params = {
          FunctionName: functionName,
          ClientContext: btoa(JSON.stringify({ custom: { accessToken } })),
          Payload: payload ? encoder.encode(JSON.stringify(payload)) : void 0
        };
        const command = new import_client_lambda.InvokeCommand(params);
        return new Promise((resolve, reject) => {
          lambda.send(command).then((data) => {
            if (!data.StatusCode || data.StatusCode !== 200 || !data.Payload) {
              reject(data);
            }
            const responsePayload = JSON.parse(decoder.decode(data.Payload));
            if (!responsePayload || !responsePayload.statusCode || responsePayload.statusCode !== 200) {
              reject(data);
            }
            resolve(responsePayload.body);
          }).catch((err) => {
            reject(err);
          });
        });
      }
      return Promise.reject("Lambda client is undefined");
    },
    [lambda, accessToken]
  );
  return /* @__PURE__ */ import_react4.default.createElement(LambdaContext.Provider, {
    value: {
      invokeLambda: lambda ? invokeLambda : () => Promise.reject()
    }
  }, children);
};
var useLambda = () => {
  const { invokeLambda } = (0, import_react4.useContext)(LambdaContext);
  return { invokeLambda };
};
var LambdaContext_default = useLambda;

// src/MessageContext.tsx
var import_react5 = __toESM(require("react"));
var MessageContext = (0, import_react5.createContext)({
  message: "",
  showMessage: (_message) => {
  },
  dismissMessage: () => {
  }
});
var MessageProvider = ({ children }) => {
  const [snackPack, setSnackPack] = (0, import_react5.useState)([]);
  const [message, setMessage] = (0, import_react5.useState)();
  (0, import_react5.useEffect)(() => {
    if (snackPack.length && !message) {
      setMessage(snackPack[0]);
      setSnackPack((prev) => prev.slice(1));
    }
  }, [snackPack, message]);
  const showMessage = (0, import_react5.useCallback)((newMessage) => {
    setSnackPack((prev) => [...prev, newMessage]);
  }, []);
  const dismissMessage = (0, import_react5.useCallback)(() => {
    setMessage(void 0);
  }, []);
  return /* @__PURE__ */ import_react5.default.createElement(MessageContext.Provider, {
    value: { message, showMessage, dismissMessage }
  }, children);
};
var useMessage = () => {
  const { showMessage } = (0, import_react5.useContext)(MessageContext);
  return { showMessage };
};
var useMessageAreaState = () => {
  const { message, dismissMessage } = (0, import_react5.useContext)(MessageContext);
  return { message, dismissMessage };
};
var MessageContext_default = useMessage;

// src/SpinnerContext.tsx
var import_react6 = __toESM(require("react"));
var SpinnerContext = (0, import_react6.createContext)({
  showSpinner: () => {
  },
  dismissSpinner: () => {
  },
  showing: false
});
var SpinnerProvider = ({ children }) => {
  const [spinnerCount, setSpinnerCount] = (0, import_react6.useState)(0);
  const showSpinner = (0, import_react6.useCallback)(() => {
    setSpinnerCount((prev) => prev + 1);
  }, []);
  const dismissSpinner = (0, import_react6.useCallback)(() => {
    setSpinnerCount((prev) => prev - 1);
  }, []);
  const showing = spinnerCount > 0;
  return /* @__PURE__ */ import_react6.default.createElement(SpinnerContext.Provider, {
    value: { showSpinner, dismissSpinner, showing }
  }, children);
};
var useSpinner = () => {
  const { showSpinner, dismissSpinner } = (0, import_react6.useContext)(SpinnerContext);
  return { showSpinner, dismissSpinner };
};
var useSpinnerAreaState = () => {
  const { showing } = (0, import_react6.useContext)(SpinnerContext);
  return { showing };
};
var SpinnerContext_default = useSpinner;

// src/InfrastructureProvider.tsx
var InfrastructureProvider = ({
  appConfig,
  children
}) => /* @__PURE__ */ import_react7.default.createElement(MessageProvider, null, /* @__PURE__ */ import_react7.default.createElement(SpinnerProvider, null, /* @__PURE__ */ import_react7.default.createElement(AppConfigProvider, {
  appConfig
}, /* @__PURE__ */ import_react7.default.createElement(UserProvider, null, /* @__PURE__ */ import_react7.default.createElement(DDBProvider, null, /* @__PURE__ */ import_react7.default.createElement(LambdaProvider, null, children))))));
var InfrastructureProvider_default = InfrastructureProvider;

// src/useAuthRedirect.ts
var import_react8 = require("react");

// src/core/authRedirect.ts
var authRedirect = (appBasePath, showSpinner, dismissSpinner, loginWithAuthorizationCode2, showMessage, appMessages) => {
  if (window.location.pathname === appBasePath) {
    const search = new URLSearchParams(window.location.search);
    if (search.get("auth-redirect") !== null && search.get("code") !== null) {
      window.history.replaceState({}, "", window.location.pathname);
      const authorizationCode = search.get("code");
      if (authorizationCode) {
        showSpinner();
        loginWithAuthorizationCode2(authorizationCode).then(() => {
          if (appMessages) {
            showMessage(appMessages.LOGIN_SUCCESSFUL);
          }
        }).catch(() => {
          if (appMessages) {
            showMessage(appMessages.LOGIN_FAILED);
          }
        }).finally(() => {
          dismissSpinner();
        });
      }
    }
  }
};
var authRedirect_default = authRedirect;

// src/useAuthRedirect.ts
var useAuthRedirect = () => {
  const {
    appConfig: { appBasePath, appMessages }
  } = AppConfigContext_default();
  const { showMessage } = MessageContext_default();
  const { showSpinner, dismissSpinner } = SpinnerContext_default();
  const { loginWithAuthorizationCode: loginWithAuthorizationCode2 } = UserContext_default();
  (0, import_react8.useEffect)(() => {
    authRedirect_default(
      appBasePath,
      showSpinner,
      dismissSpinner,
      loginWithAuthorizationCode2,
      showMessage,
      appMessages
    );
  }, [
    appBasePath,
    showSpinner,
    dismissSpinner,
    loginWithAuthorizationCode2,
    showMessage,
    appMessages
  ]);
};
var useAuthRedirect_default = useAuthRedirect;

// src/BaseAppScope.tsx
var RedirectAuthCode = () => {
  useAuthRedirect_default();
  return null;
};
var BaseAppScope = ({ appConfig, routes, children }) => /* @__PURE__ */ import_react9.default.createElement(InfrastructureProvider_default, {
  appConfig
}, /* @__PURE__ */ import_react9.default.createElement(RedirectAuthCode, null), /* @__PURE__ */ import_react9.default.createElement(import_react_router_dom.HashRouter, null, children, /* @__PURE__ */ import_react9.default.createElement(import_react_router_dom.Routes, null, routes.map((route) => /* @__PURE__ */ import_react9.default.createElement(import_react_router_dom.Route, {
  key: `${route.name}-route`,
  exact: true,
  path: route.path,
  element: /* @__PURE__ */ import_react9.default.createElement(route.component, null),
  ...route.options
})))));
var BaseAppScope_default = BaseAppScope;

// src/core/makeAppConfig.ts
var makeAppConfig = ({
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
    appBasePath,
    appRegion,
    appUserPoolId,
    appClientId,
    appIdentityPoolId,
    appAuthRedirect,
    appAuthUrl,
    appExternalLoginUrl,
    appRefreshTokenStorageKey,
    appLogoUrl,
    appMessages,
    hideLogin: hideLogin || false
  };
};
var makeAppConfig_default = makeAppConfig;

// src/useAppBarState.ts
var import_react_router_dom2 = require("react-router-dom");
var useAppBarState = (routes) => {
  const {
    appConfig: { appMessages, hideLogin, appExternalLoginUrl }
  } = AppConfigContext_default();
  const { showMessage } = MessageContext_default();
  const {
    user: { name: userName },
    logoff: logoff2
  } = UserContext_default();
  const location = (0, import_react_router_dom2.useLocation)();
  const logoffAndShowMessage = () => {
    logoff2().then(() => showMessage(appMessages.LOGOUT_SUCCESSFUL)).catch(() => showMessage(appMessages.LOGOUT_FAILED));
  };
  const currentRoute = routes.find((route) => route.path === location.pathname);
  const currentRouteLabel = currentRoute ? currentRoute.label : "";
  const hideLoginButton = userName || hideLogin;
  const hideAccountButton = !userName || hideLogin;
  return {
    currentRouteLabel,
    hideLoginButton,
    appExternalLoginUrl,
    hideAccountButton,
    userName,
    logoffAndShowMessage
  };
};
var useAppBarState_default = useAppBarState;

// src/useAppDrawerState.ts
var useAppDrawerState = (routes) => {
  const {
    appConfig: { appLogoUrl }
  } = AppConfigContext_default();
  const {
    user: { groups: userGroups }
  } = UserContext_default();
  const userFromAuthorizedGroup = (authorizedGroups) => {
    if (!authorizedGroups) {
      return true;
    }
    if (!userGroups) {
      return false;
    }
    return authorizedGroups.some(
      (authorizedGroup) => userGroups.includes(authorizedGroup)
    );
  };
  const menuRoutes = routes.filter((route) => !route.hideFromMenu).filter((route) => userFromAuthorizedGroup(route.authorizedGroups));
  return { appLogoUrl, menuRoutes };
};
var useAppDrawerState_default = useAppDrawerState;
//# sourceMappingURL=index.js.map
