// src/UserContext.js
import React2, {
  createContext as createContext2,
  useCallback,
  useContext as useContext2,
  useEffect,
  useRef,
  useState
} from "react";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";

// src/AppConfigContext.js
import React, { createContext, useContext } from "react";
var AppConfigContext = createContext();
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
var AppConfigProvider = ({ appConfig, children }) => /* @__PURE__ */ React.createElement(AppConfigContext.Provider, {
  value: { appConfig }
}, children);
var useAppConfig = () => {
  const { appConfig } = useContext(AppConfigContext);
  return { appConfig };
};
var AppConfigContext_default = useAppConfig;

// src/UserContext.js
var UserContext = createContext2();
var useSetInterval = (callback, seconds) => {
  const intervalRef = useRef();
  const cancel = useCallback(() => {
    const interval = intervalRef.current;
    if (interval) {
      intervalRef.current = void 0;
      clearInterval(interval);
    }
  }, [intervalRef]);
  useEffect(() => {
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
  const [user, setUser] = useState({
    identityId: void 0,
    id: void 0,
    name: void 0,
    email: void 0,
    groups: void 0,
    idToken: void 0,
    accessToken: void 0
  });
  const [refreshToken, setRefreshToken] = useState(
    sessionStorage.getItem(appRefreshTokenStorageKey)
  );
  const [awsConfig, setAwsConfig] = useState(void 0);
  const [refreshTokenInterval] = useState(25 * 6e4);
  const [awsCredentials, setAwsCredentials] = useState(void 0);
  useEffect(() => {
    if (refreshToken) {
      sessionStorage.setItem(appRefreshTokenStorageKey, refreshToken);
    } else {
      sessionStorage.removeItem(appRefreshTokenStorageKey);
    }
  }, [refreshToken, appRefreshTokenStorageKey]);
  const logoff = useCallback(() => new Promise((resolve) => {
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
  useEffect(() => {
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
  const loginWithAwsCognitoIdentityPool = useCallback((idToken, accessToken) => {
    const newCredentials = fromCognitoIdentityPool({
      client: new CognitoIdentityClient({
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
  const refreshIdAndAccessTokens = useCallback((refreshTokenParam) => new Promise((resolve, reject) => {
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
  const scheduledRefreshIdAndAccessTokens = useCallback(() => {
    refreshIdAndAccessTokens(refreshToken).catch((err) => {
      console.error(appMessages.LOG_COULD_NOT_REFRESH_TOKENS, err);
    });
  }, [refreshToken, refreshIdAndAccessTokens, appMessages]);
  useSetInterval(scheduledRefreshIdAndAccessTokens, refreshTokenInterval);
  const loginAnonymously = useCallback(() => loginWithAwsCognitoIdentityPool(), [loginWithAwsCognitoIdentityPool]);
  const loginWithAuthorizationCode = useCallback((authorizationCode) => new Promise((resolve, reject) => {
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
  useEffect(() => {
    if (refreshToken && !awsCredentials) {
      refreshIdAndAccessTokens(refreshToken).catch((err) => {
        console.error(appMessages.LOG_COULD_NOT_REFRESH_TOKENS, err);
      });
    }
  }, [refreshToken, awsCredentials, refreshIdAndAccessTokens, appMessages]);
  return /* @__PURE__ */ React2.createElement(UserContext.Provider, {
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
  } = useContext2(UserContext);
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
var DDBContext = createContext3();
var DDBProvider = ({ children }) => {
  const { awsConfig, awsCredentials } = UserContext_default();
  const [documentDB, setDocumentDB] = useState2();
  useEffect2(() => {
    if (awsConfig) {
      const ddbClient = new DynamoDBClient(awsConfig);
      setDocumentDB(new DynamoDBDocumentClient(ddbClient));
    } else {
      setDocumentDB(void 0);
    }
  }, [awsConfig]);
  useEffect2(() => {
    if (awsCredentials) {
      setDocumentDB((oldDocumentDB) => {
        if (oldDocumentDB) {
          oldDocumentDB.service.config.update({ credentials: awsCredentials });
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
    (params) => documentDB.send(new GetCommand(params)),
    [documentDB]
  );
  const ddbPut = useCallback2(
    (params) => documentDB.send(new PutCommand(params)),
    [documentDB]
  );
  const ddbUpdate = useCallback2(
    (params) => documentDB.send(new UpdateCommand(params)),
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
import React4, {
  createContext as createContext4,
  useCallback as useCallback3,
  useContext as useContext4,
  useEffect as useEffect3,
  useState as useState3
} from "react";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
var LambdaContext = createContext4();
var LambdaProvider = ({ children }) => {
  const { user: { accessToken }, awsConfig, awsCredentials } = UserContext_default();
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
          oldLambda.config.update({ credentials: awsCredentials });
        }
        return oldLambda;
      });
    }
  }, [awsCredentials]);
  const invokeLambda = useCallback3((functionName, payload) => {
    const params = {
      FunctionName: functionName,
      ClientContext: btoa(JSON.stringify({ custom: { accessToken } }))
    };
    if (payload) {
      params.Payload = JSON.stringify(payload);
    }
    const command = new InvokeCommand(params);
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
  return /* @__PURE__ */ React4.createElement(LambdaContext.Provider, {
    value: { invokeLambda: lambda && invokeLambda }
  }, children);
};
var useLambda = () => {
  const { invokeLambda } = useContext4(LambdaContext);
  return { invokeLambda };
};
var LambdaContext_default = useLambda;

// src/BaseAppScope.js
import React8, { useEffect as useEffect6, useState as useState6 } from "react";
import {
  HashRouter,
  Route,
  Routes,
  useNavigate as useNavigate2
} from "react-router-dom";

// src/AuthRedirect.js
import { useEffect as useEffect5 } from "react";
import { useParams, useNavigate } from "react-router-dom";

// src/MessageContext.js
import React5, {
  createContext as createContext5,
  useCallback as useCallback4,
  useContext as useContext5,
  useEffect as useEffect4,
  useState as useState4
} from "react";
var MessageContext = createContext5();
var MessageProvider = ({ children }) => {
  const [snackPack, setSnackPack] = useState4([]);
  const [message, setMessage] = useState4(void 0);
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

// src/SpinnerContext.js
import React6, {
  createContext as createContext6,
  useCallback as useCallback5,
  useContext as useContext6,
  useState as useState5
} from "react";
var SpinnerContext = createContext6();
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

// src/AuthRedirect.js
var AuthRedirect = () => {
  const { appConfig: { appMessages } } = AppConfigContext_default();
  const { showMessage } = MessageContext_default();
  const { loginWithAuthorizationCode } = UserContext_default();
  const { authorization_code: authorizationCode } = useParams();
  const { showSpinner, dismissSpinner } = SpinnerContext_default();
  const navigate = useNavigate();
  useEffect5(
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
import React7 from "react";
var InfrastructureProvider = ({ appConfig, children }) => /* @__PURE__ */ React7.createElement(MessageProvider, null, /* @__PURE__ */ React7.createElement(SpinnerProvider, null, /* @__PURE__ */ React7.createElement(AppConfigProvider, {
  appConfig
}, /* @__PURE__ */ React7.createElement(UserProvider, null, /* @__PURE__ */ React7.createElement(DDBProvider, null, /* @__PURE__ */ React7.createElement(LambdaProvider, null, children))))));
var InfrastructureProvider_default = InfrastructureProvider;

// src/BaseAppScope.js
var useBaseAppScopeState = (appRoutes) => {
  const [routes] = useState6([
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
  const navigate = useNavigate2();
  useEffect6(() => {
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
var BaseAppScope = ({ appConfig, routes, children }) => /* @__PURE__ */ React8.createElement(InfrastructureProvider_default, {
  appConfig
}, /* @__PURE__ */ React8.createElement(HashRouter, null, children, /* @__PURE__ */ React8.createElement(RedirectAuthCode, {
  appConfig
}), /* @__PURE__ */ React8.createElement(Routes, null, routes.map((route) => /* @__PURE__ */ React8.createElement(Route, {
  key: `${route.name}-route`,
  exact: true,
  path: route.path,
  element: /* @__PURE__ */ React8.createElement(route.component, null),
  ...route.options
})))));
var BaseAppScope_default = BaseAppScope;

// src/useAppBarState.js
import { useLocation } from "react-router-dom";
var useAppBarState = (routes) => {
  const { appConfig: { appExternalLoginUrl, appMessages, hideLogin } } = AppConfigContext_default();
  const { showMessage } = MessageContext_default();
  const { user: { name: userName }, logoff } = UserContext_default();
  const location = useLocation();
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
export {
  BaseAppScope_default as BaseAppScope,
  makeAppConfig,
  useAppBarState_default as useAppBarState,
  AppConfigContext_default as useAppConfig,
  useAppDrawerState_default as useAppDrawerState,
  useBaseAppScopeState,
  DDBContext_default as useDDB,
  LambdaContext_default as useLambda,
  MessageContext_default as useMessage,
  useMessageAreaState,
  SpinnerContext_default as useSpinner,
  useSpinnerAreaState,
  UserContext_default as useUser
};
//# sourceMappingURL=index.js.map
