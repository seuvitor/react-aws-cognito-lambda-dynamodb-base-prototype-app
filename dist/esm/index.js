// src/AppConfigContext.tsx
import React, { createContext, useContext } from "react";
var AppConfigContext = createContext(void 0);
var AppConfigProvider = ({ appConfig, children }) => /* @__PURE__ */ React.createElement(AppConfigContext.Provider, {
  value: { appConfig }
}, children);
var useAppConfig = () => {
  const ctx = useContext(AppConfigContext);
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
import React8 from "react";
import { HashRouter, Route, Routes } from "react-router-dom";

// src/InfrastructureProvider.tsx
import React7 from "react";

// src/DDBContext.tsx
import React3, {
  createContext as createContext3,
  useCallback as useCallback2,
  useContext as useContext3,
  useEffect as useEffect2,
  useState as useState2
} from "react";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand
} from "@aws-sdk/lib-dynamodb";

// src/UserContext.tsx
import React2, {
  createContext as createContext2,
  useCallback,
  useContext as useContext2,
  useEffect,
  useState,
  useRef
} from "react";

// src/core/authentication.ts
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import {
  fromCognitoIdentityPool
} from "@aws-sdk/credential-provider-cognito-identity";
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
  const newCredentials = fromCognitoIdentityPool({
    client: new CognitoIdentityClient({
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
var UserContext = createContext2(initialUserContextValue);
var useSetInterval = (callback, seconds) => {
  const intervalRef = useRef();
  const cancel = useCallback(() => {
    const interval = intervalRef.current;
    if (interval) {
      intervalRef.current = void 0;
      clearInterval(interval);
    }
  }, []);
  useEffect(() => {
    intervalRef.current = setInterval(callback, seconds);
    return cancel;
  }, [callback, seconds, cancel]);
  return cancel;
};
var REFRESH_TOKEN_INTERVAL = 25 * 6e4;
var UserProvider = ({ children }) => {
  const { appConfig } = AppConfigContext_default();
  const { appMessages } = appConfig;
  const [userState, setUserState] = useState(initialUserState);
  useEffect(() => {
    setAppConfig(setUserState, appConfig);
  }, [appConfig]);
  const logoff2 = useCallback(
    () => logoff(setUserState, appConfig),
    [appConfig]
  );
  const loginWithAwsCognitoIdentityPool2 = useCallback(
    (idToken, accessToken) => loginWithAwsCognitoIdentityPool(
      setUserState,
      appConfig,
      idToken,
      accessToken
    ),
    [appConfig]
  );
  const refreshIdAndAccessTokens2 = useCallback(
    () => refreshIdAndAccessTokens(
      setUserState,
      appConfig,
      userState.refreshToken
    ),
    [appConfig, userState.refreshToken]
  );
  const scheduledRefreshIdAndAccessTokens = useCallback(() => {
    refreshIdAndAccessTokens2().catch(() => {
      console.warn(appMessages.LOG_COULD_NOT_REFRESH_TOKENS);
    });
  }, [refreshIdAndAccessTokens2, appMessages]);
  useSetInterval(scheduledRefreshIdAndAccessTokens, REFRESH_TOKEN_INTERVAL);
  const loginAnonymously = useCallback(
    () => loginWithAwsCognitoIdentityPool2(void 0, void 0),
    [loginWithAwsCognitoIdentityPool2]
  );
  const loginWithAuthorizationCode2 = useCallback(
    (authorizationCode) => loginWithAuthorizationCode(setUserState, appConfig, authorizationCode),
    [appConfig]
  );
  useEffect(() => {
    if (!userState.awsCredentials) {
      refreshIdAndAccessTokens2().catch(() => {
        console.warn(appMessages.LOG_COULD_NOT_REFRESH_TOKENS);
      });
    }
  }, [userState.awsCredentials, refreshIdAndAccessTokens2, appMessages]);
  return /* @__PURE__ */ React2.createElement(UserContext.Provider, {
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
  } = useContext2(UserContext);
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
var DDBContext = createContext3({
  documentDB: void 0
});
var DDBProvider = ({ children }) => {
  const { awsConfig, awsCredentials } = UserContext_default();
  const [documentDB, setDocumentDB] = useState2();
  useEffect2(() => {
    if (awsConfig) {
      const ddbClient = new DynamoDBClient(awsConfig);
      setDocumentDB(DynamoDBDocumentClient.from(ddbClient));
    } else {
      setDocumentDB(void 0);
    }
  }, [awsConfig]);
  useEffect2(() => {
    if (awsCredentials) {
      setDocumentDB((oldDocumentDB) => {
        if (oldDocumentDB) {
          oldDocumentDB.config.credentials = awsCredentials;
        }
        return oldDocumentDB;
      });
    }
  }, [awsCredentials]);
  return /* @__PURE__ */ React3.createElement(DDBContext.Provider, {
    value: { documentDB }
  }, children);
};
var useDDB = () => {
  const { documentDB } = useContext3(DDBContext);
  const ddbGet = useCallback2(
    (params) => documentDB ? documentDB.send(new GetCommand(params)) : Promise.reject(),
    [documentDB]
  );
  const ddbPut = useCallback2(
    (params) => documentDB ? documentDB.send(new PutCommand(params)) : Promise.reject(),
    [documentDB]
  );
  const ddbUpdate = useCallback2(
    (params) => documentDB ? documentDB.send(new UpdateCommand(params)) : Promise.reject(),
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
import React4, {
  createContext as createContext4,
  useCallback as useCallback3,
  useContext as useContext4,
  useEffect as useEffect3,
  useState as useState3
} from "react";
import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
var LambdaContext = createContext4({
  invokeLambda: (_functionName, _payload) => Promise.reject()
});
var LambdaProvider = ({ children }) => {
  const {
    user: { accessToken },
    awsConfig,
    awsCredentials
  } = UserContext_default();
  const [lambda, setLambda] = useState3();
  useEffect3(() => {
    if (awsConfig) {
      setLambda(new LambdaClient(awsConfig));
    } else {
      setLambda(void 0);
    }
  }, [awsConfig]);
  useEffect3(() => {
    if (awsCredentials) {
      setLambda((oldLambda) => {
        if (oldLambda) {
          oldLambda.config.credentials = awsCredentials;
        }
        return oldLambda;
      });
    }
  }, [awsCredentials]);
  const invokeLambda = useCallback3(
    (functionName, payload) => {
      if (lambda) {
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        const params = {
          FunctionName: functionName,
          ClientContext: btoa(JSON.stringify({ custom: { accessToken } })),
          Payload: payload ? encoder.encode(JSON.stringify(payload)) : void 0
        };
        const command = new InvokeCommand(params);
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
  return /* @__PURE__ */ React4.createElement(LambdaContext.Provider, {
    value: {
      invokeLambda: lambda ? invokeLambda : () => Promise.reject()
    }
  }, children);
};
var useLambda = () => {
  const { invokeLambda } = useContext4(LambdaContext);
  return { invokeLambda };
};
var LambdaContext_default = useLambda;

// src/MessageContext.tsx
import React5, {
  createContext as createContext5,
  useCallback as useCallback4,
  useContext as useContext5,
  useEffect as useEffect4,
  useState as useState4
} from "react";
var MessageContext = createContext5({
  message: "",
  showMessage: (_message) => {
  },
  dismissMessage: () => {
  }
});
var MessageProvider = ({ children }) => {
  const [snackPack, setSnackPack] = useState4([]);
  const [message, setMessage] = useState4();
  useEffect4(() => {
    if (snackPack.length && !message) {
      setMessage(snackPack[0]);
      setSnackPack((prev) => prev.slice(1));
    }
  }, [snackPack, message]);
  const showMessage = useCallback4((newMessage) => {
    setSnackPack((prev) => [...prev, newMessage]);
  }, []);
  const dismissMessage = useCallback4(() => {
    setMessage(void 0);
  }, []);
  return /* @__PURE__ */ React5.createElement(MessageContext.Provider, {
    value: { message, showMessage, dismissMessage }
  }, children);
};
var useMessage = () => {
  const { showMessage } = useContext5(MessageContext);
  return { showMessage };
};
var useMessageAreaState = () => {
  const { message, dismissMessage } = useContext5(MessageContext);
  return { message, dismissMessage };
};
var MessageContext_default = useMessage;

// src/SpinnerContext.tsx
import React6, { createContext as createContext6, useCallback as useCallback5, useContext as useContext6, useState as useState5 } from "react";
var SpinnerContext = createContext6({
  showSpinner: () => {
  },
  dismissSpinner: () => {
  },
  showing: false
});
var SpinnerProvider = ({ children }) => {
  const [spinnerCount, setSpinnerCount] = useState5(0);
  const showSpinner = useCallback5(() => {
    setSpinnerCount((prev) => prev + 1);
  }, []);
  const dismissSpinner = useCallback5(() => {
    setSpinnerCount((prev) => prev - 1);
  }, []);
  const showing = spinnerCount > 0;
  return /* @__PURE__ */ React6.createElement(SpinnerContext.Provider, {
    value: { showSpinner, dismissSpinner, showing }
  }, children);
};
var useSpinner = () => {
  const { showSpinner, dismissSpinner } = useContext6(SpinnerContext);
  return { showSpinner, dismissSpinner };
};
var useSpinnerAreaState = () => {
  const { showing } = useContext6(SpinnerContext);
  return { showing };
};
var SpinnerContext_default = useSpinner;

// src/InfrastructureProvider.tsx
var InfrastructureProvider = ({
  appConfig,
  children
}) => /* @__PURE__ */ React7.createElement(MessageProvider, null, /* @__PURE__ */ React7.createElement(SpinnerProvider, null, /* @__PURE__ */ React7.createElement(AppConfigProvider, {
  appConfig
}, /* @__PURE__ */ React7.createElement(UserProvider, null, /* @__PURE__ */ React7.createElement(DDBProvider, null, /* @__PURE__ */ React7.createElement(LambdaProvider, null, children))))));
var InfrastructureProvider_default = InfrastructureProvider;

// src/useAuthRedirect.ts
import { useEffect as useEffect5 } from "react";

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
  useEffect5(() => {
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
var BaseAppScope = ({ appConfig, routes, children }) => /* @__PURE__ */ React8.createElement(InfrastructureProvider_default, {
  appConfig
}, /* @__PURE__ */ React8.createElement(RedirectAuthCode, null), /* @__PURE__ */ React8.createElement(HashRouter, null, children, /* @__PURE__ */ React8.createElement(Routes, null, routes.map((route) => /* @__PURE__ */ React8.createElement(Route, {
  key: `${route.name}-route`,
  exact: true,
  path: route.path,
  element: /* @__PURE__ */ React8.createElement(route.component, null),
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
import { useLocation } from "react-router-dom";
var useAppBarState = (routes) => {
  const {
    appConfig: { appMessages, hideLogin, appExternalLoginUrl }
  } = AppConfigContext_default();
  const { showMessage } = MessageContext_default();
  const {
    user: { name: userName },
    logoff: logoff2
  } = UserContext_default();
  const location = useLocation();
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
export {
  BaseAppScope_default as BaseAppScope,
  makeAppConfig_default as makeAppConfig,
  useAppBarState_default as useAppBarState,
  AppConfigContext_default as useAppConfig,
  useAppDrawerState_default as useAppDrawerState,
  DDBContext_default as useDDB,
  LambdaContext_default as useLambda,
  MessageContext_default as useMessage,
  useMessageAreaState,
  SpinnerContext_default as useSpinner,
  useSpinnerAreaState,
  UserContext_default as useUser
};
//# sourceMappingURL=index.js.map
