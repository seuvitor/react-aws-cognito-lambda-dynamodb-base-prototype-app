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

// src/index.js
var src_exports = {};
__export(src_exports, {
  BaseAppScope: () => BaseAppScope_default,
  makeAppConfig: () => makeAppConfig,
  useAppBarState: () => useAppBarState_default,
  useAppConfig: () => AppConfigContext_default,
  useAppDrawerState: () => useAppDrawerState_default,
  useBaseAppScopeState: () => useBaseAppScopeState,
  useDDB: () => DDBContext_default,
  useLambda: () => LambdaContext_default,
  useMessage: () => MessageContext_default,
  useMessageAreaState: () => useMessageAreaState,
  useSpinner: () => SpinnerContext_default,
  useSpinnerAreaState: () => useSpinnerAreaState,
  useUser: () => UserContext_default
});
module.exports = __toCommonJS(src_exports);

// src/UserContext.js
var import_react2 = __toESM(require("react"));
var import_credential_provider_cognito_identity = require("@aws-sdk/credential-provider-cognito-identity");
var import_client_cognito_identity = require("@aws-sdk/client-cognito-identity");

// src/AppConfigContext.js
var import_react = __toESM(require("react"));
var AppConfigContext = (0, import_react.createContext)();
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
var AppConfigProvider = ({ appConfig, children }) => /* @__PURE__ */ import_react.default.createElement(AppConfigContext.Provider, {
  value: { appConfig }
}, children);
var useAppConfig = () => {
  const { appConfig } = (0, import_react.useContext)(AppConfigContext);
  return { appConfig };
};
var AppConfigContext_default = useAppConfig;

// src/UserContext.js
var UserContext = (0, import_react2.createContext)();
var useSetInterval = (callback, seconds) => {
  const intervalRef = (0, import_react2.useRef)();
  const cancel = (0, import_react2.useCallback)(() => {
    const interval = intervalRef.current;
    if (interval) {
      intervalRef.current = void 0;
      clearInterval(interval);
    }
  }, [intervalRef]);
  (0, import_react2.useEffect)(() => {
    intervalRef.current = setInterval(callback, seconds);
    return cancel;
  }, [callback, seconds, cancel]);
  return cancel;
};
var UserProvider = ({ children }) => {
  const {
    appConfig: {
      appAuthRedirect,
      appAuthUrl,
      appClientId,
      appIdentityPoolId,
      appRegion,
      appUserPoolId,
      appRefreshTokenStorageKey,
      appMessages
    }
  } = AppConfigContext_default();
  const [user, setUser] = (0, import_react2.useState)({
    identityId: void 0,
    id: void 0,
    name: void 0,
    email: void 0,
    groups: void 0,
    idToken: void 0,
    accessToken: void 0
  });
  const [refreshToken, setRefreshToken] = (0, import_react2.useState)(
    sessionStorage.getItem(appRefreshTokenStorageKey)
  );
  const [awsConfig, setAwsConfig] = (0, import_react2.useState)(void 0);
  const [refreshTokenInterval] = (0, import_react2.useState)(25 * 6e4);
  const [awsCredentials, setAwsCredentials] = (0, import_react2.useState)(void 0);
  (0, import_react2.useEffect)(() => {
    if (refreshToken) {
      sessionStorage.setItem(appRefreshTokenStorageKey, refreshToken);
    } else {
      sessionStorage.removeItem(appRefreshTokenStorageKey);
    }
  }, [refreshToken, appRefreshTokenStorageKey]);
  const logoff = (0, import_react2.useCallback)(() => new Promise((resolve) => {
    setUser({
      identityId: void 0,
      id: void 0,
      name: void 0,
      email: void 0,
      groups: void 0,
      idToken: void 0,
      accessToken: void 0
    });
    setRefreshToken(void 0);
    setAwsConfig(void 0);
    resolve();
  }), []);
  (0, import_react2.useEffect)(() => {
    if (awsCredentials) {
      setAwsConfig((oldAwsConfig) => {
        if (oldAwsConfig) {
          oldAwsConfig.update({ credentials: awsCredentials });
          return oldAwsConfig;
        }
        return {
          region: appRegion,
          credentials: awsCredentials
        };
      });
    } else {
      setAwsConfig(void 0);
    }
  }, [awsCredentials, appRegion]);
  const loginWithAwsCognitoIdentityPool = (0, import_react2.useCallback)((idToken, accessToken) => {
    const newCredentials = (0, import_credential_provider_cognito_identity.fromCognitoIdentityPool)({
      client: new import_client_cognito_identity.CognitoIdentityClient({
        region: appRegion
      }),
      identityPoolId: appIdentityPoolId,
      ...idToken && { logins: { [appUserPoolId]: idToken } }
    });
    return new Promise((resolve, reject) => {
      newCredentials().then((creds) => {
        setAwsCredentials(newCredentials);
        setUser((oldUser) => {
          const idTokenPayload = idToken && JSON.parse(atob(idToken.split(".")[1]));
          oldUser.identityId = creds.identityId;
          oldUser.id = idTokenPayload && idTokenPayload.sub;
          oldUser.name = idTokenPayload ? idTokenPayload.name : appMessages.LOGGED_OUT_USER;
          oldUser.email = idTokenPayload && idTokenPayload.email;
          oldUser.groups = idTokenPayload && idTokenPayload["cognito:groups"];
          oldUser.idToken = idToken;
          oldUser.accessToken = accessToken;
          return oldUser;
        });
        resolve();
      }).catch((err) => {
        setAwsCredentials(void 0);
        setUser({
          identityId: void 0,
          id: void 0,
          name: void 0,
          email: void 0,
          groups: void 0,
          idToken: void 0,
          accessToken: void 0
        });
        reject(err);
      });
    });
  }, [appIdentityPoolId, appRegion, appUserPoolId, appMessages]);
  const refreshIdAndAccessTokens = (0, import_react2.useCallback)((refreshTokenParam) => new Promise((resolve, reject) => {
    if (refreshTokenParam) {
      fetch(appAuthUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=refresh_token&client_id=${appClientId}&refresh_token=${refreshTokenParam}`
      }).then((response) => {
        response.json().then((res) => {
          loginWithAwsCognitoIdentityPool(res.id_token, res.access_token).then(() => {
            resolve();
          }).catch((err) => {
            console.error(appMessages.LOG_COULD_NOT_LOGIN_WITH_REFRESHED_TOKENS, err);
            reject(err);
          });
        }).catch((err) => {
          console.error(appMessages.LOG_COULD_NOT_DECODE_AUTHENTICATION_RESPONSE, err);
          reject(err);
        });
      }).catch((err) => {
        console.error(appMessages.LOG_COULD_NOT_GET_REFRESHED_TOKENS, err);
        reject(err);
      });
    } else {
      console.warn(appMessages.LOG_NO_REFRESH_TOKEN_AVAILABLE);
      reject(new Error(appMessages.LOG_NO_REFRESH_TOKEN_AVAILABLE));
    }
  }), [loginWithAwsCognitoIdentityPool, appAuthUrl, appClientId, appMessages]);
  const scheduledRefreshIdAndAccessTokens = (0, import_react2.useCallback)(() => {
    refreshIdAndAccessTokens(refreshToken).catch((err) => {
      console.error(appMessages.LOG_COULD_NOT_REFRESH_TOKENS, err);
    });
  }, [refreshToken, refreshIdAndAccessTokens, appMessages]);
  useSetInterval(scheduledRefreshIdAndAccessTokens, refreshTokenInterval);
  const loginAnonymously = (0, import_react2.useCallback)(() => loginWithAwsCognitoIdentityPool(), [loginWithAwsCognitoIdentityPool]);
  const loginWithAuthorizationCode = (0, import_react2.useCallback)((authorizationCode) => new Promise((resolve, reject) => {
    fetch(appAuthUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=authorization_code&client_id=${appClientId}&code=${authorizationCode}&redirect_uri=${appAuthRedirect}`
    }).then((response) => {
      response.json().then((res) => {
        refreshIdAndAccessTokens(res.refresh_token).then(() => {
          setRefreshToken(res.refresh_token);
          resolve();
        }).catch((err) => {
          console.error(appMessages.LOG_COULD_NOT_LOGIN_WITH_REFRESHED_TOKENS, err);
          setRefreshToken(void 0);
          reject(err);
        });
      }).catch((err) => {
        console.error(appMessages.LOG_COULD_NOT_DECODE_AUTHENTICATION_RESPONSE, err);
        setRefreshToken(void 0);
        reject(err);
      });
    }).catch((err) => {
      console.error(appMessages.LOG_COULD_NOT_GET_IDENTIFICATION_TOKENS, err);
      setRefreshToken(void 0);
      reject(err);
    });
  }), [refreshIdAndAccessTokens, appAuthRedirect, appAuthUrl, appClientId, appMessages]);
  (0, import_react2.useEffect)(() => {
    if (refreshToken && !awsCredentials) {
      refreshIdAndAccessTokens(refreshToken).catch((err) => {
        console.error(appMessages.LOG_COULD_NOT_REFRESH_TOKENS, err);
      });
    }
  }, [refreshToken, awsCredentials, refreshIdAndAccessTokens, appMessages]);
  return /* @__PURE__ */ import_react2.default.createElement(UserContext.Provider, {
    value: {
      user,
      awsConfig,
      awsCredentials,
      loginAnonymously,
      loginWithAuthorizationCode,
      logoff
    }
  }, children);
};
var useUser = () => {
  const {
    user,
    awsConfig,
    awsCredentials,
    loginAnonymously,
    loginWithAuthorizationCode,
    logoff
  } = (0, import_react2.useContext)(UserContext);
  return {
    user,
    awsConfig,
    awsCredentials,
    loginAnonymously,
    loginWithAuthorizationCode,
    logoff
  };
};
var UserContext_default = useUser;

// src/DDBContext.js
var import_react3 = __toESM(require("react"));
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var import_lib_dynamodb = require("@aws-sdk/lib-dynamodb");
var DDBContext = (0, import_react3.createContext)();
var DDBProvider = ({ children }) => {
  const { awsConfig, awsCredentials } = UserContext_default();
  const [documentDB, setDocumentDB] = (0, import_react3.useState)();
  (0, import_react3.useEffect)(() => {
    if (awsConfig) {
      const ddbClient = new import_client_dynamodb.DynamoDBClient(awsConfig);
      setDocumentDB(new import_lib_dynamodb.DynamoDBDocumentClient(ddbClient));
    } else {
      setDocumentDB(void 0);
    }
  }, [awsConfig]);
  (0, import_react3.useEffect)(() => {
    if (awsCredentials) {
      setDocumentDB((oldDocumentDB) => {
        if (oldDocumentDB) {
          oldDocumentDB.service.config.update({ credentials: awsCredentials });
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
    (params) => documentDB.send(new import_lib_dynamodb.GetCommand(params)),
    [documentDB]
  );
  const ddbPut = (0, import_react3.useCallback)(
    (params) => documentDB.send(new import_lib_dynamodb.PutCommand(params)),
    [documentDB]
  );
  const ddbUpdate = (0, import_react3.useCallback)(
    (params) => documentDB.send(new import_lib_dynamodb.UpdateCommand(params)),
    [documentDB]
  );
  return {
    documentDB,
    ddbGet: documentDB && ddbGet,
    ddbPut: documentDB && ddbPut,
    ddbUpdate: documentDB && ddbUpdate
  };
};
var DDBContext_default = useDDB;

// src/LambdaContext.js
var import_react4 = __toESM(require("react"));
var import_client_lambda = require("@aws-sdk/client-lambda");
var LambdaContext = (0, import_react4.createContext)();
var LambdaProvider = ({ children }) => {
  const { user: { accessToken }, awsConfig, awsCredentials } = UserContext_default();
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
          oldLambda.config.update({ credentials: awsCredentials });
        }
        return oldLambda;
      });
    }
  }, [awsCredentials]);
  const invokeLambda = (0, import_react4.useCallback)((functionName, payload) => {
    const params = {
      FunctionName: functionName,
      ClientContext: btoa(JSON.stringify({ custom: { accessToken } }))
    };
    if (payload) {
      params.Payload = JSON.stringify(payload);
    }
    const command = new import_client_lambda.InvokeCommand(params);
    return new Promise((resolve, reject) => {
      lambda.send(command).then((data) => {
        if (!data.StatusCode || data.StatusCode !== 200 || !data.Payload) {
          reject(data);
        }
        const responsePayload = JSON.parse(Buffer.from(data.Payload));
        if (!responsePayload || !responsePayload.statusCode || responsePayload.statusCode !== 200) {
          reject(data);
        }
        resolve(responsePayload.body);
      }).catch((err) => {
        reject(err);
      });
    });
  }, [lambda, accessToken]);
  return /* @__PURE__ */ import_react4.default.createElement(LambdaContext.Provider, {
    value: { invokeLambda: lambda && invokeLambda }
  }, children);
};
var useLambda = () => {
  const { invokeLambda } = (0, import_react4.useContext)(LambdaContext);
  return { invokeLambda };
};
var LambdaContext_default = useLambda;

// src/BaseAppScope.js
var import_react9 = __toESM(require("react"));
var import_react_router_dom2 = require("react-router-dom");

// src/AuthRedirect.js
var import_react7 = require("react");
var import_react_router_dom = require("react-router-dom");

// src/MessageContext.js
var import_react5 = __toESM(require("react"));
var MessageContext = (0, import_react5.createContext)();
var MessageProvider = ({ children }) => {
  const [snackPack, setSnackPack] = (0, import_react5.useState)([]);
  const [message, setMessage] = (0, import_react5.useState)(void 0);
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

// src/SpinnerContext.js
var import_react6 = __toESM(require("react"));
var SpinnerContext = (0, import_react6.createContext)();
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

// src/AuthRedirect.js
var AuthRedirect = () => {
  const { appConfig: { appMessages } } = AppConfigContext_default();
  const { showMessage } = MessageContext_default();
  const { loginWithAuthorizationCode } = UserContext_default();
  const { authorization_code: authorizationCode } = (0, import_react_router_dom.useParams)();
  const { showSpinner, dismissSpinner } = SpinnerContext_default();
  const navigate = (0, import_react_router_dom.useNavigate)();
  (0, import_react7.useEffect)(
    () => {
      showSpinner();
      loginWithAuthorizationCode(authorizationCode).then(() => {
        showMessage(appMessages.LOGIN_SUCCESSFUL);
        navigate("/", { replace: true });
      }).catch(() => {
        showMessage(appMessages.LOGIN_FAILED);
      }).finally(() => {
        dismissSpinner();
      });
    },
    [
      authorizationCode,
      loginWithAuthorizationCode,
      showMessage,
      navigate,
      appMessages,
      showSpinner,
      dismissSpinner
    ]
  );
  return null;
};
var AuthRedirect_default = AuthRedirect;

// src/InfrastructureProvider.js
var import_react8 = __toESM(require("react"));
var InfrastructureProvider = ({ appConfig, children }) => /* @__PURE__ */ import_react8.default.createElement(MessageProvider, null, /* @__PURE__ */ import_react8.default.createElement(SpinnerProvider, null, /* @__PURE__ */ import_react8.default.createElement(AppConfigProvider, {
  appConfig
}, /* @__PURE__ */ import_react8.default.createElement(UserProvider, null, /* @__PURE__ */ import_react8.default.createElement(DDBProvider, null, /* @__PURE__ */ import_react8.default.createElement(LambdaProvider, null, children))))));
var InfrastructureProvider_default = InfrastructureProvider;

// src/BaseAppScope.js
var useBaseAppScopeState = (appRoutes) => {
  const [routes] = (0, import_react9.useState)([
    ...appRoutes,
    {
      name: "authentication",
      label: "Athentication",
      path: "/authentication/:authorization_code",
      hideFromMenu: true,
      component: AuthRedirect_default
    }
  ]);
  return { routes };
};
var RedirectAuthCode = ({ appConfig }) => {
  const navigate = (0, import_react_router_dom2.useNavigate)();
  (0, import_react9.useEffect)(() => {
    if (window.location.pathname === appConfig.appBasePath) {
      const search = new URLSearchParams(window.location.search);
      if (search.get("auth-redirect") !== null && search.get("code") !== null) {
        window.history.replaceState({}, "", window.location.pathname);
        navigate(`/authentication/${search.get("code")}`, { replace: true });
      }
    }
  }, []);
  return null;
};
var BaseAppScope = ({ appConfig, routes, children }) => /* @__PURE__ */ import_react9.default.createElement(InfrastructureProvider_default, {
  appConfig
}, /* @__PURE__ */ import_react9.default.createElement(import_react_router_dom2.HashRouter, null, children, /* @__PURE__ */ import_react9.default.createElement(RedirectAuthCode, {
  appConfig
}), /* @__PURE__ */ import_react9.default.createElement(import_react_router_dom2.Routes, null, routes.map((route) => /* @__PURE__ */ import_react9.default.createElement(import_react_router_dom2.Route, {
  key: `${route.name}-route`,
  exact: true,
  path: route.path,
  element: /* @__PURE__ */ import_react9.default.createElement(route.component, null),
  ...route.options
})))));
var BaseAppScope_default = BaseAppScope;

// src/useAppBarState.js
var import_react_router_dom3 = require("react-router-dom");
var useAppBarState = (routes) => {
  const { appConfig: { appExternalLoginUrl, appMessages, hideLogin } } = AppConfigContext_default();
  const { showMessage } = MessageContext_default();
  const { user: { name: userName }, logoff } = UserContext_default();
  const location = (0, import_react_router_dom3.useLocation)();
  const logoffAndShowMessage = () => {
    logoff().then(() => {
      showMessage(appMessages.LOGOUT_SUCCESSFUL);
    }).catch(() => {
      showMessage(appMessages.LOGOUT_FAILED);
    });
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

// src/useAppDrawerState.js
var useAppDrawerState = (routes) => {
  const { appConfig: { appLogoUrl } } = AppConfigContext_default();
  const { user: { groups: userGroups } } = UserContext_default();
  const userFromAuthorizedGroup = (authorizedGroups) => {
    if (!authorizedGroups) {
      return true;
    }
    if (!userGroups) {
      return false;
    }
    return authorizedGroups.some((authorizedGroup) => userGroups.includes(authorizedGroup));
  };
  const menuRoutes = routes.filter((route) => !route.hideFromMenu).filter((route) => userFromAuthorizedGroup(route.authorizedGroups));
  return { appLogoUrl, menuRoutes };
};
var useAppDrawerState_default = useAppDrawerState;
//# sourceMappingURL=index.js.map
