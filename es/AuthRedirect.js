import { createElement as e, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Backdrop, CircularProgress, useTheme } from '@material-ui/core';
import useAppConfig from './AppConfigContext';
import useMessage from './MessageContext';
import useUser from './UserContext';

var AuthRedirect = function AuthRedirect() {
  var _useAppConfig = useAppConfig(),
      appMessages = _useAppConfig.appConfig.appMessages;

  var _useMessage = useMessage(),
      showMessage = _useMessage.showMessage;

  var _useUser = useUser(),
      loginWithAuthorizationCode = _useUser.loginWithAuthorizationCode;

  var _useParams = useParams(),
      authorizationCode = _useParams.authorization_code;

  var _useState = useState(true),
      loading = _useState[0],
      setLoading = _useState[1];

  var theme = useTheme();
  var history = useHistory();
  useEffect(function () {
    loginWithAuthorizationCode(authorizationCode).then(function () {
      showMessage(appMessages.LOGIN_SUCCESSFUL);
      history.replace('/');
    })["catch"](function () {
      showMessage(appMessages.LOGIN_FAILED);
      setLoading(false);
    });
  }, [authorizationCode, loginWithAuthorizationCode, showMessage, history, appMessages]);
  return e(Backdrop, {
    open: loading,
    style: {
      zIndex: 1 + theme.zIndex.drawer
    }
  }, e(CircularProgress, null, null));
};

export default AuthRedirect;