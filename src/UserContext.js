import React from 'react';

import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';

import useAppConfig from './AppConfigContext';

const e = React.createElement;

const UserContext = React.createContext();

const useSetInterval = (callback, seconds) => {
  const intervalRef = React.useRef();
  const cancel = React.useCallback(() => {
    const interval = intervalRef.current;
    if (interval) {
      intervalRef.current = undefined;
      clearInterval(interval);
    }
  }, [intervalRef]);

  React.useEffect(() => {
    intervalRef.current = setInterval(callback, seconds);
    return cancel;
  }, [callback, seconds, cancel]);

  return cancel;
};

const UserProvider = ({ children }) => {
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
  } = useAppConfig();

  const [user, setUser] = React.useState({
    identityId: undefined,
    id: undefined,
    name: undefined,
    email: undefined,
    groups: undefined,
    idToken: undefined,
    accessToken: undefined
  });
  const [refreshToken, setRefreshToken] = React.useState(
    sessionStorage.getItem(appRefreshTokenStorageKey)
  );
  const [awsConfig, setAwsConfig] = React.useState(undefined);
  const [refreshTokenInterval] = React.useState(25 * 60000);
  const [awsCredentials, setAwsCredentials] = React.useState(undefined);

  React.useEffect(() => {
    if (refreshToken) {
      sessionStorage.setItem(appRefreshTokenStorageKey, refreshToken);
    } else {
      sessionStorage.removeItem(appRefreshTokenStorageKey);
    }
  }, [refreshToken, appRefreshTokenStorageKey]);

  const logoff = React.useCallback(() => (
    new Promise((resolve) => {
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
    })
  ), []);

  React.useEffect(() => {
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
      setAwsConfig(undefined);
    }
  }, [awsCredentials, appRegion]);

  const loginWithAwsCognitoIdentityPool = React.useCallback((idToken, accessToken) => {
    const newCredentials = fromCognitoIdentityPool({
      client: new CognitoIdentityClient({
        region: appRegion
      }),
      identityPoolId: appIdentityPoolId,
      ...(idToken && { logins: { [appUserPoolId]: idToken } })
    });

    return new Promise((resolve, reject) => {
      newCredentials().then((creds) => {
        setAwsCredentials(newCredentials);
        setUser((oldUser) => {
          const idTokenPayload = idToken && JSON.parse(atob(idToken.split('.')[1]));
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
      }).catch((err) => {
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

  const refreshIdAndAccessTokens = React.useCallback((refreshTokenParam) => (
    new Promise((resolve, reject) => {
      if (refreshTokenParam) {
        fetch(appAuthUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
    })
  ), [loginWithAwsCognitoIdentityPool, appAuthUrl, appClientId, appMessages]);

  const scheduledRefreshIdAndAccessTokens = React.useCallback(() => {
    refreshIdAndAccessTokens(refreshToken).catch((err) => {
      console.error(appMessages.LOG_COULD_NOT_REFRESH_TOKENS, err);
    });
  }, [refreshToken, refreshIdAndAccessTokens, appMessages]);

  useSetInterval(scheduledRefreshIdAndAccessTokens, refreshTokenInterval);

  const loginAnonymously = React.useCallback(() => (
    loginWithAwsCognitoIdentityPool()
  ), [loginWithAwsCognitoIdentityPool]);

  const loginWithAuthorizationCode = React.useCallback((authorizationCode) => (
    new Promise((resolve, reject) => {
      fetch(appAuthUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=authorization_code&client_id=${appClientId}&code=${authorizationCode}&redirect_uri=${appAuthRedirect}`
      }).then((response) => {
        response.json().then((res) => {
          refreshIdAndAccessTokens(res.refresh_token).then(() => {
            setRefreshToken(res.refresh_token);
            resolve();
          }).catch((err) => {
            console.error(appMessages.LOG_COULD_NOT_LOGIN_WITH_REFRESHED_TOKENS, err);
            setRefreshToken(undefined);
            reject(err);
          });
        }).catch((err) => {
          console.error(appMessages.LOG_COULD_NOT_DECODE_AUTHENTICATION_RESPONSE, err);
          setRefreshToken(undefined);
          reject(err);
        });
      }).catch((err) => {
        console.error(appMessages.LOG_COULD_NOT_GET_IDENTIFICATION_TOKENS, err);
        setRefreshToken(undefined);
        reject(err);
      });
    })
  ), [refreshIdAndAccessTokens, appAuthRedirect, appAuthUrl, appClientId, appMessages]);

  React.useEffect(() => {
    if (refreshToken && !awsCredentials) {
      refreshIdAndAccessTokens(refreshToken).catch((err) => {
        console.error(appMessages.LOG_COULD_NOT_REFRESH_TOKENS, err);
      });
    }
  }, [refreshToken, awsCredentials, refreshIdAndAccessTokens, appMessages]);

  return e(UserContext.Provider,
    {
      value: {
        user,
        awsConfig,
        awsCredentials,
        loginAnonymously,
        loginWithAuthorizationCode,
        logoff
      }
    },
    children);
};

const useUser = () => {
  const {
    user,
    awsConfig,
    awsCredentials,
    loginAnonymously,
    loginWithAuthorizationCode,
    logoff
  } = React.useContext(UserContext);

  return {
    user,
    awsConfig,
    awsCredentials,
    loginAnonymously,
    loginWithAuthorizationCode,
    logoff
  };
};

export default useUser;
export { UserProvider };
